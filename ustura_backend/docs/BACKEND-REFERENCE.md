# Ustura Backend — Teknik Referans

Bu belge **ustura_backend** (NestJS 11) kod tabanının mimarisini, HTTP ve WebSocket yüzeyini, veri erişimini, olayları, yapılandırmayı ve operasyonel notları tek yerde toplar. Onboarding, güvenlik incelemesi ve entegrasyon için referans amaçlıdır.

---

## 1. Özet

| Öğe | Açıklama |
|-----|----------|
| **Çatı** | [NestJS](https://nestjs.com/) 11, Express adaptörü (`@nestjs/platform-express`) |
| **Veritabanı** | PostgreSQL, `pg` **Connection Pool** — ORM yok; SQL `DatabaseService` üzerinden |
| **Önbellek / kilit** | Redis (`ioredis`), rezervasyon slot seçimi ve kilit TTL’leri için |
| **Kimlik** | JWT (access + refresh), `passport-jwt`; şifre `bcrypt` |
| **Gerçek zamanlı** | Socket.IO (`@nestjs/websockets`), namespace `/slots` |
| **API belgesi** | Swagger UI — yol: `{API_PREFIX}` (ör. `/api`), `main.ts` içinde `SwaggerModule.setup(apiPrefix, …)` |
| **Doğrulama** | `class-validator` + `class-transformer`, global `ValidationPipe` (whitelist, forbidNonWhitelisted) |
| **Yanıt gövdesi** | Başarılı cevaplar `TransformInterceptor` ile `{ success, data, timestamp }` |

---

## 2. Giriş noktası ve bootstrap (`src/main.ts`)

1. `NestFactory.create<NestExpressApplication>(AppModule)`
2. **`/uploads/`** — `process.cwd()/uploads` klasörü oluşturulur; statik dosya servisi (`app.useStaticAssets`)
3. **`API_PREFIX`** — varsa global route öneki (`app.setGlobalPrefix`)
4. **WebSocket** — `IoAdapter`
5. **Güvenlik** — `helmet()`, CORS (`AppConfigService.cors`: origins, credentials, izin verilen metodlar ve başlıklar)
6. **Global** — `GlobalExceptionFilter`, `TransformInterceptor`, `ValidationPipe`
7. **Swagger** — Bearer JWT şeması (`access-token`)
8. **Kapanış** — `enableShutdownHooks()`, `listen(PORT)`

---

## 3. Kök modül (`src/app.module.ts`)

**İçe aktarılan modüller (sıra ile anlamlı gruplama):**

| Modül | Rol |
|--------|-----|
| `ConfigModule` | Ortam değişkenleri ve `AppConfigService` |
| `DatabaseModule` | `DatabaseService` (pg pool) |
| `EventsModule` | `DomainEventBus` (process içi pub/sub) |
| `RedisModule` | Redis bağlantısı |
| `ThrottlerModule` | Global: 60 istek / 60 saniye (varsayılan profil) |
| `AuthModule` | Kayıt, giriş, token, Google, şifre |
| `AuditLogModule` | Denetim kayıtları + domain olay tüketicisi |
| `EmailModule` | EmailJS |
| `HealthModule` | Canlılık / hazırlık |
| `NotificationModule` | Bildirimler + domain olay tüketicisi |
| `PlatformAdminModule` | Sahiplik başvuruları, platform ayarları özeti |
| `UserModule` | Kullanıcı profili ve süper admin kullanıcı yönetimi |
| `SalonModule` | Salon sorgu, yönetim, medya |
| `StaffModule` | Personel CRUD ve self-servis foto |
| `ReservationModule` | Rezervasyon + slot HTTP + `SlotGateway` |
| `PackageModule` | Paketler ve abonelikler |
| `AdminReportsModule` | Süper admin rapor özeti |
| `SalonServiceModule` | Salon hizmet kalemleri (CRUD + public liste) |

**Global sağlayıcılar:**

- `StartupValidationService` — açılışta `HealthService.assertReadyForStartup()`
- `JwtAuthGuard` — modülde kayıtlı; **global HTTP guard değil**; korunan uçlar açıkça `@UseGuards(JwtAuthGuard, …)` ile işaretlenir
- `APP_GUARD` → `ThrottlerGuard` (tüm HTTP rotalarına uygulanır; `auth` içinde ek `@Throttle` ile sıkılaştırma var)

---

## 4. Yapılandırma

### 4.1. `AppConfigService` (`src/config/config.service.ts`)

Tüm değerler `ConfigModule` / `getOrThrow` ile okunur; nesneler `Object.freeze` ile dondurulur.

**Sabit (kod içi) rezervasyon ayarları:** `slotDurationMinutes: 30`, `slotSelectionTtlSeconds`, `slotLockTtlSeconds`, `businessUtcOffset`, `businessTimeZone` (İstanbul).

### 4.2. Ortam değişkenleri (`src/config/config.types.ts` → `EnvironmentVariables`)

| Değişken | Kullanım |
|----------|-----------|
| `PORT`, `NODE_ENV`, `API_PREFIX` | Sunucu ve API kökü |
| `DB_*` | PostgreSQL host, port, ad, kullanıcı, şifre, pool min/max, timeout |
| `REDIS_*` | Redis bağlantısı |
| `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION` | Token üretimi |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CERTS_URL` | Mobil / Firebase Google doğrulama |
| `GOOGLE_WEB_CLIENT_ID` | Web Google Identity |
| `CORS_ORIGINS`, `CORS_CREDENTIALS` | CORS |
| `EMAILJS_*` | Onay ve personel hoş geldin şablonları |
| `FRONTEND_BASE_URL` | E-posta ve yönlendirmeler için |

---

## 5. Veri katmanı

### 5.1. `DatabaseService` (`src/database/database.service.ts`)

- `pg.Pool` — `onModuleInit` / `onModuleDestroy` yaşam döngüsü
- `query()`, `transaction()` — ham SQL
- Hatalar `database.errors.ts` içindeki özel hatalara çevrilir; `GlobalExceptionFilter` bunları HTTP durumuna map’ler

### 5.2. Repository deseni

Modül başına `repositories/*.repository.ts` — doğrudan `DatabaseService` kullanır. Güncel envanter:

| Dosya | Alan |
|--------|------|
| `modules/auth/repositories/auth.repository.ts` | Oturum, token, kimlik |
| `modules/user/repositories/user.repository.ts` | Müşteri / personel / platform admin veri erişimi |
| `modules/salon/repositories/salon.repository.ts` | Salonlar |
| `modules/staff/repositories/staff.repository.ts` | Personel |
| `modules/reservation/repositories/reservation.repository.ts` | Rezervasyonlar |
| `modules/salon-service/repositories/salon-service.repository.ts` | Salon hizmetleri |
| `modules/package/repositories/packages.repository.ts` | Paket tanımları |
| `modules/package/repositories/subscriptions.repository.ts` | Abonelikler |
| `modules/notification/repositories/notification.repository.ts` | Bildirimler |
| `modules/audit-log/repositories/audit-log.repository.ts` | Audit log |
| `modules/admin-reports/repositories/admin-reports.repository.ts` | Rapor sorguları |
| `modules/platform-admin/repositories/platform-admin.repository.ts` | Sahiplik başvuruları vb. |

---

## 6. Redis (`src/redis/`)

Slot seçimi, dağıtık kilit veya TTL tabanlı geçici durum için kullanılır (detay: `SlotService` ve ilgili politika dosyaları).

---

## 7. Kimlik, roller ve koruma

### 7.1. Roller (`src/shared/auth/role.enum.ts`)

`super_admin`, `owner`, `barber`, `receptionist`, `customer`

### 7.2. Asıl tür (`src/shared/auth/principal-kind.enum.ts`)

`customer`, `personnel`, `platform_admin` — JWT payload’da kimlik ayrımı için.

### 7.3. JWT payload (`src/shared/auth/jwt-payload.interface.ts`)

- `sub`, `email`, `role`, isteğe bağlı `principalKind`, `mustChangePassword` (personel ilk giriş zorunluluğu)
- `tokenType`: `access` | `refresh`

### 7.4. `JwtAuthGuard`

- Passport `jwt` stratejisi sonrası, `@SkipMustChangePassword()` yoksa ve `mustChangePassword === true` ise özel hata (`auth.errors`) fırlatılır — personel şifre değiştirene kadar korumalı uçlar bloklanır.

### 7.5. `RolesGuard` + `@Roles(...)`

Controller metodlarında `JwtAuthGuard` ile birlikte kullanılır; izin verilen roller açıkça listelenir.

---

## 8. HTTP API yüzeyi

**Not:** Aşağıdaki yollar `API_PREFIX` sonrası görecelidir (örn. prefix `api` ise tam yol `/api/auth/login`). Başarılı gövde: `{ "success": true, "data": …, "timestamp": "…" }`.

### 8.1. Kimlik — `AuthController` → `/auth`

| Metot | Yol | Koruma | Not |
|--------|-----|--------|-----|
| POST | `/auth/register` | Yok | Müşteri kaydı |
| POST | `/auth/login` | Yok | Throttle: 5/dk |
| POST | `/auth/google/customer` | Yok | Firebase ID token |
| GET | `/auth/google/customer/web/config` | Yok | Web client id (public) |
| POST | `/auth/google/customer/web` | Yok | Google web access token |
| POST | `/auth/refresh` | Yok | Throttle: 12/5dk |
| POST | `/auth/password/change` | JWT + SkipMustChangePassword | Throttle |
| POST | `/auth/logout` | JWT + SkipMustChangePassword | |
| POST | `/auth/logout-all` | JWT + SkipMustChangePassword | |

Süper admin ve personel girişleri aynı `login` akışında **rol / kimlik** ayrımı ile `AuthService` içinde işlenir (detay: `LoginDto`, `auth.service.ts`).

### 8.2. Kullanıcı — `UserController` → `/users`

| Metot | Yol | Rol |
|--------|-----|-----|
| GET/PATCH | `/users/me` | JWT (profil) |
| GET/PATCH | `/users/admin/...` | `super_admin` |

### 8.3. Salon — `SalonController` → `/salons`

| Metot | Yol | Rol / erişim |
|--------|-----|----------------|
| GET | `/salons`, `/salons/cities` | **Public** — liste ve şehirler |
| GET | `/salons/:salonId` | **Public** — vitrin detay |
| GET | `/salons/owned` | JWT — salon sahibi özeti |
| POST/PATCH/DELETE | `/salons`, `/salons/:salonId` | Çoğunlukla `owner` veya politika ile |
| GET/PATCH/DELETE | `/salons/admin/...` | `super_admin` |
| POST/DELETE | `/salons/:salonId/storefront-photo`, `storefront-gallery` | `owner` — medya yükleme/silme |

### 8.4. Salon hizmetleri — `SalonServiceController` → `/salons/:salonId/services`

| Metot | Yol | Rol |
|--------|-----|-----|
| GET | `/` (index) | **Public** — aktif hizmet listesi |
| GET | `/owned` | `owner` — tüm kayıtlar |
| POST/PATCH/DELETE | … | `owner` |

### 8.5. Personel — `StaffController` → `/salons/:salonId/staff`

Tümü `JwtAuthGuard` + `RolesGuard` + **`owner`**.

### 8.5b. Personel self — `StaffSelfController` → `/staff`

| Metot | Yol | Rol |
|--------|-----|-----|
| GET | `/staff/me` | `barber`, `receptionist` |
| POST/DELETE | `/staff/me/:staffId/photo` | Aynı |

### 8.6. Slotlar (HTTP) — `SlotController` → `/salons/:salonId/slots`

| Metot | Yol | Erişim |
|--------|-----|---------|
| GET | `/` | **Public** — `date`, isteğe bağlı `staff_id` |

### 8.7. Rezervasyon — `ReservationController` → `/reservations`

Sınıf düzeyinde `JwtAuthGuard` + `RolesGuard`; metotlarda `@Roles` ile daraltma:

- Oluşturma: müşteri, owner, barber, receptionist (politikaya tabi)
- `GET /reservations/my` — `customer`
- Salon listesi / durum güncelleme / iptal — roller ayrı ayrı tanımlı

### 8.8. Paketler — `PackageController` → `/packages`

- Genel liste / detay: süper admin veya abonelik isteği gibi uçlar karışık; çoğu admin ucu `super_admin`, salon personeli uçları `owner|barber|receptionist`
- Detay için kaynak dosyaya bakın: `package.controller.ts`

### 8.9. Platform — `PlatformAdminController` (kök `@Controller()`)

| Metot | Yol | Rol |
|--------|-----|-----|
| POST | `/owner-applications` | **Public** — işletme sahibi başvurusu |
| GET/PATCH/POST | `/admin/owner-applications/...` | `super_admin` |
| GET | `/admin/platform-settings` | `super_admin` — maskelenmiş entegrasyon özeti |

### 8.10. Yönetim uçları

| Controller | Önek yol | Rol |
|------------|-----------|-----|
| `NotificationController` | `/admin/notifications` | Tüm roller (liste/okundu; süper admin filtrede tüm platform) |
| `AuditLogController` | `/admin/audit-logs` | `super_admin` |
| `AdminReportsController` | `/admin/reports/dashboard` | `super_admin` |

### 8.11. Sağlık — `HealthController` → `/health`

| Metot | Yol | Amaç |
|--------|-----|--------|
| GET | `/health/live` | Süreç ayakta |
| GET | `/health/ready` | DB, Redis, şema migrasyonları, kritik tablolar |

`StartupValidationService` hazırlık kontrolünü `ready` ile hizalar.

---

## 9. WebSocket — slotlar (`SlotGateway`)

- **Namespace:** `/slots`
- **CORS:** `origin: true`, `credentials: true`
- Örnek olaylar: `slot:join`, `slot:select`, oda bazlı yayınlar (`slot:selection.snapshot` vb.)
- Payload doğrulama: `ValidationPipe` (whitelist, transform)

İstemci, HTTP API prefix’inden bağımsız olarak Socket.IO sunucu köküne bağlanır; namespace `/slots` kullanılmalıdır.

---

## 10. Domain olayları (`DomainEventBus`)

**Olay adları** (`domain-event.types.ts`):  
`reservation.created`, `reservation.cancelled`, `reservation.status_changed`, `staff.created`, `owner.approved`, `auth.logged_out`

**Yayıncılar (örnek):** `ReservationService`, `StaffService`, `AuthService`, `PlatformAdminService` — `publish(event)`.

**Tüketiciler:**

| Sınıf | Abonelikler | Amaç |
|--------|-------------|------|
| `AuditLogEventsConsumer` | rezervasyon + staff + auth | Kalıcı audit kaydı |
| `NotificationEventsConsumer` | rezervasyon + owner + auth | Bildirim üretimi / temizlik |

Handler hataları `DomainEventBus` içinde yakalanır, uygulama düşmez; log uyarısı yazılır.

---

## 11. Veritabanı migrasyonları

Konum: `src/database/migrations/*.sql`  
Çalıştırma: `npm run migrate` / `npm run migrate:status` (`scripts/run-migrations.cjs`, `.env` / `.env.local`)

| Dosya | Konu (dosya adından) |
|--------|----------------------|
| `001_init_tables.sql` | Çekirdek şema |
| `002_add_customer_google_auth.sql` | Google alanları |
| `003_rework_reservation_schema.sql` | Rezervasyon modeli |
| `004_create_owner_applications.sql` | Sahiplik başvurusu |
| `005_create_audit_logs.sql` | Audit |
| `006_harden_refresh_tokens.sql` | Refresh token sertleştirme |
| `007_enforce_user_phone_uniqueness.sql` | Telefon benzersizliği |
| `008_seed_default_super_admin.sql` | Varsayılan süper admin |
| `009_create_packages_schema.sql` | Paketler |
| `010_seed_test_staff_accounts.sql` | Test personeli |
| `011_create_notifications.sql` | Bildirimler |
| `012_split_identity_tables.sql` | Kimlik tabloları ayrımı |
| `013_seed_demo_identity.sql` | Demo veri |
| `014_ensure_packages_tier_label.sql` | Paket etiketi |
| `015_ensure_salons_is_active.sql` | Salon aktif bayrağı |
| `016_owner_applications_review_state_allow_null_salon.sql` | Başvuru durumu |
| `017_personnel_must_change_password.sql` | İlk giriş şifre zorunluluğu |
| `018_fix_seed_uuid_format.sql` | Seed UUID düzeltmesi |
| `019_add_salon_gallery_urls.sql` | Salon galeri |
| `020_create_salon_services.sql` | Salon hizmet tablosu |

`HealthService` içindeki `REQUIRED_MIGRATIONS` listesi bu dosyaların uygulanmış olmasını doğrular.

---

## 12. Hata ve API sözleşmesi

- **HTTP hataları:** `GlobalExceptionFilter` — `{ success: false, statusCode, message, timestamp, path, code? }`
- **İş kuralı kodları:** `src/shared/errors/error-codes.ts` ve modül `errors/*.errors.ts` dosyaları (Nest `HttpException` ile)

---

## 13. Güvenlik özeti

- **Helmet** — standart HTTP başlıkları
- **Rate limit:** global Throttler; `auth` login / Google / refresh için ek `@Throttle`
- **JWT refresh** — rotasyon ve oturum bağlamı (IP / user-agent) `AuthService` içinde
- **Şifre:** bcrypt; personel `must_change_password` ile zorunlu rotasyon
- **Swagger:** üretimde kapatma veya IP kısıtlaması önerilir

---

## 14. Test yapısı

| Tür | Konum | Örnek |
|-----|--------|--------|
| Birim | `src/**/*.spec.ts` | `auth.service.spec.ts`, `slot.service.spec.ts` |
| E2E | `test/*.e2e-spec.ts` | `auth.e2e-spec.ts`, `salon.e2e-spec.ts` |
| Entegrasyon | `test/integration/*.integration.spec.ts` | Repository + gerçek DB (ortam değişkenine bağlı) |
| Yardımcı | `test/helpers/` | `create-contract-test-app.ts`, `test-jwt.strategy.ts` |

E2E yapılandırması: `test/jest-e2e.json`.

---

## 15. Önemli dizin haritası (`src/`)

```
src/
├── app.module.ts
├── main.ts
├── common/           # filter, guard, interceptor, decorator, pipe
├── config/
├── database/
├── events/
├── redis/
├── startup/
├── shared/           # auth tipleri, error-codes
└── modules/
    ├── auth/
    ├── user/
    ├── salon/
    ├── salon-service/
    ├── staff/
    ├── reservation/   # slot alt modülü + gateway
    ├── package/
    ├── notification/
    ├── audit-log/
    ├── admin-reports/
    ├── platform-admin/
    ├── email/
    └── health/
```

---

## 16. Servis sınıfları envanteri (`*.service.ts`)

| Yol | Rol (kısa) |
|-----|------------|
| `config/config.service.ts` | Tip güvenli ortam okuma |
| `database/database.service.ts` | PostgreSQL pool ve transaction |
| `redis/redis.service.ts` | Redis istemcisi |
| `events/domain-event-bus.service.ts` | Process içi olay otobüsü |
| `startup/startup-validation.service.ts` | Açılış altyapı doğrulaması |
| `modules/auth/auth.service.ts` | Kayıt, giriş, token, Google, şifre, çıkış |
| `modules/auth/firebase-token-verifier.service.ts` | Firebase ID doğrulama |
| `modules/auth/google-web-token-verifier.service.ts` | Google web access token doğrulama |
| `modules/user/user.service.ts` | Birleşik kullanıcı işlemleri |
| `modules/user/user-profile.service.ts` | Profil |
| `modules/user/user-admin-query.service.ts` | Süper admin listeleme |
| `modules/user/user-admin-management.service.ts` | Süper admin güncelleme |
| `modules/salon/salon.service.ts` | Salon modülü koordinasyonu |
| `modules/salon/salon-query.service.ts` | Public / admin sorgular |
| `modules/salon/salon-management.service.ts` | CRUD ve iş kuralları |
| `modules/salon/salon-media.service.ts` | Vitrin foto ve galeri dosyaları |
| `modules/salon/salon-ownership.service.ts` | Sahiplik doğrulama |
| `modules/salon/salon-working-hours.service.ts` | Çalışma saatleri |
| `modules/salon/salon-projection.service.ts` | DTO / projeksiyon yardımcıları |
| `modules/salon-service/salon-service.service.ts` | Salon hizmet kalemleri |
| `modules/staff/staff.service.ts` | Personel yönetimi |
| `modules/staff/staff-media.service.ts` | Personel profil foto |
| `modules/reservation/reservation.service.ts` | Rezervasyon yaşam döngüsü |
| `modules/reservation/slot/slot.service.ts` | Slot üretimi, seçim, Redis |
| `modules/package/package.service.ts` | Paket ve abonelik iş akışı |
| `modules/notification/notification.service.ts` | Bildirim CRUD |
| `modules/notification/templates/notification-template.service.ts` | Şablon metinleri |
| `modules/audit-log/audit-log.service.ts` | Audit yazma / okuma |
| `modules/admin-reports/admin-reports.service.ts` | Rapor toplama |
| `modules/platform-admin/platform-admin.service.ts` | Başvuru ve onay akışı |
| `modules/email/emailjs.service.ts` | EmailJS gönderimi |
| `modules/health/health.service.ts` | Live / ready ve şema kontrolleri |

---

## 17. Bakım ve sürüm notları

- Yeni migrasyon eklendiğinde **`HealthService.REQUIRED_MIGRATIONS`** sabit dizisine dosya adını ekleyin; aksi halde `/health/ready` başarısız olur.
- Yeni domain olayı eklendiğinde: `AppDomainEventName`, payload tipi, yayıncı ve tüketici (`*events-consumer.ts`) güncellenmelidir.
- API’ye yeni genel (JWT’siz) uç eklendiğinde güvenlik ve Throttler etkisini gözden geçirin.

---

*Bu belge kod tabanı analizi ile üretilmiştir: `ustura_backend/docs/BACKEND-REFERENCE.md`.*

