# Ustura Backend Implementation Checklist

Bu dosya, mevcut backend durumu ile mimari dokümanlar birleştirilerek hazırlanmış adım adım yapılacaklar listesidir.

Durum tarihi: 2026-04-09

## 0. Mevcut Durumda Tamamlanan Temel Başlıklar

- [x] NestJS backend proje iskeleti kuruldu.
- [x] `ConfigModule` ve environment validation altyapısı eklendi.
- [x] `DatabaseModule` ve migration çalıştırma altyapısı eklendi.
- [x] `RedisModule` ve slot lock altyapısının ilk versiyonu eklendi.
- [x] `AuthModule`, `UserModule`, `SalonModule`, `StaffModule`, `ReservationModule`, `HealthModule` oluşturuldu.
- [x] Swagger, CORS, `helmet`, global validation pipe ve shutdown hook bootstrap seviyesinde bağlandı.
- [x] Auth, salon, staff, reservation ve health için ilk e2e test dosyaları oluşturuldu.

## 1. Reservation Veri Modelini Düzelt

- [x] `reservations` tablosundaki `UNIQUE (staff_id, slot_start)` kısıtını kaldır.
- [x] Sadece aktif rezervasyonları koruyan partial unique index ekle.
- [x] Reservation status alanını `pending`, `confirmed`, `cancelled`, `completed`, `no_show` olarak genişlet.
- [x] `cancelled_at`, `cancelled_by_user_id`, `status_changed_at`, `status_changed_by_user_id` alanlarını ekle.
- [x] `slot_end` değerinin türetilmiş mantıkla tutarlı kaldığını migration sonrası doğrula.
- [x] Migration dosyasını yaz ve mevcut migration zincirine ekle.
- [x] Health/readiness kontrollerinde yeni schema beklentilerini doğrula.

## 2. Reservation Domain Akışını Tamamla

- [x] `ReservationStatus` enum'unu reservation modülü içine taşı.
- [x] `UpdateReservationStatusDto` için `class-validator` kurallarını ekle.
- [x] `PATCH /reservations/:id/status` endpoint'ini controller seviyesinde ekle.
- [x] Reservation service içinde geçerli status transition kurallarını tanımla.
- [x] Owner, barber ve receptionist için status değiştirme yetki kurallarını ayır.
- [x] Customer iptal akışı ile personel tarafı status güncelleme akışını ayrı kurallarla yönet.
- [x] Reservation response DTO'larını yeni status alanlarıyla hizala.
- [x] Reservation policy testlerini yeni lifecycle'a göre genişlet.

## 3. `common` ve Modül Sınırlarını Temizle

- [x] Reservation'a ait enum ve sabitleri `common/` altından çıkar.
- [x] Slot süresi, lock TTL ve business-time sabitlerini reservation/config tarafına taşı.
- [x] JWT süreleri ve auth sabitlerini auth/config tarafına taşı.
- [x] Modüllerin repository export kullanımını gözden geçir.
- [x] Başka modüllerin repository'lerine doğrudan bağımlı olan yerleri servis/contract seviyesine çek.
- [x] Ortak katmanda sadece decorator, guard, interceptor, filter ve pipe bırak.

## 4. Platform Admin Modülünü Ekle

- [x] `PlatformAdminModule` oluştur.
- [x] `owner_applications` tablosu için migration yaz.
- [x] `POST /owner-applications` endpoint'ini ekle.
- [x] `GET /admin/owner-applications` endpoint'ini ekle.
- [x] `POST /admin/owner-applications/:id/approve` endpoint'ini ekle.
- [x] `POST /admin/owner-applications/:id/reject` endpoint'ini ekle.
- [x] Owner onayı sırasında owner user + salon oluşturma işlemini transaction içinde yap.
- [x] `super_admin` rolünü gerçek business capability ile bağla.
- [x] Owner onboarding akışı için e2e test yaz.

## 5. Audit Log Modülünü Ekle

