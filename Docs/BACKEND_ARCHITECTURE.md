# Ustura Backend — Modüler Dosya Mimarisi

> **Framework:** NestJS + TypeScript  
> **Veritabanı:** PostgreSQL — Raw SQL (ORM yok, `pg` / `pg-pool`)  
> **Auth:** JWT (`@nestjs/jwt`)  
> **Validation:** `class-validator` + `class-transformer`  
> **API Docs:** `@nestjs/swagger`  
> **Cache/Lock:** Redis (`ioredis`)  
> **Password:** `bcrypt`

---

## Klasör & Dosya Yapısı

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── app.controller.spec.ts
│
├── common/                              ─── Paylaşılan araçlar
│   ├── decorators/
│   │   ├── roles.decorator.ts               Rol bazlı erişim dekoratörü
│   │   └── current-user.decorator.ts        Request'ten user bilgisi çekme
│   ├── guards/
│   │   ├── jwt-auth.guard.ts                JWT doğrulama guard'ı
│   │   └── roles.guard.ts                   Rol bazlı yetkilendirme guard'ı
│   ├── interceptors/
│   │   └── transform.interceptor.ts         Response dönüşüm interceptor'ı
│   ├── filters/
│   │   └── http-exception.filter.ts         Global hata yakalama filtresi
│   ├── pipes/
│   │   └── validation.pipe.ts               DTO validasyon pipe'ı
│   ├── enums/
│   │   ├── role.enum.ts                     Kullanıcı rolleri enum'u
│   │   └── reservation-status.enum.ts       Randevu durumları enum'u
│   ├── interfaces/
│   │   └── jwt-payload.interface.ts         JWT payload tipi
│   └── constants/
│       └── index.ts                         Sabitler (JWT süreleri vb.)
│
├── config/                              ─── Konfigürasyon
│   ├── config.module.ts                     Config modülü
│   ├── database.config.ts                   PostgreSQL bağlantı ayarları
│   ├── jwt.config.ts                        JWT secret / süreleri
│   └── redis.config.ts                      Redis bağlantı ayarları
│
├── database/                            ─── Veritabanı katmanı
│   ├── database.module.ts                   DB modülü (pg-pool provider)
│   ├── database.service.ts                  Pool yönetimi servisi
│   └── migrations/
│       └── 001_init_tables.sql              İlk migration (tablo oluşturma)
│
└── modules/                             ─── Domain Modülleri
    │
    ├── auth/                            ─── Kimlik Doğrulama
    │   ├── auth.module.ts
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── strategies/
    │   │   └── jwt.strategy.ts              Passport JWT strategy
    │   ├── dto/
    │   │   ├── register.dto.ts
    │   │   ├── login.dto.ts
    │   │   └── refresh-token.dto.ts
    │   └── repositories/
    │       └── auth.repository.ts           refresh_tokens tablosu raw SQL
    │
    ├── user/                            ─── Kullanıcı Yönetimi
    │   ├── user.module.ts
    │   ├── user.controller.ts
    │   ├── user.service.ts
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   └── repositories/
    │       └── user.repository.ts           users tablosu raw SQL
    │
    ├── salon/                           ─── Salon Yönetimi
    │   ├── salon.module.ts
    │   ├── salon.controller.ts
    │   ├── salon.service.ts
    │   ├── dto/
    │   │   ├── create-salon.dto.ts
    │   │   └── update-salon.dto.ts
    │   └── repositories/
    │       └── salon.repository.ts          salons tablosu raw SQL
    │
    ├── staff/                           ─── Personel Yönetimi
    │   ├── staff.module.ts
    │   ├── staff.controller.ts
    │   ├── staff.service.ts
    │   ├── dto/
    │   │   ├── create-staff.dto.ts
    │   │   └── update-staff.dto.ts
    │   └── repositories/
    │       └── staff.repository.ts          staff tablosu raw SQL
    │
    └── reservation/                     ─── Randevu Yönetimi
        ├── reservation.module.ts
        ├── reservation.controller.ts
        ├── reservation.service.ts
        ├── dto/
        │   ├── create-reservation.dto.ts
        │   └── update-reservation-status.dto.ts
        ├── repositories/
        │   └── reservation.repository.ts    reservations tablosu raw SQL
        └── slot/
            ├── slot.service.ts              Slot üretim & müsaitlik mantığı
            └── slot.controller.ts           GET /salons/:id/slots endpoint'i
