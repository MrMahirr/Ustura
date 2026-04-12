const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const MIGRATIONS_DIR = path.resolve(__dirname, '..', 'src', 'database', 'migrations');
const STATUS_MODE = process.argv.includes('--status');
const ENV_FILE_CANDIDATES = ['.env.local', '.env'];

function parseEnvValue(rawValue) {
  const trimmedValue = rawValue.trim();

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function loadEnvFile(envFilePath) {
  const fileContents = fs.readFileSync(envFilePath, 'utf8');
  const lines = fileContents.split(/\r?\n/u);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();

    if (!key) {
      continue;
    }

    const rawValue = trimmedLine.slice(separatorIndex + 1);
    process.env[key] = parseEnvValue(rawValue);
  }
}

function loadEnvironment() {
  const candidateDirectories = [path.resolve(process.cwd(), '..'), process.cwd()];

  for (const directory of candidateDirectories) {
    for (const fileName of [...ENV_FILE_CANDIDATES].reverse()) {
      const envFilePath = path.join(directory, fileName);

      if (!fs.existsSync(envFilePath)) {
        continue;
      }

      loadEnvFile(envFilePath);
    }
  }
}

loadEnvironment();

function readEnvNumber(name, fallback) {
  const rawValue = process.env[name];

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer.`);
  }

  return parsedValue;
}

function createClient() {
  return new Client({
    host: process.env.DB_HOST || 'localhost',
    port: readEnvNumber('DB_PORT', 5432),
    database: process.env.DB_NAME || 'ustura',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD ?? ''),
  });
}

function listMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => entry.name)
    .sort();
}

async function ensureSchemaMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function readAppliedMigrations(client) {
  const result = await client.query(`
    SELECT filename, applied_at
    FROM schema_migrations
    ORDER BY filename ASC
  `);

  return new Map(
    result.rows.map((row) => [row.filename, row.applied_at]),
  );
}

async function tableExists(client, tableName) {
  const result = await client.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
      ) AS exists
    `,
    [tableName],
  );

  return result.rows[0]?.exists === true;
}

async function columnExists(client, tableName, columnName) {
  const result = await client.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
      ) AS exists
    `,
    [tableName, columnName],
  );

  return result.rows[0]?.exists === true;
}

async function constraintExists(client, tableName, constraintName) {
  const result = await client.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = 'public'
          AND table_name = $1
          AND constraint_name = $2
      ) AS exists
    `,
    [tableName, constraintName],
  );

  return result.rows[0]?.exists === true;
}

async function indexExists(client, tableName, indexName) {
  const result = await client.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = $1
          AND indexname = $2
      ) AS exists
    `,
    [tableName, indexName],
  );

  return result.rows[0]?.exists === true;
}

async function baselineLegacySetupIfNeeded(client, appliedMigrations) {
  if (appliedMigrations.size > 0) {
    return;
  }

  const coreTables = ['users', 'salons', 'staff', 'reservations', 'refresh_tokens'];
  const coreTablesExist = [];

  for (const tableName of coreTables) {
    coreTablesExist.push(await tableExists(client, tableName));
  }

  if (coreTablesExist.every(Boolean)) {
    await client.query(
      `
        INSERT INTO schema_migrations (filename)
        VALUES ($1)
        ON CONFLICT (filename) DO NOTHING
      `,
      ['001_init_tables.sql'],
    );
    appliedMigrations.set('001_init_tables.sql', new Date());
    console.log('Baselined legacy migration: 001_init_tables.sql');
  }

  if (await columnExists(client, 'users', 'firebase_uid')) {
    await client.query(
      `
        INSERT INTO schema_migrations (filename)
        VALUES ($1)
        ON CONFLICT (filename) DO NOTHING
      `,
      ['002_add_customer_google_auth.sql'],
    );
    appliedMigrations.set('002_add_customer_google_auth.sql', new Date());
    console.log('Baselined legacy migration: 002_add_customer_google_auth.sql');
  }

  const reservationSchemaUpdated =
    (await columnExists(client, 'reservations', 'cancelled_at')) &&
    (await columnExists(client, 'reservations', 'cancelled_by_user_id')) &&
    (await columnExists(client, 'reservations', 'status_changed_at')) &&
    (await columnExists(client, 'reservations', 'status_changed_by_user_id')) &&
    (await constraintExists(
      client,
      'reservations',
      'chk_reservations_status_lifecycle',
    )) &&
    (await constraintExists(
      client,
      'reservations',
      'chk_reservations_slot_duration',
    )) &&
    (await indexExists(client, 'reservations', 'uq_reservations_active_staff_slot'));

  if (reservationSchemaUpdated) {
    await client.query(
      `
        INSERT INTO schema_migrations (filename)
        VALUES ($1)
        ON CONFLICT (filename) DO NOTHING
      `,
      ['003_rework_reservation_schema.sql'],
    );
    appliedMigrations.set('003_rework_reservation_schema.sql', new Date());
    console.log('Baselined legacy migration: 003_rework_reservation_schema.sql');
  }
}

async function printStatus(client) {
  const migrationFiles = listMigrationFiles();
  const appliedMigrations = await readAppliedMigrations(client);

  for (const migrationFile of migrationFiles) {
    const status = appliedMigrations.has(migrationFile) ? 'APPLIED' : 'PENDING';
    console.log(`${status.padEnd(8)} ${migrationFile}`);
  }
}

async function applyPendingMigrations(client) {
  const migrationFiles = listMigrationFiles();
  const appliedMigrations = await readAppliedMigrations(client);

  await baselineLegacySetupIfNeeded(client, appliedMigrations);

  for (const migrationFile of migrationFiles) {
    if (appliedMigrations.has(migrationFile)) {
      continue;
    }

    const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`Applying migration ${migrationFile}...`);

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `
          INSERT INTO schema_migrations (filename)
          VALUES ($1)
        `,
        [migrationFile],
      );
      await client.query('COMMIT');
      console.log(`Applied migration ${migrationFile}.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  console.log('Database migrations are up to date.');
}

async function main() {
  const client = createClient();
  await client.connect();

  try {
    await ensureSchemaMigrationsTable(client);

    if (STATUS_MODE) {
      await printStatus(client);
      return;
    }

    await applyPendingMigrations(client);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