- [x] `AuditLogModule` oluştur.
- [x] `audit_logs` tablosu için migration yaz.
- [x] Auth olayları için audit kayıtları ekle.
- [x] Staff oluşturma/güncelleme/silme olayları için audit kayıtları ekle.
- [x] Reservation oluşturma/iptal/status değişim olayları için audit kayıtları ekle.
- [x] Gerekirse admin-only audit listeleme endpoint'i tasarla.
- [x] Audit kayıtlarının business transaction'ı bloklamadığını doğrula.

## 6. Notification Modülünü Ekle

- [x] `NotificationModule` oluştur.
- [x] Reservation oluşturuldu olayında bildirim akışı ekle.
- [x] Reservation iptal edildi olayında bildirim akışı ekle.
- [x] Owner onaylandı olayında bildirim akışı ekle.
- [x] Bildirim teslim hatalarını ana transaction'dan bağımsız ele al.
- [x] Şablon ve kanal seçimlerini modül içinde soyutla.
- [x] Bildirim akışları için en azından unit test seviyesinde kapsama ekle.

## 7. Event-Driven Yan Etkileri Kur

- [x] Modüller arası yan etkiler için event yayınlama modeli belirle.
- [x] `reservation.created` event'ini yayınla.
- [x] `reservation.cancelled` event'ini yayınla.
- [x] `reservation.status_changed` event'ini yayınla.
- [x] `staff.created` event'ini yayınla.
- [x] `owner.approved` event'ini yayınla.
- [x] `auth.logged_out` event'ini yayınla.
- [x] Notification ve AuditLog modüllerini event consumer olarak bağla.
- [ ] Gerekirse ileri aşama için `outbox_events` tablosunu ekle.

## 8. Auth ve Session Tarafını Sertleştir

- [x] Refresh token tablosuna `revoked_at`, `user_agent`, `ip_address`, `rotated_from` alanlarını ekle.
- [x] `logout-all` endpoint'ini ekle.
- [x] Şüpheli token reuse senaryosunda tüm session revoke akışını ekle.
- [x] Login ve refresh için throttling/rate-limit davranışını ayrı ayrı gözden geçir.
- [x] Üretim ortamı için secret fallback kullanımını tamamen engelle.
- [x] Auth event'lerini audit ve notification tarafına bağla.
- [x] Auth e2e testlerini refresh rotation ve logout-all senaryolarıyla genişlet.

## 9. User Modülünü Contract Odaklı Temizle

- [ ] `UserModule` içinde query contract'ları netleştir: `findById`, `findByEmail`, `createCustomer`, `createEmployee`, `deactivateUser`.
- [ ] Kullanıcı profil güncelleme akışını auth concern'lerinden tamamen ayır.
- [ ] Email/phone uniqueness hata senaryolarını netleştir.
- [ ] `users.role` ve `staff.role` uyumluluk kurallarını policy seviyesinde zorunlu kıl.
- [ ] User service testlerini role ve uniqueness senaryolarıyla genişlet.

## 10. Salon Modülünü Ayrıştır

- [ ] Public salon okuma akışını owner yönetim akışından mantıksal olarak ayır.
- [ ] Working hours JSON şemasını daha katı validate et.
- [ ] Salon aktif/pasif yaşam döngüsünü netleştir.
- [ ] Salon ownership validation kurallarını servis/policy seviyesinde merkezileştir.
- [ ] Salon listeleme ve detay response projection'larını sadeleştir.
- [ ] Salon modülü için unit ve e2e testlerini owner/public senaryolarıyla genişlet.

## 11. Staff Modülünü Tamamla

- [ ] Employee provisioning akışını user modülü contract'ları üzerinden yürüt.
- [ ] Aynı kullanıcının aynı salonda tek üyelik kuralını testlerle doğrula.
- [ ] Barber ve receptionist rol farklarını policy seviyesinde netleştir.
- [ ] `GET /staff/me` ihtiyacını değerlendir ve gerekiyorsa ekle.
- [ ] Staff aktif/pasif durum geçişlerini reservation görünürlüğü ile birlikte test et.

## 12. Reservation Concurrency ve Slot Güvenliğini Bitir

