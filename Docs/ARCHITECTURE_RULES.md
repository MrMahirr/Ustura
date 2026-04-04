# USTURA Projesi — Merkezi Mimari ve Kod Standartları

Bu doküman, projede sürdürülebilirliği sağlamak ve teknik borcu en aza indirmek için izlenmesi gereken **zorunlu yazılım ve mimari kuralları** tanımlar.

---

## 1. Backend (NestJS) Kuralları

Projeye ait NestJS backend, katı bir **Modüler ve Domain-Driven (Etki Alanı Odaklı)** yapı izlemek zorundadır.

### Mimarî Kısıtlamalar
- **Kaba Kuvvet (Raw) SQL:** Projede **hiçbir ORM (TypeORM, Prisma vb.) kullanılmayacaktır.** Etkileşimler `pg-pool` aracılığıyla Repository katmanında Raw SQL yazılarak yapılacaktır.
- **Katmanlı Mimari:** Her modül (Auth, User, Salon, Reservation) kendi içinde kapsüllenmiş olmalı:
  - **Controller:** Yalnızca HTTP isteklerini (Request/Response) karşılar ve yönlendirir. Hiçbir iş mantığı (business logic) içeremez.
  - **Service (Use Case):** Tüm iş kurallarını (business logic) barındırır. Veritabanına doğrudan erişemez.
  - **Repository:** Sadece ve sadece veritabanı ile (Raw SQL) iletişim kurar. Controller'lar tarafından doğrudan çağrılamaz.
  - **DTO:** Controller seviyesinde validasyon ve tip güvenliği için kullanılır (`class-validator` ile).

### Veritabanı ve İşlemler
- **Transaction Yönetimi:** Özellikle Randevu (Reservation / Slot) çakışmasını engellemek için, veritabanı seviyesinde işlem (transaction) sarmalayıcıları (`BEGIN`, `COMMIT`, `ROLLBACK`) `DatabaseService` üzerinden yönetilmelidir.
- **Kilitleme (Locking):** Slot rezerve edilirken eşzamanlı istek yarışını (Race Condition) önlemek amacıyla **Redis Dağıtık Kilidi (Distributed Lock)** zorunludur.

---

## 2. Frontend (React Native Web / Expo Router) Kuralları

Frontend, **File-Based Routing** yapısı ve **"The Obsidian Atelier"** tasarım sistemi üzerine kuruludur.

### Mimarî Kısıtlamalar
- **Komponent Odaklı Geliştirme:** UI elementleri her zaman `components/ui/` altında (Örn: `Button`, `Card`, `Input`) yaratılmalıdır. Ad-hoc (tek seferlik) inline stiller veya kuralsız component üretmek yasaktır. 
- **Durum (State) Yönetimi:** 
  - API çağrıları (Okuma/Sunucu state'i) ve Caching için **TanStack Query** kullanılacaktır.
  - Uygulama içi asenkron global veri tutulması (Auth oturum bilgisi, Wizard geçiş adımları) için **Zustand** kullanılacaktır.
- **Ağ İstekleri:**
  - Component içinde asla fetch/axios doğrudan çağrılamaz. 
  - Tüm network istekleri `services/` altındaki API servis fonksiyonlarına (örn. `reservation.service.ts`) delege edilir; `hooks/` klasöründeki Custom Query Hook'lar (örn. `use-reservations.ts`) yardımıyla component'e aktarılır.
- **Tip Güvenliği:** Backend ve Frontend arasında tam TypeScript uyumu sağlanmalıdır. `types/` klasöründe yer alan interfaceler katı bir şekilde kullanılmalıdır.

### Tasarım (Design System) Kısıtlamaları
- Proje minimal, karanlık mod (dark theme) odaklı ve altın (gold primary) tonlarında premium bir tasarıma sahiptir.
- Tema değerleri `constants/theme.ts` dışından alınamaz. Herhangi bir yerde `#131318` gibi statik renk yazmak yasaktır (Bunun yerine `Colors.surface` gibi tema objeleri kullanılacaktır).
- Fontlar `constants/typography.ts` içindeki tanımlar (*Noto Serif* başlık, *Manrope* metin) eşliğinde kullanılmalıdır.

---

## 3. Genel "Clean Code" Temel Kuralları
- **DRY (Don't Repeat Yourself):** Aynı işlevi gören kod/sorgu/komponent asla kopyalanmamalı, merkezi bir yapıya çıkarılmalıdır.
- **SOLID Prensipleri:** Modüller "Tek Sorumluluk Prensibi" (Single Responsibility) ve "Bağımlılığın Tersine Çevrilmesi" (Dependency Inversion) ilkelerine sadık kalmalıdır.
- **İngilizce Kodlama:** Tüm fonksiyon, değişken, servis, tablo adları İngilizce olmalıdır (Hata mesajları, kullanıcıya gösterilen metinler Türkçe olabilir).
- **Açıklamalar:** 'Ne' yapıldığı değil, 'Neden' yapıldığını anlatan yorum satırları yazılmalıdır.
