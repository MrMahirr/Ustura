# Ustura Backend

Ustura backend, salon rezervasyon ve platform yonetimi icin gelistirilmis NestJS tabanli bir modular monolith uygulamasidir. Sistem; musteri rezervasyon akisi, salon ve personel yonetimi, super admin operasyonlari, paket/abonelik, bildirim, audit log ve saglik kontrollerini tek kod tabaninda toplar.

## Yigin

- NestJS 11
- TypeScript
- PostgreSQL (`pg`)
- Redis (`ioredis`)
- JWT + Passport
- Swagger / OpenAPI
- EmailJS Node API
- Socket.IO

## Temel Ozellikler

- Musteri kaydi, e-posta/sifre girisi, Google web/Firebase tabanli musteri girisi
- Access/refresh token tabanli oturum yonetimi, refresh rotation, logout-all
- Super admin onayli salon sahibi basvuru akisi
- Public salon listeleme, salon detay, sehir filtreleme
- Salon sahibi tarafinda salon, vitrin, galeri, hizmet ve personel yonetimi
- Personel tarafinda self-service staff uyelik ve fotograf guncelleme
- 30 dakikalik slotlarla rezervasyon, status guncelleme ve iptal akisi
- Redis lock + DB transaction + aktif slot unique index ile cakisma korumasi
- Paket, abonelik ve onay kuyrugu yonetimi
- Notification ve audit log yan etkilerinin event bus uzerinden islenmesi
- Health/live ve health/ready endpointleri

## Mimari Ozet

Backend, `src/` altinda asagidaki omurgayla organize edilir:

```text
src/
  common/       -> decorator, guard, filter, interceptor, pipe
  config/       -> env validation + typed config service
  database/     -> pg pool, query ve transaction wrapper, migrations
  events/       -> domain event bus
  modules/      -> business ve system modulleri
  redis/        -> redis client + dev fallback
  shared/       -> auth enum/type gibi paylasilan tipler
  startup/      -> startup readiness validation
```

Temel prensipler:

- Moduler monolith yapisi korunur.
- API dis yuzeyi DTO ve service katmani ile ayrilir.
- Raw SQL repository katmaninda tutulur; ORM kullanilmaz.
- Kritik mutasyonlar transaction ile sarilir.
- Yan etkiler dogrudan is akisini bloklamak yerine event bus uzerinden tetiklenir.

## Uygulama Baslangici

Bootstrap akisi [src/main.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/main.ts) icinde tanimlidir:

- `helmet` aktif
- Global exception filter aktif
- Response transform interceptor aktif
- Global validation pipe: `whitelist`, `forbidNonWhitelisted`, `transform`
- CORS, env uzerinden gelen origin listesine gore acilir
- Swagger, `apiPrefix` altinda yayinlanir
- `uploads/` klasoru static asset olarak serve edilir
- Startup sirasinda health/readiness kontrolu calisir

## Config ve Env

Config katmani [src/config](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/config) altindadir. `ConfigModule`, `.env.local` ve `.env` dosyalarini hem backend klasorunde hem bir ust dizinde arar; ardindan tip dogrulamasi yapar.

### Zorunlu veya kritik env degiskenleri

