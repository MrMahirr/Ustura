# Ustura Gereksinim Analizi

Bu belge, `Docs` klasorundeki mevcut dokumanlar ile `Ustura_Frontend` ve `ustura_backend` kod tabaninin birlikte analiz edilmesiyle sifirdan hazirlanmistir. Amaci, projedeki tum ana gereksinimleri tek bir referans dokumanda toplamak, MVP kapsamini netlestirmek ve mevcut mimari ile uyumlu bir gereksinim seti tanimlamaktir.

## 1. Urun Tanimi

Ustura; musterilerin salon, personel ve saat secerek randevu olusturabildigi; salon sahiplerinin salon, personel, vitrin, hizmet, rezervasyon ve paket yonetimi yapabildigi; personellerin kendi operasyonlarini takip edebildigi; super adminin ise platform genelini yonettigi cok rollu bir erkek kuafor rezervasyon platformudur.

Platformun temel is hedefleri:

- Erkek kuafor rezervasyon surecini dijitallestirmek
- Salon sahiplerine operasyonel bir yonetim paneli sunmak
- Musteriye salon ve berber secme ozgurlugu vermek
- 30 dakikalik slot bazli rezervasyon modeli ile cakismalari onlemek
- Super admin tarafinda platform yonetimi, basvuru onayi ve denetim sureclerini merkezilestirmek
- Salonlar icin vitrin, hizmet ve abonelik/paket yonetimi gibi ticari genisleme alanlarini desteklemek

## 2. Paydaslar ve Roller

### 2.1 Musteri

- Salonlari listeleyebilir, filtreleyebilir ve detaylarini inceleyebilir
- Secili salon icindeki personelleri gorup randevu olusturabilir
- Kendi randevularini listeleyebilir ve iptal edebilir
- E-posta/sifre ile veya desteklenen web sosyal giris akislari ile oturum acabilebilir

### 2.2 Salon Sahibi

- Kendi salonunu ve salon vitrinini yonetir
- Personel ekler, gunceller, pasife alir veya siler
- Salon hizmetlerini, calisma saatlerini ve medya alanlarini yonetir
- Tum salon rezervasyonlarini gorebilir ve yonetebilir
- Paket/abonelik talebi olusturabilir ve aktif paketini takip edebilir

### 2.3 Berber

- Yalnizca kendi atandigi randevulari gorur
- Yetkisi dahilinde randevu durumunu gunceller
- Kendi hesap/profil bilgilerini ve personel fotografini guncelleyebilir

### 2.4 Resepsiyonist

- Salon bazli randevulari gorur
- Operasyonel rezervasyon akislarina destek olur
- Personel yasam dongusu yonetimi yapamaz
- Kendi profil bilgilerini guncelleyebilir

### 2.5 Super Admin

- Salon sahibi basvurularini inceler, duzenler, onaylar veya reddeder
- Tum kullanicilari ve salonlari platform seviyesinde gorur ve yonetir
- Paketleri, abonelikleri ve onay kuyruklarini yonetir
- Bildirimler, audit loglar, raporlar ve platform ayarlari ekranlarina erisir

## 3. Kapsam

### 3.1 Genel Kapsam

Projede asagidaki is alanlari desteklenmelidir:

- Public landing ve tanitim sayfalari
- Kimlik dogrulama ve oturum yonetimi
- Salon listeleme ve salon detay/vitrin deneyimi
- Musteri rezervasyon wizard'i ve musteri randevu ekranlari
- Salon sahibi paneli
- Personel paneli
- Super admin paneli
- Paket ve abonelik yonetimi
- Bildirim, audit log ve raporlama altyapisi
- Medya/fotograf yukleme akisleri

### 3.2 Kapsam Disi veya Sonraki Fazlar

Asagidaki alanlar temel dokumanlarda sonraki faz olarak gorunmektedir; ancak gelecek genisleme olarak dusunulmelidir:

- Online odeme veya on odeme
- SMS/push kanallariyla genis bildirim sistemi
- Musteri yorum ve puanlama modulu
- Coklu dil destegi
- Native mobil uygulamaya ozel davranislar
- Gelismis kampanya/CRM motoru

## 4. Islevsel Gereksinimler

### 4.1 Public ve Marka Deneyimi

