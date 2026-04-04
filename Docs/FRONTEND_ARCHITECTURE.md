# Ustura Frontend — File-Based Routing Dosya Mimarisi

> **Framework:** React Native Web (Expo)  
> **Routing:** Expo Router (file-based routing)  
> **State:** Zustand (auth, wizard) + TanStack Query (API)  
> **Forms:** React Hook Form  
> **Date:** date-fns  
> **Storage:** AsyncStorage (web: localStorage)  
> **Design:** "The Obsidian Atelier" — dark theme, gold accent, Noto Serif + Manrope

---

## Sayfa Yolları (File-Based Routes)

| Sayfa | Route | Dosya | Hedef Kitle |
|-------|-------|-------|------------|
| Landing Page | `/` | `app/(public)/index.tsx` | Herkese açık |
| Kuaför Listesi | `/kuaforler` | `app/(public)/kuaforler.tsx` | Müşteri |
| Randevu Wizard | `/randevu` | `app/(public)/randevu.tsx` | Müşteri |
| Giriş Yap | `/giris` | `app/(auth)/giris.tsx` | Herkese açık |
| Kayıt Ol | `/kayit` | `app/(auth)/kayit.tsx` | Herkese açık |
| Panel Dashboard | `/panel` | `app/(panel)/index.tsx` | Owner |
| Personel Yönetimi | `/panel/personel` | `app/(panel)/personel.tsx` | Owner |
| Randevu Takvimi | `/panel/randevular` | `app/(panel)/randevular.tsx` | Owner / Receptionist |
| Salon Ayarları | `/panel/ayarlar` | `app/(panel)/ayarlar.tsx` | Owner |
| Berber Görünümü | `/panel/berber` | `app/(panel)/berber.tsx` | Barber |

---

## Klasör & Dosya Yapısı