- `PORT`
- `NODE_ENV`
- `API_PREFIX`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_POOL_MIN`
- `DB_POOL_MAX`
- `DB_CONNECTION_TIMEOUT_MS`
- `DB_IDLE_TIMEOUT_MS`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRATION`
- `JWT_REFRESH_EXPIRATION`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CERTS_URL`
- `GOOGLE_WEB_CLIENT_ID`
- `CORS_ORIGINS`
- `CORS_CREDENTIALS`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_APPROVAL`
- `EMAILJS_TEMPLATE_STAFF_WELCOME`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`
- `FRONTEND_BASE_URL`

### Davranis notlari

- Production ortaminda zayif veya placeholder `JWT_SECRET` kabul edilmez.
- CORS origin listesi bos birakilamaz.
- `DB_POOL_MAX`, `DB_POOL_MIN` degerinden kucuk olamaz.
- Reservation config su an kod icinde typed config olarak sabittir:
  - slot suresi: `30` dakika
  - slot selection TTL: `45` saniye
  - lock TTL: `5` saniye
  - business timezone: `Europe/Istanbul`

## Veritabani ve Migration

Veritabani katmani [src/database/database.service.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/database/database.service.ts) uzerinden calisir.

Saglanan davranislar:

- `pg.Pool` ile merkezi connection havuzu
- Named query destekli `query()`
- `transaction()` helper'i
- PostgreSQL hata kodlarini uygulama seviyesinde normalize eden DB error katmani

Migration dosyalari [src/database/migrations](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/database/migrations) altindadir.

Mevcut migration zinciri:

- `001_init_tables.sql`
- `002_add_customer_google_auth.sql`
- `003_rework_reservation_schema.sql`
- `004_create_owner_applications.sql`
- `005_create_audit_logs.sql`
- `006_harden_refresh_tokens.sql`
- `007_enforce_user_phone_uniqueness.sql`
- `008_seed_default_super_admin.sql`
- `009_create_packages_schema.sql`
- `010_seed_test_staff_accounts.sql`
- `011_create_notifications.sql`
- `012_split_identity_tables.sql`
- `013_seed_demo_identity.sql`
- `014_ensure_packages_tier_label.sql`
- `015_ensure_salons_is_active.sql`
- `016_owner_applications_review_state_allow_null_salon.sql`
- `017_personnel_must_change_password.sql`
- `018_fix_seed_uuid_format.sql`
- `019_add_salon_gallery_urls.sql`
- `020_create_salon_services.sql`

Migration calistirma araci [scripts/run-migrations.cjs](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/scripts/run-migrations.cjs) icindedir.

Komutlar:

```bash
npm run migrate
npm run migrate:status
```

Script; `schema_migrations` tablosunu yonetir, legacy schema icin bazi baseline durumlarini tanir ve migration'lari transaction icinde uygular.

## Redis ve Slot Lock

Redis katmani [src/redis/redis.service.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/redis/redis.service.ts) icindedir.

Davranis:

- Production ortaminda gercek Redis baglantisi beklenir
- Development/test ortaminda Redis ulasilamazsa in-memory fallback devreye girebilir
- Slot secimi ve rezervasyon lock mantigi bu katmani kullanir

Bu tercih lokal gelistirmeyi kolaylastirir; ancak production'da fallback kabul edilmez.

## Event Bus

[src/events/domain-event-bus.service.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/events/domain-event-bus.service.ts) icindeki hafif event bus ile best-effort event yayini yapilir.

Kullanim amaci:

- Notification consumer
- Audit log consumer
- Gelecekte cache invalidation veya outbox gecisi icin hazir bir baglanti noktasi

Mevcut event ornekleri:

- `reservation.created`
- `reservation.cancelled`
- `reservation.status_changed`
- `staff.created`
- `owner.approved`
- `auth.logged_out`

## Auth Modeli

Auth modulu [src/modules/auth](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/modules/auth) altindadir.

Desteklenen principal ayrimi:

- `customer`
- `personnel`
- `platform_admin`

Desteklenen roller:

- `super_admin`
- `owner`
- `barber`
- `receptionist`
- `customer`

One cikan auth davranislari:

- Musteri register/login
- Google customer login
- Refresh token rotation
- Logout ve logout-all
- Sifre degistirme
- Personel tarafinda `mustChangePassword` zorlugu
- Refresh token reuse tespiti ve session revoke mantigi

JWT payload alanlari:

- `sub`
- `email`
- `role`
- `principalKind`
- `mustChangePassword`
- `tokenType`

## Modul Haritasi

### `AuthModule`

Sorumluluk:

- Kayit, giris, refresh, logout, sifre degistirme
- JWT issuance
- Refresh token saklama/rotate etme
- Google/Firebase customer auth

Ana endpointler:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google/customer`
- `GET /auth/google/customer/web/config`
- `POST /auth/google/customer/web`
- `POST /auth/refresh`
- `POST /auth/password/change`
- `POST /auth/logout`
- `POST /auth/logout-all`

### `UserModule`

Sorumluluk:

- Kullanici/profil okuma ve guncelleme
- Super admin tarafinda kullanici listeleme ve durum yonetimi
- Diger modullere provisioning/query contract saglama

Ana endpointler:

- `GET /users/me`
- `PATCH /users/me`
- `GET /users/admin`
- `GET /users/admin/:id`
- `GET /users/admin/:id/detail`
- `PATCH /users/admin/:id/status`
- `PATCH /users/admin/:id/profile`

### `SalonModule`

Sorumluluk:

- Public salon katalogu
- Owner salon CRUD
- Super admin salon yonetimi
- Salon medya/vitrin yonetimi

Ana endpointler:

- `GET /salons`
- `GET /salons/cities`
- `GET /salons/:salonId`
- `GET /salons/owned`
- `POST /salons`
- `PATCH /salons/:salonId`
- `DELETE /salons/:salonId`
- `GET /salons/admin`
- `GET /salons/admin/cities`
- `GET /salons/admin/:salonId`
- `PATCH /salons/admin/:salonId`
- `DELETE /salons/admin/:salonId`
- `POST /salons/:salonId/storefront-photo`
- `DELETE /salons/:salonId/storefront-photo`
- `POST /salons/:salonId/storefront-gallery`
- `DELETE /salons/:salonId/storefront-gallery`