- Uygulamanin public yuzu landing, hizmetler, hakkimizda, gizlilik politikasi ve kullanim kosullari sayfalarini icermelidir.
- Landing sayfasi hem musteriyi rezervasyon akisina hem de salon sahibini basvuru akisina yonlendirmelidir.
- Landing uzerinde salon sahibi basvuru formu bulunmali ve form gonderimi e-posta templating altyapisi ile yonetilmelidir.
- Public salon listesi, sehir bazli filtreleme, arama ve salon kartlari ile desteklenmelidir.
- Salon detay sayfasi; salon bilgisi, vitrin fotografi, galeri, berber listesi ve hizmet ozeti gibi alanlari gosterebilmelidir.
- Public sayfalar masaustu ve mobil web'de tutarli calismalidir.

### 4.2 Kimlik Dogrulama ve Oturum

- Musteri kaydi ad, soyad, e-posta, telefon ve sifre ile yapilabilmelidir.
- Musteri girisi e-posta/sifre ile yapilabilmelidir.
- Desteklenen platformlarda musteri icin web tabanli Google giris akisi desteklenmelidir.
- Personel ve super admin icin ayrismis giris ekranlari bulunmalidir.
- JWT tabanli access ve refresh token akisi kurulmalidir.
- Sifre degistirme, logout ve logout-all akisleri desteklenmelidir.
- Gecici sifre ile acilan hesaplarda zorunlu sifre degistirme senaryosu desteklenmelidir.
- Tum korumali endpointler rol bazli guard/policy kontrollerine tabi olmalidir.

### 4.3 Salon Sahibi Basvurusu ve Onay Sureci

- Salon sahibi adaylari basvuru olusturabilmelidir.
- Basvuru kaydi salon ve iletisim bilgileriyle birlikte tutulmalidir.
- Super admin basvuruyu listeleyebilmeli, duzenleyebilmeli, onaylayabilmeli veya reddedebilmelidir.
- Onay durumunda owner hesabi ve salon kaydi transaction guvenli sekilde olusturulmalidir.
- Onay e-postasi ve gecici sifre bilgilendirmesi templated mail ile gonderilmelidir.

### 4.4 Salon Katalogu ve Salon Yonetimi

- Aktif salonlar public olarak listelenebilmelidir.
- Salon detay endpoint ve ekranlari salonun kamuya acik alanlarini donebilmelidir.
- Salon sahibi kendi sahip oldugu salonlari gorebilmeli ve detay bilgilerini duzenleyebilmelidir.
- Salon bilgileri icinde ad, adres, sehir, ilce, tanitim icerigi, kapak fotografi ve galeri bulunabilmelidir.
- Salon vitrin fotografi ve galeri yonetimi owner tarafindan yapilabilmelidir.
- Salonun aktif/pasif durumu platform seviyesinde denetlenebilmelidir.
- Salon calisma saatleri gun bazli yapida saklanmali ve dogrulanmalidir.

### 4.5 Hizmet Yonetimi

- Her salon kendi hizmetlerini tanimlayabilmelidir.
- Hizmet kayitlari ad, sure, fiyat, aciklama ve aktiflik gibi alanlari desteklemelidir.
- Owner kendi salonuna ait hizmetleri ekleyebilmeli, guncelleyebilmeli ve silebilmelidir.
- Salon hizmetleri public vitrin ve operasyon ekranlarinda kullanilabilir olmalidir.

### 4.6 Personel Yonetimi

- Salon sahibi kendi salonuna personel ekleyebilmelidir.
- Personel kaydi olustururken kullanici hesabi ve staff uyeligi birlikte yonetilmelidir.
- Personel icin ad, soyad, e-posta, telefon, rol, bio/not, profil fotografi ve sifre gibi alanlar guncellenebilmelidir.
- Ayni kullanicinin ayni salonda birden fazla aktif uyeligi engellenmelidir.
- Personel rolleri en az `barber` ve `receptionist` olarak desteklenmelidir.
- Personel listesi filtrelenebilir, aranabilir ve durum bazli goruntulenebilir olmalidir.
- Personel silme veya pasife alma isleminde aktif rezervasyon riski dikkate alinmalidir.
- Personel fotografi hem salon sahibi tarafindan hem de personelin kendisi tarafindan yuklenebilmeli/guncellenebilmelidir.
- Fotograf yukleme deneyimi drag-and-drop desteklemelidir.

### 4.7 Musteri Rezervasyon Akisi

