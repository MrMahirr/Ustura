/**
 * İstek üzerine rastgele / sahte veri üretir (migration değildir).
 *
 * Kullanım:
 *   npm run seed:random
 *   npm run seed:random -- --count=50
 *   npm run seed:random -- --count=100 --label=deneme1
 *
 * UYARI: Yalnızca geliştirme DB. Üretimde çalıştırmayın.
 */

const path = require('node:path');
const crypto = require('node:crypto');
const { Client } = require('pg');

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
  const fs = require('node:fs');
  const fileContents = fs.readFileSync(envFilePath, 'utf8');
  const lines = fileContents.split(/\r?\n/u);
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;
    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex <= 0) continue;
    const key = trimmedLine.slice(0, separatorIndex).trim();
    if (!key) continue;
    const rawValue = trimmedLine.slice(separatorIndex + 1);
    process.env[key] = parseEnvValue(rawValue);
  }
}

function loadEnvironment() {
  const fs = require('node:fs');
  const backendRoot = path.resolve(__dirname, '..');
  const repoRoot = path.resolve(__dirname, '..', '..');
  const candidateDirectories = [
    repoRoot,
    backendRoot,
    path.resolve(process.cwd(), '..'),
    process.cwd(),
  ];
  for (const directory of candidateDirectories) {
    for (const fileName of [...ENV_FILE_CANDIDATES].reverse()) {
      const envFilePath = path.join(directory, fileName);
      if (fs.existsSync(envFilePath)) {
        loadEnvFile(envFilePath);
      }
    }
  }
}

function readEnvNumber(name, fallback) {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;
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

function parseArgs(argv) {
  let count = 100;
  let label = '';
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      return { help: true };
    }
    const mCount = arg.match(/^--count=(\d+)$/u);
    if (mCount) {
      count = Number.parseInt(mCount[1], 10);
      continue;
    }
    const mLabel = arg.match(/^--label=(.+)$/u);
    if (mLabel) {
      label = mLabel[1];
    }
  }
  return { count, label, help: false };
}

function defaultLabel() {
  return `r${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
}

function sanitizeLabel(raw) {
  const t = String(raw || '')
    .replace(/[^a-zA-Z0-9_-]/gu, '')
    .slice(0, 32);
  return t.length > 0 ? t : defaultLabel();
}

/** personnel rol dağılımı: toplam tam olarak count */
function splitPersonnelRoles(count) {
  let owners = Math.max(1, Math.ceil(count * 0.15));
  let reception = Math.max(1, Math.ceil(count * 0.15));
  let barbers = count - owners - reception;
  while (barbers < 1 && owners + reception > 2) {
    if (owners >= reception && owners > 1) owners -= 1;
    else if (reception > 1) reception -= 1;
    barbers = count - owners - reception;
  }
  if (barbers < 1) {
    throw new Error('count çok küçük; en az 10 kullanın.');
  }
  return { owners, barbers, reception };
}

/**
 * label SQL string literal içinde güvenli (tek tırnak yok)
 */
function sqlLabelLiteral(label) {
  if (/[^a-zA-Z0-9_-]/u.test(label)) {
    throw new Error('label yalnızca harf, rakam, _ ve - olabilir.');
  }
  return label;
}

function buildSeedSql(count, label) {
  const L = sqlLabelLiteral(label);
  const { owners, barbers, reception } = splitPersonnelRoles(count);
  const salonPrefix = `SeedRand_${L}_Sal_`;
  const pkgTierPrefix = `rnd_${L}_pkg_`;

  return `
BEGIN;

-- 1) platform_admins × ${count}
INSERT INTO platform_admins (name, email, phone, password_hash, is_active)
SELECT
    'Rnd Admin ' || n || ' (' || (floor(random() * 900 + 100))::int || ')',
    'rnd.${L}.pa.' || n || '@seed.ustura.local',
    '+91' || lpad((floor(random() * 1e9))::bigint::text, 9, '0'),
    crypt('Seed123!', gen_salt('bf', 8)),
    (random() > 0.05)
FROM generate_series(1, ${count}) AS n;

-- 2) personnel (${owners} owner + ${barbers} barber + ${reception} receptionist)
INSERT INTO personnel (name, email, phone, password_hash, role, is_active)
SELECT
    'Rnd Owner ' || n,
    'rnd.${L}.po.' || n || '@seed.ustura.local',
    '+90' || lpad((7000000000 + n)::text, 10, '0'),
    crypt('Seed123!', gen_salt('bf', 8)),
    'owner',
    TRUE
FROM generate_series(1, ${owners}) AS n;

INSERT INTO personnel (name, email, phone, password_hash, role, is_active)
SELECT
    'Rnd Berber ' || n,
    'rnd.${L}.pb.' || n || '@seed.ustura.local',
    '+90' || lpad((7100000000 + n)::text, 10, '0'),
    crypt('Seed123!', gen_salt('bf', 8)),
    'barber',
    TRUE