Not:

- Fotograf ve galeri dosyalari lokal `uploads/` altinda tutulur.
- Owner ve super admin icin ayri yonetim akisleri vardir.

### `SalonServiceModule`

Sorumluluk:

- Salon hizmet tanimlari

Ana endpointler:

- `GET /salons/:salonId/services`
- `GET /salons/:salonId/services/owned`
- `POST /salons/:salonId/services`
- `PATCH /salons/:salonId/services/:serviceId`
- `DELETE /salons/:salonId/services/:serviceId`

### `StaffModule`

Sorumluluk:

- Salon staff uyelikleri
- Owner tarafinda staff CRUD
- Personel self-service assignment/foto akisleri

Ana endpointler:

- `GET /salons/:salonId/staff`
- `POST /salons/:salonId/staff`
- `PATCH /salons/:salonId/staff/:staffId`
- `DELETE /salons/:salonId/staff/:staffId`
- `POST /salons/:salonId/staff/:staffId/photo`
- `DELETE /salons/:salonId/staff/:staffId/photo`
- `GET /staff/me`
- `POST /staff/me/:staffId/photo`
- `DELETE /staff/me/:staffId/photo`

Not:

- Staff olusturma/guncelleme transaction icinde user + membership mantigi ile yurur.
- Staff welcome mail altyapisi EmailJS ile baglanmistir.

### `ReservationModule`

Sorumluluk:

- Rezervasyon olusturma, listeleme, iptal ve status guncelleme
- Slot listeleme
- Canli slot secimi icin WebSocket gateway

Ana endpointler:

- `POST /reservations`
- `GET /reservations/my`
- `GET /reservations/salon/:salonId`
- `PATCH /reservations/:reservationId/status`
- `DELETE /reservations/:reservationId`
- `GET /salons/:salonId/slots`

WebSocket:

- namespace: `/slots`
- eventler:
  - `slot:join`
  - `slot:select`
  - `slot:unselect`
  - `slot:selection.snapshot`

Rezervasyon guvenligi:

- Redis lock
- DB transaction
- Active reservation partial unique index
- Role/policy tabanli status gecisleri

### `PlatformAdminModule`

Sorumluluk:

- Owner application intake ve super admin approval workflow
- Platform ayarlari goruntuleme

Ana endpointler:

- `POST /owner-applications`
- `GET /admin/owner-applications`
- `PATCH /admin/owner-applications/:applicationId`
- `POST /admin/owner-applications/:applicationId/approve`
- `POST /admin/owner-applications/:applicationId/reject`
- `GET /admin/platform-settings`

### `PackageModule`

Sorumluluk:

- Paket CRUD
- Salon abonelikleri ve onay kuyrugu
- Owner/staff tarafinda aktif salon aboneligi sorgulama

Ana endpointler:

- `GET /packages`
- `GET /packages/my-subscription`
- `POST /packages/request-subscription`
- `GET /packages/admin`
- `GET /packages/overview`
- `GET /packages/subscriptions`
- `GET /packages/approvals`
- `PATCH /packages/subscriptions/:id/status`
- `GET /packages/:id`
- `POST /packages`
- `PATCH /packages/:id`
- `DELETE /packages/:id`

### `NotificationModule`

Sorumluluk:

- Kullanici bildirimlerini listeleme ve okundu isaretleme
- Event bus uzerinden best-effort bildirim uretimi

Ana endpointler:

- `GET /admin/notifications`
- `PATCH /admin/notifications/:id/read`
- `POST /admin/notifications/read-all`

Not:

- Channel tarafinda su an logging channel kullaniliyor.
- E-posta ve kalici notification persistence birlikte destekleniyor.

### `AuditLogModule`

Sorumluluk:

- Kritik olaylari audit log olarak saklama
- Super admin listeleme ekrani icin veri saglama

Ana endpoint:

- `GET /admin/audit-logs`

### `AdminReportsModule`

Sorumluluk:

- Super admin dashboard rapor payload'i uretmek

Ana endpoint:

- `GET /admin/reports/dashboard`

### `HealthModule`

Sorumluluk:

- Liveness ve readiness
- DB, Redis, migration, identity schema, reservation schema, refresh token schema kontrolleri

Ana endpointler:

- `GET /health/live`
- `GET /health/ready`