- Randevu akisi salon secimi, personel secimi ve saat secimi adimlarini icermelidir.
- Secili salon parametre ile onceki ekrandan tasinabilmelidir.
- Personel secim ekraninda aktif staff listesi ve uygun fallback personel secenegi desteklenmelidir.
- Tarih/saat secimi ekraninda 30 dakikalik slotlar uretilmeli ve listelenmelidir.
- Dolu slotlar tiklanamaz, musait slotlar secilebilir olmalidir.
- Rezervasyon onayinda secilen salon, personel, tarih ve saat ozeti kullaniciya gosterilmelidir.
- Rezervasyon olusturma akisi backend transaction ve lock mantigi ile cakisma korumali olmalidir.
- Basarili rezervasyon sonrasi kullanici randevularim ekranina veya onay durumuna yonlendirilmelidir.
- Musteri kendi rezervasyonlarini listeleyebilmeli ve yetki dahilinde iptal edebilmelidir.

### 4.8 Rezervasyon Operasyonlari

- Rezervasyon status modeli en az `pending`, `confirmed`, `cancelled`, `completed`, `noShow` benzeri operasyonel durumlari desteklemelidir.
- Owner salon bazli tum rezervasyonlari gorebilmelidir.
- Berber yalnizca kendi atandigi rezervasyonlari gorebilmelidir.
- Resepsiyonist salon bazli rezervasyon goruntusune sahip olmali ancak personel yonetim yetkisine sahip olmamalidir.
- Yetkili roller rezervasyon durumunu is kurallarina uygun sekilde guncelleyebilmelidir.
- Rezervasyon filtreleme; tarih, personel, durum ve arama eksenlerinde desteklenmelidir.
- Takvim, liste ve gunluk operasyon ekranlari owner/personel deneyimine uygun sekilde sunulmalidir.

### 4.9 Personel Self-Service Ayarlari

- Personel kendi hesap bilgilerini guncelleyebilmelidir.
- Kendi profil fotografisini yukleyebilmeli veya silebilmelidir.
- Kendi sifresini degistirebilmelidir.
- Kendi atandigi aktif salon baglamindaki temel profil verilerini gorebilmelidir.

### 4.10 Salon Sahibi Paneli

- Dashboard ekraninda gunluk ve haftalik ozet metrikler bulunmalidir.
- Randevu listesi ve bugunun operasyonel durumu gorulebilmelidir.
- Personel ekraninda ekleme, duzenleme, izin/yetki verme ve silme akisleri desteklenmelidir.
- Randevu ekraninda owner icin salon genelinde rezervasyon takibi saglanmalidir.
- Ayarlar ekraninda salon bilgileri, vitrin, hizmetler, calisma saatleri, bildirim ve hesap alanlari sekmeli yapida bulunmalidir.
- Paketler ekraninda aktif plan, paket karsilastirma ve talep olusturma akisleri bulunmalidir.
- Bildirimler ekrani operasyonel ve sistem kaynakli bildirimleri gosterebilmelidir.

### 4.11 Super Admin Paneli

- Super admin paneli ayri route yapisi ve ayri kimlik dogrulama akisi ile korunmalidir.
- Dashboard ekraninda platform genel KPI, aktif salonlar, son eklenen salonlar ve bekleyen onaylar gorulebilmelidir.
- Basvurular ekraninda owner application kayitlari filtrelenmeli ve aksiyonlanabilmelidir.
- Kullanicilar ekraninda tum kullanicilar ve salon bazli uyelikler gorulebilmeli; detay, profil ve durum guncelleme islemleri yapilabilmelidir.
- Salonlar ekraninda platformdaki salonlar listelenmeli; durum, detay, staff, hizmet ve abonelik iliskileri incelenebilmelidir.
- Paketler ekraninda paket CRUD, abonelik listesi, onay kuyrugu ve paket profil akislari bulunmalidir.
- Bildirimler ekrani admin bildirim merkezi gibi calismalidir.
- Loglar ekrani audit verisini filtrelenebilir sekilde sunmalidir.
- Raporlar ekrani gelir, buyume, salon dagilimi ve sistem canliligi gibi gostergeleri sunmalidir.
- Ayarlar ekrani genel, guvenlik, rezervasyon, e-posta ve sistem sekmelerini desteklemelidir.

### 4.12 Paket ve Abonelik Yonetimi

- Platform, farkli paket tanimlarini desteklemelidir.
- Paketler icin ad, aciklama, fiyat, ozellik listesi ve aktiflik gibi alanlar yonetilebilmelidir.
- Salon sahipleri paket talebi/abonelik istegi gonderebilmelidir.
- Super admin paket taleplerini gorebilmeli, onaylayabilmeli veya durum guncelleyebilmelidir.
- Kullanicinin aktif abonelik durumu hem owner hem admin tarafinda izlenebilmelidir.