```

---

## Veritabanı Tabloları

| # | Tablo | Açıklama |
|---|-------|----------|
| 1 | `users` | Tüm kullanıcılar (super_admin, owner, barber, receptionist, customer) |
| 2 | `salons` | Kuaför salonları (working_hours JSON, owner FK) |
| 3 | `staff` | Salon personeli (barber / receptionist, user+salon FK) |
| 4 | `reservations` | Randevular (30dk slot, staff+salon+customer FK, çakışma engeli) |
| 5 | `refresh_tokens` | JWT refresh token'ları (user FK, token_hash, expires_at) |

---

## API Endpoint Grupları

| Modül | Endpoint'ler |
|-------|-------------|
| **Auth** | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh` · `POST /auth/logout` |
| **Salons** | `GET /salons` · `GET /salons/:id` · `POST /salons` (owner) · `PATCH /salons/:id` (owner) · `DELETE /salons/:id` (owner) |
| **Staff** | `GET /salons/:id/staff` · `POST /salons/:id/staff` (owner) · `PATCH /salons/:id/staff/:staffId` (owner) · `DELETE /salons/:id/staff/:staffId` (owner) |
| **Slots** | `GET /salons/:id/slots?date=&staffId=` — müsait slotlar |
| **Reservations** | `POST /reservations` (customer) · `GET /reservations/my` (customer) · `GET /reservations/salon/:id` (owner/receptionist) · `DELETE /reservations/:id` (customer\|owner) |

---

## Roller & Yetkiler

| Rol | JWT `role` | Yetkiler |
|-----|-----------|----------|
| Kuaför Sahibi | `owner` | Tam yönetim — personel, randevu, salon ayarları, istatistikler |
| Berber | `barber` | Sadece kendi randevuları, profil düzenleme, müsaitlik |
| Resepsiyonist | `receptionist` | Tüm randevular, randevu oluşturma/iptal, personel görüntüleme |
| Müşteri | `customer` | Kuaför/berber listesi, randevu oluşturma/iptal |
| Süper Admin | `super_admin` | Tüm sistem yönetimi |

---

## Katman Açıklamaları

| Katman | Dosya Tipi | Sorumluluk |
|--------|-----------|------------|
| **Controller** | `*.controller.ts` | HTTP request/response, route tanımları, Swagger dekoratörleri |
| **Service** | `*.service.ts` | İş mantığı, validasyon kuralları, orchestration |
| **Repository** | `*.repository.ts` | Raw SQL sorguları (`pg-pool` ile), veri erişim katmanı |
| **DTO** | `*.dto.ts` | Request body validasyonu (`class-validator` dekoratörleri) |
| **Guard** | `*.guard.ts` | Kimlik doğrulama ve yetkilendirme kontrolleri |
| **Strategy** | `*.strategy.ts` | Passport JWT doğrulama stratejisi |
| **Interceptor** | `*.interceptor.ts` | Response dönüşüm, loglama |
| **Filter** | `*.filter.ts` | Global hata yakalama ve formatlama |
| **Pipe** | `*.pipe.ts` | DTO validasyon |
| **Enum** | `*.enum.ts` | Sabit değer kümeleri (roller, durumlar) |
| **Interface** | `*.interface.ts` | TypeScript tip tanımları |
| **Config** | `*.config.ts` | Ortam değişkeni yönetimi |