```
Ustura_Frontend/
├── app/                                 ─── FILE-BASED ROUTES (Expo Router)
│   ├── _layout.tsx                          Root layout (font yükleme, provider'lar)
│   │
│   ├── (public)/                        ─── Herkese Açık Sayfalar
│   │   ├── _layout.tsx                      Public layout (navbar, footer)
│   │   ├── index.tsx                        Landing Page (/)
│   │   ├── kuaforler.tsx                    Kuaför Listesi (/kuaforler)
│   │   └── randevu.tsx                      Randevu Wizard (/randevu?step=1,2,3,4)
│   │
│   ├── (auth)/                          ─── Kimlik Doğrulama Sayfaları
│   │   ├── _layout.tsx                      Auth layout (minimal, logolu)
│   │   ├── giris.tsx                        Giriş Yap (/giris)
│   │   └── kayit.tsx                        Kayıt Ol (/kayit)
│   │
│   └── (panel)/                         ─── Korumalı Panel Sayfaları (JWT gerekli)
│       ├── _layout.tsx                      Panel layout (sidebar, auth guard)
│       ├── index.tsx                        Dashboard (/panel)
│       ├── personel.tsx                     Personel Yönetimi (/panel/personel)
│       ├── randevular.tsx                   Randevu Takvimi (/panel/randevular)
│       ├── ayarlar.tsx                      Salon Ayarları (/panel/ayarlar)
│       └── berber.tsx                       Berber Görünümü (/panel/berber)
│
├── components/                          ─── Yeniden Kullanılabilir Bileşenler
│   ├── ui/                              ─── Temel UI Bileşenleri
│   │   ├── Button.tsx                       Primary/Secondary/Ghost butonlar
│   │   ├── Card.tsx                         Tonal surface kartları
│   │   ├── Input.tsx                        Underline/ghost input alanları
│   │   ├── Chip.tsx                         Zaman slotu chip'leri
│   │   ├── Badge.tsx                        Durum badge'leri
│   │   ├── Modal.tsx                        Glassmorphism modal
│   │   └── Loading.tsx                      Yükleme göstergesi
│   │
│   ├── layout/                          ─── Layout Bileşenleri
│   │   ├── Navbar.tsx                       Glassmorphism navigasyon barı
│   │   ├── Sidebar.tsx                      Panel sidebar menüsü
│   │   ├── Footer.tsx                       Landing page footer
│   │   └── AuthGuard.tsx                    JWT kontrol + yönlendirme
│   │
│   ├── landing/                         ─── Landing Page Bileşenleri
│   │   ├── HeroSection.tsx                  Hero — değer önerisi
│   │   ├── ServicesSection.tsx              Hizmetler bölümü
│   │   ├── HowItWorksSection.tsx            Nasıl çalışır (3 adım)
│   │   ├── SalonsSection.tsx                Kayıtlı salonlar listesi
│   │   └── ContactForm.tsx                  EmailJS kayıt formu (CTA)
│   │
│   ├── salon/                           ─── Salon Bileşenleri
│   │   ├── SalonCard.tsx                    Salon listesi kartı
│   │   ├── SalonFilter.tsx                  Şehir/yıldız/müsaitlik filtreleri
│   │   └── SalonDetail.tsx                  Salon detay görünümü
│   │
│   ├── wizard/                          ─── Randevu Wizard Bileşenleri
│   │   ├── WizardProgress.tsx               Adım göstergesi (1-2-3-4)
│   │   ├── StepSalonSelect.tsx              Adım 1 — Kuaför seç
│   │   ├── StepStaffSelect.tsx              Adım 2 — Berber seç
│   │   ├── StepTimeSelect.tsx               Adım 3 — Tarih & saat seç
│   │   ├── StepConfirm.tsx                  Adım 4 — Özet & onayla
│   │   ├── TimeSlotGrid.tsx                 30dk'lık slot grid
│   │   └── BookingSuccess.tsx               Başarılı rezervasyon ekranı
│   │
│   └── panel/                           ─── Panel Bileşenleri
│       ├── StatsCard.tsx                    İstatistik kartları
│       ├── ReservationTable.tsx             Randevu tablosu
│       ├── CalendarView.tsx                 Günlük/haftalık takvim
│       ├── StaffList.tsx                    Personel listesi
│       ├── StaffForm.tsx                    Personel ekleme/düzenleme formu
│       └── WorkingHoursEditor.tsx           Çalışma saatleri düzenleyici
│
├── services/                            ─── API Servisleri
│   ├── api.ts                               Axios/fetch instance (baseURL, interceptor)
│   ├── auth.service.ts                      Auth API çağrıları
│   ├── salon.service.ts                     Salon API çağrıları
│   ├── staff.service.ts                     Staff API çağrıları
│   ├── reservation.service.ts               Reservation API çağrıları
│   └── slot.service.ts                      Slot API çağrıları
│
├── stores/                              ─── Zustand State Yönetimi
│   ├── auth.store.ts                        Auth state (user, token, isLoggedIn)
│   └── wizard.store.ts                      Wizard state (salonId, staffId, date, slot)
│
├── hooks/                               ─── Custom Hooks
│   ├── use-auth.ts                          Auth hook (login, logout, isAuthenticated)
│   ├── use-salons.ts                        TanStack Query — salon listesi
│   ├── use-staff.ts                         TanStack Query — personel listesi
│   ├── use-slots.ts                         TanStack Query — müsait slotlar
│   ├── use-reservations.ts                  TanStack Query — randevular
│   └── use-role-guard.ts                    Rol bazlı sayfa erişim kontrolü
│
├── constants/                           ─── Sabitler & Tema
│   ├── theme.ts                             Renk paleti (Obsidian Atelier)
│   ├── typography.ts                        Font tanımları (Noto Serif, Manrope)
│   ├── spacing.ts                           Spacing scale
│   └── api.ts                               API base URL, endpoint sabitleri
│
├── types/                               ─── TypeScript Tip Tanımları
│   ├── user.types.ts                        User, Role tipleri
│   ├── salon.types.ts                       Salon, WorkingHours tipleri
│   ├── staff.types.ts                       Staff tipleri
│   ├── reservation.types.ts                 Reservation, Slot tipleri
│   └── api.types.ts                         API response/error tipleri
│
├── utils/                               ─── Yardımcı Fonksiyonlar
│   ├── date.ts                              date-fns ile tarih formatlama
│   ├── slot.ts                              Slot hesaplama yardımcıları
│   ├── token.ts                             JWT token yönetimi (AsyncStorage)
│   └── validation.ts                        Form validasyon kuralları
│
├── assets/                              ─── Statik Dosyalar
│   ├── fonts/                               Noto Serif, Manrope font dosyaları
│   │   ├── NotoSerif-Regular.ttf
│   │   ├── NotoSerif-Bold.ttf
│   │   ├── Manrope-Regular.ttf
│   │   ├── Manrope-Medium.ttf
│   │   ├── Manrope-Bold.ttf
│   │   └── Manrope-SemiBold.ttf
│   └── images/                              Görseller
│       ├── logo.png
│       ├── hero-bg.png
│       └── placeholder-salon.png
│
├── app.json                             Expo konfigürasyonu
├── package.json                         Bağımlılıklar
└── tsconfig.json                        TypeScript ayarları
```