## Response ve Error Sozlesmesi

Basarili response'lar [TransformInterceptor](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/common/interceptors/transform.interceptor.ts) ile sarilir:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-04-15T12:00:00.000Z"
}
```

Hata response'lari [GlobalExceptionFilter](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/common/filters/global-exception.filter.ts) uzerinden normalize edilir:

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Request conflicts with the current database state.",
  "timestamp": "2026-04-15T12:00:00.000Z",
  "path": "/api/reservations",
  "code": "database_constraint_violation"
}
```

## Yetkilendirme

Yetkilendirme katmani:

- `JwtAuthGuard`
- `RolesGuard`
- `@Roles(...)`
- `@CurrentUser()`
- `@SkipMustChangePassword()`

Ek davranis:

- Personel kullanicisi `mustChangePassword=true` ise, isaretlenmemis endpointlerde islem yapamaz.

## Dosya Yukleme

Medya akislarinda su an lokal dosya depolama kullanilir.

Kapsanan alanlar:

- Salon storefront photo
- Salon gallery
- Staff profile photo

Teknik notlar:

- `uploads/` klasoru uygulama baslangicinda olusturulur
- Static erisim `/uploads/` prefix'i ile sunulur
- Tek dosya ve coklu dosya upload akislari vardir
- Dosya boyut limiti controller interceptor seviyesinde tanimlidir

## Health ve Startup Davranisi

Uygulama acilisinda [StartupValidationService](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/startup/startup-validation.service.ts) readiness kontrolu yapar.

Readiness su alanlari denetler:

- PostgreSQL baglantisi
- `schema_migrations` ve zorunlu migration dosyalari
- Identity tablo semalari (`customers`, `personnel`, `platform_admins`)
- `reservations` tablo semasi ve constraint/index'leri
- `refresh_tokens` tablo semasi
- Redis baglantisi

Bu sayede uygulama eksik migration veya bozuk schema ile sessizce kalkmaz.

## Testler

Test kapsaminda su gruplar bulunur:

### E2E

- `auth.e2e-spec.ts`
- `health.e2e-spec.ts`
- `platform-admin.e2e-spec.ts`
- `reservation.e2e-spec.ts`
- `salon.e2e-spec.ts`
- `staff.e2e-spec.ts`

### Integration

- `reservation.repository.integration.spec.ts`
- `salon.repository.integration.spec.ts`
- `staff.repository.integration.spec.ts`
- `user.repository.integration.spec.ts`

Komutlar:

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Gelistirme Komutlari

```bash
npm install
npm run migrate
npm run start:dev
```

Diger faydali komutlar:

```bash
npm run build
npm run lint
npm run migrate:status
npm run seed:random
```

## Ornek Lokal Kurulum

1. `ustura_backend` icinde veya repo kokunde `.env.local` olustur.
2. PostgreSQL ve Redis baglantilarini tanimla.
3. `npm install` calistir.
4. `npm run migrate` ile schema'yi kur.
5. `npm run start:dev` ile backend'i kaldir.
6. Swagger'i `/{API_PREFIX}` altinda ac.

Varsayilan olarak `API_PREFIX=api` ise Swagger adresi `http://localhost:3000/api` olur.

## Mevcut Teknik Gozlemler

Kod tabani uzerinden yapilan incelemeye gore:

- Backend mimarisi placeholder olmaktan cikmis; gercek modul akislarina sahip.
- README daha once guncel degildi; bu dosya mevcut uygulama gercegine gore yazildi.
- `nest-winston` ve `winston` bagimliliklari kurulmus olsa da bootstrap seviyesinde structured logging henuz aktif gorunmuyor.
- Notification channel katmaninda simdilik logging channel merkezde; harici push/SMS kanallari icin alan acik.
- Redis development fallback sayesinde lokal kurulum esnek; ancak production tarafinda gercek Redis zorunlu kabul edilmeli.

## Referans Dosyalar

- [src/app.module.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/app.module.ts)
- [src/main.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/main.ts)
- [src/config/config.service.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/config/config.service.ts)
- [src/database/database.service.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/database/database.service.ts)
- [src/redis/redis.service.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/redis/redis.service.ts)
- [src/modules/auth/auth.controller.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/modules/auth/auth.controller.ts)
- [src/modules/salon/salon.controller.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/modules/salon/salon.controller.ts)
- [src/modules/staff/staff.controller.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/modules/staff/staff.controller.ts)
- [src/modules/reservation/reservation.controller.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/modules/reservation/reservation.controller.ts)
- [src/modules/package/package.controller.ts](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/src/modules/package/package.controller.ts)
