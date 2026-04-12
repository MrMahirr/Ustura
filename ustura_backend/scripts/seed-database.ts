import { Client } from 'pg';
import { faker } from '@faker-js/faker/locale/tr';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const COUNT = 100;

function readEnvNumber(name: string, fallback: number): number {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;
  const parsedValue = Number(rawValue);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: readEnvNumber('DB_PORT', 5432),
  database: process.env.DB_NAME || 'ustura',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD as string,
});

async function main() {
  await client.connect();
  console.log('🔗 Veritabanına bağlanıldı. Seed işlemi başlıyor...');

  // Temizlik isteğe bağlıdır, fakat primary key hatalarını önlemek için yorumda bırakıyoruz.
  // await client.query('TRUNCATE TABLE reservations, staff, salons, users, owner_applications, refresh_tokens RESTART IDENTITY CASCADE');

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const now = new Date();

  // 1. ÜRETİMLER: USERS (100 adet)
  console.log('⏳ 1. Kullanıcılar (Users) üretiliyor...');
  const users: { id: string; role: string }[] = [];
  const roles = ['customer', 'barber', 'owner', 'receptionist', 'super_admin'];
  
  for (let i = 0; i < COUNT; i++) {
    // Orantılı rol ataması
    let role = 'customer';
    if (i < 20) role = 'owner';
    else if (i < 60) role = 'barber';
    else if (i < 80) role = 'customer';
    else if (i < 95) role = 'receptionist';
    else role = 'super_admin';

    const result = await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, role`,
      [
        faker.person.fullName(),
        faker.internet.email() + i, // unique garanti etmek icin i ekliyoruz
        faker.phone.number({ style: 'national' }).slice(0, 20),
        passwordHash,
        role,
      ]
    );
    users.push(result.rows[0]);
  }
  const owners = users.filter((u) => u.role === 'owner');
  const barbers = users.filter((u) => u.role === 'barber');
  const customers = users.filter((u) => u.role === 'customer');

  // 2. ÜRETİMLER: SALONS (100 adet)
  console.log('⏳ 2. Salonlar (Salons) üretiliyor...');
  const salons: string[] = [];
  for (let i = 0; i < COUNT; i++) {
    const ownerId = faker.helpers.arrayElement(owners).id;
    const workingHours = {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '15:00' },
      sunday: null,
    };

    const result = await client.query(
      `INSERT INTO salons (owner_id, name, address, city, district, photo_url, working_hours) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        ownerId,
        faker.company.name() + ' Berber',
        faker.location.streetAddress(),
        faker.location.city(),
        faker.location.county(),
        faker.image.url(),
        workingHours, // node-pg otomatik olarak json stringify yapar
      ]
    );
    salons.push(result.rows[0].id);
  }

  // 3. ÜRETİMLER: STAFF (100 adet)
  console.log('⏳ 3. Çalışanlar (Staff) üretiliyor...');
  const staff: string[] = [];
  for (let i = 0; i < COUNT; i++) {
    // Unique user + salon ikilisi saglamak icin basit atama yapiyoruz
    const barberIndex = i % barbers.length; 
    const salonIndex = i % salons.length;

    await client.query(
      `INSERT INTO staff (user_id, salon_id, role, bio) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, salon_id) DO NOTHING
       RETURNING id`,
      [
        barbers[barberIndex].id,
        salons[salonIndex],
        'barber',
        faker.person.bio(),
      ]
    ).then(res => {
        if(res.rows[0]) staff.push(res.rows[0].id);
    });
  }

  // Eger staff uniq constraint yuzunden az eklendiyse rastgele ekleyerek 100'e tamamlamaya calis
  let staffAttempt = 0;
  while(staff.length < COUNT && staffAttempt < 200) {
     staffAttempt++;
     const barberId = faker.helpers.arrayElement(barbers).id;
     const salonId = faker.helpers.arrayElement(salons);
     const res = await client.query(
      `INSERT INTO staff (user_id, salon_id, role, bio) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, salon_id) DO NOTHING
       RETURNING id`,
      [barberId, salonId, 'barber', faker.person.bio()]
    );
    if(res.rows[0]) {
        staff.push(res.rows[0].id);
    }
  }

  // 4. ÜRETİMLER: RESERVATIONS (100 adet)
  console.log('⏳ 4. Rezervasyonlar (Reservations) üretiliyor...');
  for (let i = 0; i < COUNT; i++) {
    const customerId = faker.helpers.arrayElement(customers).id;
    // Herhangi bir staff ve o staffin bagli oldugu salon alinmali. (Bizim staff objemiz sdc id arrayi, db'den bulalim)
    const randomStaffId = faker.helpers.arrayElement(staff);
    const staffRec = await client.query(`SELECT salon_id FROM staff WHERE id = $1`, [randomStaffId]);
    const salonId = staffRec.rows[0].salon_id;

    // Slot start, end
    const start = faker.date.future();
    const end = new Date(start.getTime() + 30 * 60000); // 30 min later

    // status IN ('pending', 'confirmed', 'cancelled')
    const statuses = ['pending', 'confirmed', 'cancelled'];

    await client.query(
      `INSERT INTO reservations (customer_id, salon_id, staff_id, slot_start, slot_end, status, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING`,
      [
        customerId,
        salonId,
        randomStaffId,
        start,
        end,
        faker.helpers.arrayElement(statuses),
        faker.lorem.sentence(),
      ]
    );
  }

  // 5. ÜRETİMLER: OWNER APPLICATIONS (Eğer tablo var ise 100 adet)
  console.log('⏳ 5. Sahip Başvuruları (Owner Applications) üretiliyor...');
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables WHERE table_name = 'owner_applications'
    )`);
  if (tableCheck.rows[0].exists) {
    for (let i = 0; i < COUNT; i++) {
      await client.query(
        `INSERT INTO owner_applications (
          applicant_name, applicant_email, applicant_phone, password_hash,
          salon_name, salon_address, salon_city, salon_district, salon_working_hours, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          faker.person.fullName(),
          faker.internet.email() + i,
          faker.phone.number({ style: 'national' }).slice(0, 20),
          passwordHash,
          faker.company.name() + ' Salon',
          faker.location.streetAddress(),
          faker.location.city(),
          faker.location.county(),
          {},
          'pending'
        ]
      );
    }
  }

  console.log('✅ Bütün sahte veriler başarıyla eklendi! (Her tablo için en az ~100 adet veri oluşturuldu)');
  await client.end();
}

main().catch((error) => {
  console.error('❌ Hata oluştu:', error);
  process.exitCode = 1;
});