---

## Route Grupları & Layout Hiyerarşisi

```
app/_layout.tsx                    ← Root: Font yükleme, QueryClientProvider, Zustand
  ├── (public)/_layout.tsx         ← Public: Navbar + Footer sarmalayıcı
  │     ├── index.tsx              ← Landing Page (/)
  │     ├── kuaforler.tsx          ← Salon Listesi (/kuaforler)
  │     └── randevu.tsx            ← Wizard (/randevu?step=1)
  │
  ├── (auth)/_layout.tsx           ← Auth: Minimal, logolu layout
  │     ├── giris.tsx              ← Giriş (/giris)
  │     └── kayit.tsx              ← Kayıt (/kayit)
  │
  └── (panel)/_layout.tsx          ← Panel: Sidebar + AuthGuard
        ├── index.tsx              ← Dashboard (/panel)
        ├── personel.tsx           ← Personel (/panel/personel)
        ├── randevular.tsx         ← Randevular (/panel/randevular)
        ├── ayarlar.tsx            ← Ayarlar (/panel/ayarlar)
        └── berber.tsx             ← Berber Görünümü (/panel/berber)
```

---

## Katman Açıklamaları

| Katman | Klasör | Sorumluluk |
|--------|--------|------------|
| **Routes** | `app/` | File-based sayfa tanımları (Expo Router) |
| **Components** | `components/` | Yeniden kullanılabilir UI bileşenleri |
| **Services** | `services/` | Backend API çağrıları (fetch/axios) |
| **Stores** | `stores/` | Zustand global state yönetimi |
| **Hooks** | `hooks/` | TanStack Query hooks + custom hooks |
| **Constants** | `constants/` | Tema renkleri, tipografi, spacing, API URL'leri |
| **Types** | `types/` | TypeScript interface/tip tanımları |
| **Utils** | `utils/` | Tarih, token, validasyon yardımcı fonksiyonları |
| **Assets** | `assets/` | Fontlar, görseller, statik dosyalar |

---

## Wizard State Akışı

```
URL: /randevu?step=1  →  ?step=2  →  ?step=3  →  ?step=4

Zustand wizardStore:
┌──────────────────────────────────────────────────┐
│  step 1: { salonId }                             │
│  step 2: { salonId, staffId }                    │
│  step 3: { salonId, staffId, date, slotStart }   │
│  step 4: → POST /reservations → temizle          │
└──────────────────────────────────────────────────┘

Persist: Zustand persist middleware + URL parametresi
```

---

## Design System Token'ları (DESIGN.md'den)

| Token | Değer | Kullanım |
|-------|-------|----------|
| `surface` | `#131318` | Ana arka plan |
| `surface-container-low` | `#1B1B20` | Bölüm gruplaması |
| `surface-container-highest` | `#35343A` | Interaktif kartlar |
| `primary` | `#E6C364` | CTA altın rengi |
| `primary-container` | `#C9A84C` | CTA gradient bitiş |
| `on-primary` | `#3D2E00` | CTA buton metni |
| `on-surface` | `#E8E8F0` | Metin rengi |
| `on-surface-variant` | `#B0B0C8` | İkincil metin |
| `outline-variant` | `15% opacity` | Zorunlu ayırıcılar |

---

## Bağımlılıklar (Eklenecek)

| Paket | Kullanım |
|-------|----------|
| `zustand` | Global state (auth, wizard) |
| `@tanstack/react-query` | API state yönetimi |
| `react-hook-form` | Form yönetimi |
| `date-fns` | Tarih/saat hesaplama |
| `@react-native-async-storage/async-storage` | Token saklama |
| `@emailjs/browser` | Landing page kayıt formu |
| `expo-font` | Custom font yükleme (mevcut) |