FROM generate_series(1, ${barbers}) AS n;

INSERT INTO personnel (name, email, phone, password_hash, role, is_active)
SELECT
    'Rnd Resep ' || n,
    'rnd.${L}.pr.' || n || '@seed.ustura.local',
    '+90' || lpad((7200000000 + n)::text, 10, '0'),
    crypt('Seed123!', gen_salt('bf', 8)),
    'receptionist',
    TRUE
FROM generate_series(1, ${reception}) AS n;

-- 3) salons × ${count}
INSERT INTO salons (owner_id, name, address, city, district, working_hours)
SELECT
    po.id,
    '${salonPrefix.replace(/'/gu, "''")}' || s.n,
    'Rastgele adres ' || s.n || ' sk.',
    (ARRAY['Istanbul','Ankara','Izmir','Bursa','Antalya'])[1 + floor(random() * 5)::int],
    'Mahalle ' || (((s.n - 1) % 20) + 1),
    jsonb_build_object(
      'monday', jsonb_build_object('open', '09:00', 'close', '19:00'),
      'sunday', NULL
    )
FROM generate_series(1, ${count}) AS s (n)
INNER JOIN LATERAL (
    SELECT id
    FROM personnel
    WHERE role = 'owner'
      AND email = 'rnd.${L}.po.' || (((s.n - 1) % ${owners}) + 1) || '@seed.ustura.local'
    LIMIT 1
) po ON TRUE;

-- 4) staff × ${count}
INSERT INTO staff (user_id, salon_id, role, bio)
SELECT
    x.user_id,
    x.salon_id,
    'barber',
    'Rastgele bio #' || x.rn || ' — ' || left(md5(random()::text), 8)
FROM (
    SELECT
        p.id AS user_id,
        sl.id AS salon_id,
        row_number() OVER (ORDER BY random()) AS rn
    FROM personnel p
    CROSS JOIN salons sl
    WHERE p.email LIKE 'rnd.${L}.pb.%@seed.ustura.local'
      AND starts_with(sl.name, '${salonPrefix.replace(/'/gu, "''")}')
) x
WHERE x.rn <= ${count}
ON CONFLICT (user_id, salon_id) DO NOTHING;

-- 5) customers × ${count}
INSERT INTO customers (name, email, phone, password_hash, is_active)
SELECT
    'Rnd Musteri ' || n || ' ' || left(md5(random()::text), 6),
    'rnd.${L}.c.' || n || '@seed.ustura.local',
    '+90' || lpad((8000000000 + n)::text, 10, '0'),
    crypt('Seed123!', gen_salt('bf', 8)),
    (random() > 0.08)
FROM generate_series(1, ${count}) AS n;

-- 6) packages × ${count}
INSERT INTO packages (name, tier, tier_label, price_per_month, features, is_featured)
SELECT
    'Rnd Paket ' || n,
    '${pkgTierPrefix.replace(/'/gu, "''")}' || lpad(n::text, 5, '0'),
    'Etiket ' || n || ' / ' || (floor(random() * 500 + 99))::int || ' TL',
    (round((random() * 800 + 99)::numeric, 2))::decimal(12, 2),
    '[]'::jsonb,
    (random() > 0.85)
FROM generate_series(1, ${count}) AS n;

-- 7) reservations × ${count}
WITH rc AS (
    SELECT id, row_number() OVER (ORDER BY random()) AS rn
    FROM customers
    WHERE email LIKE 'rnd.${L}.c.%@seed.ustura.local'
),
rst AS (
    SELECT st.id AS staff_id, st.salon_id, row_number() OVER (ORDER BY random()) AS rn
    FROM staff st
    INNER JOIN personnel p ON p.id = st.user_id
    INNER JOIN salons sl ON sl.id = st.salon_id
    WHERE p.email LIKE 'rnd.${L}.pb.%@seed.ustura.local'
      AND starts_with(sl.name, '${salonPrefix.replace(/'/gu, "''")}')
)
INSERT INTO reservations (customer_id, salon_id, staff_id, slot_start, slot_end, status)
SELECT
    z.customer_id,
    z.salon_id,
    z.staff_id,
    z.slot_start,
    z.slot_start + interval '30 minutes',
    z.status
FROM (
    SELECT
        rc.id AS customer_id,
        rst.salon_id,
        rst.staff_id,
        timestamptz '2026-06-01 07:00:00+00'
            + (interval '1 minute' * (floor(random() * 30000) + (rc.rn * 40))) AS slot_start,
        (ARRAY['cancelled','no_show','completed','completed','completed'])[1 + floor(random() * 5)::int] AS status
    FROM rc
    INNER JOIN rst ON rst.rn = rc.rn
    WHERE rc.rn <= ${count}
) z;