- [ ] Booking öncesi Redis lock akışını yarış koşulu testleriyle doğrula.
- [ ] PostgreSQL transaction içinde booking işlemini concurrency senaryolarında test et.
- [ ] Cancel edilmiş reservation sonrası aynı slotun tekrar alınabildiğini doğrula.
- [ ] Slot selection TTL ve reservation lock TTL davranışlarını test et.
- [ ] WebSocket/slot gateway varsa canlı seçim akışını entegrasyon testleriyle doğrula.

## 13. API Standardını Tamamla

- [ ] `TransformInterceptor` içinde standart response envelope uygula.
- [ ] Başarılı response formatını tüm modüllerde aynı hale getir.
- [ ] Hata response formatını tüm modüllerde tek tipe indir.
- [ ] Swagger şemalarını güncel DTO ve auth korumaları ile hizala.
- [ ] API versioning ihtiyacını değerlendir ve gerekiyorsa aktif et.
- [ ] DTO isimlendirmelerinde camelCase standardını koru.
- [ ] Repository seviyesinde snake_case mapping dışında DB alan adını dışarı sızdırma.

## 14. Test Katmanını Güçlendir

- [ ] Stale veya zayıf test senaryolarını gerçek business flow senaryolarıyla değiştir.
- [ ] Auth için register/login/refresh/logout/logout-all e2e senaryoları ekle.
- [ ] Salon için public discovery + owner CRUD e2e senaryoları ekle.
- [ ] Staff için owner CRUD ve role invariant testleri ekle.
- [ ] Reservation için create/cancel/status-change/concurrency e2e senaryoları ekle.
- [ ] Health readiness için database, redis ve migration eksikliği senaryolarını test et.
- [ ] Repository integration testleri ekle.
- [ ] Coverage raporunu kritik modüller için takip edilir hale getir.

## 15. Operasyonel Sertleştirme

- [ ] Structured logging standardı ekle.
- [ ] Readiness ve liveness endpoint'lerini deployment beklentileriyle hizala.
- [ ] Startup validation akışını deployment pipeline ile uyumlu hale getir.
- [ ] Production CORS origin listesini netleştir.
- [ ] HTTPS dışı ortam davranışını yalnızca local ile sınırla.
- [ ] Güvenlik başlıkları ve timeout ayarlarını gözden geçir.

## 16. Dokümantasyon Eşitleme

- [ ] [BACKEND_ARCHITECTURE.md](C:/Users/MrMahirr/Desktop/Ustura/Docs/BACKEND_ARCHITECTURE.md) içeriğini mevcut backend gerçekliği ile güncelle.
- [ ] [BACKEND_ARCHITECTURE_MASTER_PLAN.md](C:/Users/MrMahirr/Desktop/Ustura/Docs/BACKEND_ARCHITECTURE_MASTER_PLAN.md) içindeki artık tamamlanmış maddeleri revize et.
- [ ] Backend için gerçek kurulum ve çalıştırma adımlarını [README.md](C:/Users/MrMahirr/Desktop/Ustura/ustura_backend/README.md) içine yaz.
- [ ] Modül sınırları ve dependency kurallarını örneklerle belgeye ekle.
- [ ] Migration ve test çalıştırma akışını açıkça dokümante et.

## 17. Definition of Done

- [ ] Owner onboarding super-admin onayı ile uçtan uca çalışıyor.
- [ ] Customer rezervasyon oluşturabiliyor, görüntüleyebiliyor ve iptal edebiliyor.
- [ ] Owner salon ve personel yönetimini uçtan uca yapabiliyor.
- [ ] Barber sadece kendi randevularını görebiliyor ve kendi yetki sınırında işlem yapabiliyor.
- [ ] Receptionist salon bazlı operasyonları staff yönetimine taşmadan yapabiliyor.
- [ ] Reservation concurrency koruması testlerle doğrulanmış durumda.
- [ ] Audit ve notification yan etkileri business transaction'dan ayrılmış durumda.
- [ ] Dokümanlar, migration'lar, testler ve runtime davranışı birbirleriyle uyumlu durumda.