### 4.13 Bildirim ve E-Posta

- Owner basvuru, rezervasyon, durum degisimi ve operasyonel olaylar icin bildirim uretilebilmelidir.
- E-posta templating altyapisi dinamik parametrelerle calismalidir.
- Bildirimler ana transaction'i bloklamayacak sekilde ele alinmalidir.
- Kullanici tarafinda okundu/isaretlendi gibi temel bildirim aksiyonlari desteklenmelidir.

### 4.14 Audit, Raporlama ve Operasyonel Gorunurluk

- Guvenlik ve operasyon acisindan anlamli tum kritik hareketler audit log olarak kaydedilmelidir.
- Super admin audit kayitlarini filtreleyebilmelidir.
- Platform raporlari salon, kullanici, paket ve rezervasyon ekseninde ozet veri sunabilmelidir.
- Sistem sagligi icin health/live ve health/ready endpointleri bulunmalidir.

## 5. Veri ve Alan Gereksinimleri

Temel veri varliklari:

- `users`
- `refresh_tokens`
- `salons`
- `staff`
- `salon_services`
- `reservations`
- `owner_applications`
- `packages`
- `subscriptions` veya paket baglantili uyelik kayitlari
- `notifications`
- `audit_logs`

Veri modelinde asagidaki kurallar korunmalidir:

- Tum ana kimlik alanlari UUID olmalidir.
- Tarih alanlari tutarli zaman dilimi stratejisiyle saklanmalidir.
- API dis yuzeyi camelCase, veritabani alanlari gerekirse repository katmaninda snake_case olarak haritalanmalidir.
- `staff` ve `users` rol uyumlulugu policy seviyesinde korunmalidir.
- Aktif rezervasyon cakismasi sadece aktif durumlar icin benzersiz olacak sekilde modellenmelidir.

## 6. Mimari Gereksinimler

### 6.1 Backend

- Backend NestJS uzerinde moduler monolith olarak gelistirilmelidir.
- Her ana alan kendi modulu icinde controller, service/application, dto, repository ve interface katmanlariyla ayrismalidir.
- Raw SQL kullanimi korunmali; ORM kullanilmamalidir.
- Transaction gereken akislarda merkezi database servisi kullanilmalidir.
- Redis tabanli lock/caching altyapisi rezervasyon ve hizlandirma senaryolari icin kullanilabilmelidir.
- Swagger/OpenAPI dokumantasyonu aktif ve guncel tutulmalidir.
- Global validation pipe, exception filter, response transform ve security middlewareleri bootstrap seviyesinde tanimlanmalidir.

### 6.2 Frontend

- Frontend Expo Router tabanli route yapisini kullanmalidir.
- Sayfalar component-first yaklasimla tasarlanmalidir.
- API erisimi service katmaninda, ekran baglantilari hook katmaninda soyutlanmalidir.
- Tekrarlanan UI kisimlari yeniden kullanilabilir componentlere ayrilmalidir.
- Rol bazli gorunum ve route guard mekanizmalari UI ve data katmaninda birlikte ele alinmalidir.

### 6.3 SOLID ve Kod Organizasyonu

- Her component ve servis tek bir sorumluluga odaklanmalidir.
- UI, veri cekme ve is kurallari mumkun oldugunca ayrismalidir.
- Ortak davranislar shared component, utility veya service katmaninda toplanmalidir.
- Moduller arasi repository erisimi yerine contract veya service tabanli iletisim tercih edilmelidir.

## 7. Guvenlik Gereksinimleri

- Sifreler guclu hash algoritmasi ile saklanmalidir.
- Secret ve hassas konfigurasyonlar yalnizca environment uzerinden alinmalidir.
- CORS yalnizca izinli originlere acik olmalidir.
- Girdi dogrulamasi global olarak acik olmali, bilinmeyen alanlar reddedilmelidir.
- Yetkilendirme controller seviyesinde degil, guard ve policy katmanlariyla korunmalidir.
- Login, refresh ve benzeri kritik endpointlerde rate limiting uygulanmalidir.
- Dosya yukleme akislarinda tip, boyut ve guvenlik kontrolleri uygulanmalidir.

## 8. Performans ve Guvenilirlik Gereksinimleri