-- 8) subscriptions × ${count}
INSERT INTO subscriptions (salon_id, package_id, start_date, end_date, status)
SELECT
    s.id,
    p.id,
    NOW() - ((floor(random() * 120))::text || ' days')::interval,
    NOW() + ((floor(random() * 300 + 180))::text || ' days')::interval,
    (ARRAY['active','active','pending','expired'])[1 + floor(random() * 4)::int]
FROM (
    SELECT id, row_number() OVER (ORDER BY random()) AS n
    FROM salons
    WHERE starts_with(name, '${salonPrefix.replace(/'/gu, "''")}')
) s
INNER JOIN (
    SELECT id, row_number() OVER (ORDER BY random()) AS n
    FROM packages
    WHERE starts_with(tier, '${pkgTierPrefix.replace(/'/gu, "''")}')
) p ON p.n = s.n
WHERE s.n <= ${count};

-- 9) owner_applications × ${count} (pending)
INSERT INTO owner_applications (
    applicant_name, applicant_email, applicant_phone, password_hash,
    salon_name, salon_address, salon_city, salon_district, salon_working_hours, status
)
SELECT
    'Rnd Basvuran ' || n,
    'rnd.${L}.oa.' || n || '@seed.ustura.local',
    '+90' || lpad((9000000000 + n)::text, 10, '0'),
    crypt('App123!', gen_salt('bf', 8)),
    'Rnd Salon Basvuru ' || n,
    'Cadde ' || n || ' adres',
    (ARRAY['Ankara','Istanbul','Izmir'])[1 + floor(random() * 3)::int],
    'Ilce ' || (((n - 1) % 8) + 1),
    '{}'::jsonb,
    'pending'
FROM generate_series(1, ${count}) AS n;

-- 10) audit_logs × ${count}
INSERT INTO audit_logs (actor_user_id, actor_role, action, entity_type, entity_id, metadata)
SELECT
    NULL,
    NULL,
    'seed.random',
    (ARRAY['salon','reservation','customer','staff'])[1 + floor(random() * 4)::int],
    gen_random_uuid(),
    jsonb_build_object('label', '${L}', 'seq', n, 'noise', md5(random()::text))
FROM generate_series(1, ${count}) AS n;

-- 11) notifications × ${count}
INSERT INTO notifications (recipient_id, recipient_kind, key, title, body, tone, metadata, is_read)
SELECT
    c.id,
    'customer',
    'seed.rnd.${L}',
    'Bildirim ' || n || ' / ' || left(md5(random()::text), 8),
    'Rastgele içerik #' || n,
    (ARRAY['primary','success','warning'])[1 + floor(random() * 3)::int],
    jsonb_build_object('n', n),
    (random() > 0.4)
FROM generate_series(1, ${count}) AS n
INNER JOIN customers c ON c.email = ('rnd.${L}.c.' || n || '@seed.ustura.local');

-- 12) refresh_tokens × ${count}
INSERT INTO refresh_tokens (principal_id, principal_kind, token_hash, expires_at, revoked)
SELECT
    c.id,
    'customer',
    encode(digest('rnd|${L}|' || n::text || '|' || gen_random_uuid()::text || '|' || random()::text, 'sha256'), 'hex'),
    NOW() + (((floor(random() * 60) + 30))::text || ' days')::interval,
    (random() > 0.9)
FROM generate_series(1, ${count}) AS n
INNER JOIN customers c ON c.email = ('rnd.${L}.c.' || n || '@seed.ustura.local');

COMMIT;
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`
seed-random-data.cjs — PostgreSQL'e rastgele demo verisi ekler (migration değildir).

  npm run seed:random
  npm run seed:random -- --count=100
  npm run seed:random -- --count=50 --label=benimtest

Seçenekler:
  --count=N   Tablo başına yaklaşık satır sayısı (varsayılan 100, en fazla 500)
  --label=X   E-posta / tier öneki (a-z, 0-9, _, -); verilmezse otomatik

Ortam: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (.env)
`);
    return;
  }

  let count = args.count;
  if (!Number.isFinite(count) || count < 10 || count > 500) {
    console.error('Hata: --count 10 ile 500 arasında olmalı.');
    process.exitCode = 1;
    return;
  }

  const label = sanitizeLabel(args.label);
  loadEnvironment();

  const sql = buildSeedSql(count, label);
  const client = createClient();
  await client.connect();
  try {
    const chk = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'customers'
      ) AS ok
    `);
    if (!chk.rows[0]?.ok) {
      console.error('Hata: customers tablosu yok. Önce `npm run migrate` çalıştırın (012 kimlik ayrımı).');
      process.exitCode = 1;
      return;
    }

    console.log(`Seed başlıyor: label=${label}, count≈${count} (tablo başına)`);
    await client.query(sql);
    console.log('Tamamlandı.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