- Slot listeleme ve rezervasyon deneyimi kullaniciyi bekletmeyecek seviyede hizli olmalidir.
- Veritabani baglanti havuzu kontrollu boyutta kullanilmalidir.
- Rezervasyon olusturma akisi transaction + lock birlikteligi ile yarisa dayanikli olmalidir.
- Cache kullanilan alanlarda dogru invalidation stratejisi bulunmalidir.
- Health kontrolleri deployment ortamina uygun calismalidir.
- Kritik operasyonlar icin hata durumunda rollback veya telafi mantigi bulunmalidir.

## 9. Tasarim ve Kullanilabilirlik Gereksinimleri

- Tum yeni ekranlar mevcut premium dark/gold tasarim dili ile uyumlu olmalidir.
- Tema renkleri, tipografi ve yuzey tokenlari merkezi sistemden gelmelidir.
- Tasarim yuzey ayrimi, editorial tipografi ve kontrollu parlak vurgu mantigini korumalidir.
- Bilesenler desktop ve mobil web kirilimlarinda tutarli calismalidir.
- Secili, hover, focus ve disabled durumlari kontrast kaybetmeden tanimlanmalidir.
- Drag-and-drop, modal, tablo, kart, filtre ve takvim bilesenleri ayni gorsel sistemin parcasi gibi davranmalidir.

## 10. Test ve Dogrulama Gereksinimleri

- Auth, salon, staff, reservation, package ve platform admin akislarinda en az e2e kapsama bulunmalidir.
- Rezervasyon concurrency senaryosu test ile dogrulanmalidir.
- Yetki matrisi; owner, barber, receptionist, customer ve super admin icin dogrulanmalidir.
- Kritik repository ve service katmanlarinda unit/integration test bulunmalidir.
- Swagger ve health endpointleri calisir durumda tutulmalidir.

## 11. Kabul Kriterleri

Bir cekirdek surumun kabul edilebilir sayilmasi icin asgari olarak:

- Musteri salon secip randevu olusturabilmelidir.
- Musteri kendi randevularini gorebilmeli ve iptal edebilmelidir.
- Salon sahibi salon, personel, hizmet ve calisma saati bilgilerini yonetebilmelidir.
- Personel sadece yetkili oldugu veri kapsamini gorebilmelidir.
- Super admin basvurulari, kullanicilari ve salonlari yonetebilmelidir.
- Paket ve abonelik akislarinin en az temel listeleme ve durum yonetimi calismalidir.
- Fotograf ve vitrin yukleme akislarinin owner/personel taraflari calismalidir.
- Bildirim ve audit kayitlari kritik olaylarda uretilmelidir.
- Tanimli endpointler Swagger uzerinden incelenebilir ve test edilebilir olmalidir.

## 12. Varsayimlar ve Notlar

- Bu belge ilk MVP dokumanlarindaki cekirdek gereksinimleri korur, ancak mevcut kod tabaninda artik gercek moduller olarak bulunan paketler, raporlar, audit log, bildirim merkezi, salon vitrin galerisi, hizmet yonetimi ve medya yukleme akislarini da kapsam dahiline alir.
- Eski dokumanlarda gecen bazi teknoloji onerileri mevcut kod tabaninda birebir kullanilmamaktadir. Bu nedenle bu belge teknoloji bagimli detaydan cok, mevcut mimariye uygun davranis ve moduler sinirlari esas alir.
- PDF ve DOCX kaynaklarin tekrar eden kisimlari normalize edilmis; celisen yerlerde mevcut uygulama mimarisi ve bugunku kod kapsami baz alinmistir.

## 13. Kaynaklar

Bu analiz olusturulurken su kaynaklar birlikte okunmustur:

- `Docs/ARCHITECTURE_RULES.md`
- `Docs/BACKEND_ARCHITECTURE.md`
- `Docs/BACKEND_ARCHITECTURE_MASTER_PLAN.md`
- `Docs/BACKEND_IMPLEMENTATION_CHECKLIST.md`
- `Docs/FRONTEND_ARCHITECTURE.md`
- `Docs/DESIGN.md`
- `Docs/USTURA_table.txt`
- `Docs/barber-prereport-v3.jsx`
- `Docs/ustura-gereksinim-analizi.docx`
- `Docs/ustura-gereksinim-analizi-v2.docx`
- `Docs/ustura-proje-dosyasi.docx`
- `Ustura_Frontend` uygulama route, component, hook ve service katmani
- `ustura_backend` modul, controller ve bootstrap yapisi
