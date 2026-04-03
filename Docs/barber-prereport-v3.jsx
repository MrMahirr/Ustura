import { useState } from "react";

const PURPLE = "#7F77DD";
const TEAL = "#1D9E75";
const AMBER = "#BA7517";
const CORAL = "#D85A30";
const GRAY = "#888780";

const sections = [
  {
    id: "pages",
    label: "Sayfa Mimarisi",
    icon: "🗂️",
    content: { type: "pages" },
  },
  {
    id: "tech",
    label: "Teknoloji Önerileri",
    icon: "⚙️",
    content: { type: "tech" },
  },
  {
    id: "roles",
    label: "Roller & Yetkiler",
    icon: "👥",
    content: { type: "roles" },
  },
  {
    id: "wizard",
    label: "Randevu Wizard",
    icon: "📅",
    content: { type: "wizard" },
  },
  {
    id: "emailjs",
    label: "EmailJS Entegrasyonu",
    icon: "✉️",
    content: { type: "emailjs" },
  },
  {
    id: "db",
    label: "Veri Modeli",
    icon: "🗄️",
    content: { type: "db" },
  },
  {
    id: "swagger",
    label: "Swagger Zorunluluğu",
    icon: "📄",
    content: { type: "swagger" },
  },
  {
    id: "roadmap",
    label: "Yol Haritası",
    icon: "🗺️",
    content: { type: "roadmap" },
  },
  {
    id: "risks",
    label: "Riskler",
    icon: "⚠️",
    content: { type: "risks" },
  },
];

function Tag({ text, color = PURPLE, bg }) {
  return (
    <span style={{
      background: bg || color + "18",
      color,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      border: `1px solid ${color}30`,
    }}>{text}</span>
  );
}

function Card({ children, accent, style = {} }) {
  return (
    <div style={{
      background: "#13131C",
      border: `1px solid ${accent ? accent + "35" : "#1E1E2E"}`,
      borderRadius: 12,
      padding: "16px 20px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, color = PURPLE }) {
  return (
    <div style={{ fontWeight: 700, color, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      {children}
    </div>
  );
}

function Pages() {
  const pages = [
    {
      num: "01",
      name: "Landing Page",
      color: GRAY,
      route: "/",
      target: "Herkese açık",
      sections: [
        "Hero — değer önerisi (kuaför sahiplerine + müşterilere)",
        "Hizmetler bölümü — kuaför sahipleri için faydalar",
        "Nasıl çalışır — 3 adımlı görsel akış",
        "Kuaförlerimiz — kayıtlı salonları listele/tanıt",
        "EmailJS ile kuaför sahibi kayıt formu (CTA)",
      ],
      note: "İki hedef kitleye ayrı CTA butonları olacak: 'Salonumu kaydet' ve 'Randevu al'",
    },
    {
      num: "02",
      name: "Kuaför Seçim Sayfası",
      color: TEAL,
      route: "/kuaforler",
      target: "Müşteri",
      sections: [
        "Kayıtlı kuaförlerin listesi (kart görünümü)",
        "Filtre: şehir, yıldız, müsaitlik",
        "Her kartta: fotoğraf, isim, puan, adres",
        "Neden bu hizmeti kullanalım — değer önerisi bölümü",
        "CTA: 'Randevu Al' → wizard akışına yönlendirme",
      ],
      note: "Bu sayfa hem landing'den hem de direkt URL ile erişilebilir olmalı",
    },
    {
      num: "03",
      name: "Randevu Wizard",
      color: TEAL,
      route: "/randevu",
      target: "Müşteri",
      sections: [
        "Adım 1 — Kuaför seç (zaten seçildiyse atla)",
        "Adım 2 — Personel/berber seç",
        "Adım 3 — Tarih & saat seç (30dk slotlar)",
        "Özet & Onay ekranı",
        "Başarılı rezervasyon sayfası",
      ],
      note: "URL parametresiyle kuaför önceden seçili gelebilir: /randevu?salon=123",
    },
    {
      num: "04",
      name: "Kuaför Sahibi Panel",
      color: PURPLE,
      route: "/panel",
      target: "Kuaför sahibi",
      sections: [
        "Dashboard — bugünün randevuları, özet istatistik",
        "Personel yönetimi — ekle/düzenle/sil, rol ata",
        "Randevu takvimi — günlük/haftalık görünüm",
        "Ayarlar — çalışma saatleri, salon bilgisi",
      ],
      note: "Erişim JWT ile korunur, sahip rolü zorunlu",
    },
    {
      num: "05",
      name: "Personel Görünümü",
      color: PURPLE,
      route: "/panel/personel",
      target: "Berber / Resepsiyonist",
      sections: [
        "Sadece kendi randevularını görür (berber rolü)",
        "Resepsiyonist: tüm randevuları görür, personel yönetemez",
        "Gün bazlı takvim",
        "Randevu durumu güncelleme (geldi / gelmedi)",
      ],
      note: "Rol JWT payload içinde taşınır, backend guard ile kontrol edilir",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {pages.map((p, i) => (
        <Card key={i} accent={p.color}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: p.color, fontWeight: 700 }}>{p.num}</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#E8E8F0" }}>{p.name}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#7070A0" }}>{p.route}</span>
            </div>
            <Tag text={p.target} color={p.color} />
          </div>
          <ul style={{ margin: 0, padding: "0 0 0 16px", marginBottom: 10 }}>
            {p.sections.map((s, j) => (
              <li key={j} style={{ fontSize: 12.5, color: "#B0B0C8", marginBottom: 5, lineHeight: 1.5 }}>{s}</li>
            ))}
          </ul>
          <div style={{ background: "#0E0E14", borderRadius: 6, padding: "7px 12px", fontSize: 12, color: p.color }}>
            Not: {p.note}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Tech() {
  const stacks = [
    {
      layer: "Frontend",
      color: "#61DAFB",
      recommended: "React Native Web (Expo)",
      why: "Kesin karar: React Native Web kullanılacak. Expo ile hem web hem ileride native iOS/Android ayni kod tabanindan calisir. Expo Router ile file-based routing, StyleSheet ile responsive layout.",
      alternatives: [],
      libs: [
        { name: "Expo + react-native-web", use: "Web render motoru" },
        { name: "Expo Router", use: "File-based routing" },
        { name: "TanStack Query", use: "API state yonetimi" },
        { name: "Zustand", use: "Global state (auth, wizard)" },
        { name: "React Hook Form", use: "Form yonetimi" },
        { name: "date-fns", use: "Saat/slot hesaplama" },
        { name: "AsyncStorage", use: "Token saklama (web: localStorage)" },
      ],
      verdict: "Kesin Karar",
      verdictColor: TEAL,
    },
    {
      layer: "Backend",
      color: "#E0234E",
      recommended: "NestJS + TypeScript",
      why: "Swagger entegrasyonu dekoratörlerle otomatik. Modüler yapı — Auth, Barber, Reservation modülleri net ayrılır. TypeScript frontend ile aynı dil = hata azalır.",
      alternatives: ["Express.js (hız öncelikliyse)", "FastAPI (Python biliyorsan)"],
      libs: [
        { name: "@nestjs/swagger", use: "Otomatik API dokumantasyonu" },
        { name: "pg (node-postgres)", use: "Raw SQL — ORM yok" },
        { name: "@nestjs/jwt", use: "JWT auth" },
        { name: "class-validator", use: "DTO validasyon" },
        { name: "bcrypt", use: "Sifre hash" },
        { name: "ioredis", use: "Slot kilitleme" },
      ],
      verdict: "Önerilen",
      verdictColor: TEAL,
    },
    {
      layer: "Veritabani",
      color: "#FBD38D",
      recommended: "PostgreSQL — Raw SQL",
      why: "ORM kullanilmayacak. pg (node-postgres) ile raw SQL yazilacak. Transaction destegi slot race condition kontrolu icin kritik. Migration icin sql dosyalari elle yonetilecek.",
      alternatives: [],
      libs: [
        { name: "pg", use: "node-postgres — raw SQL driver" },
        { name: "pg-pool", use: "Connection pooling" },
        { name: "Redis", use: "Race condition onleme" },
      ],
      verdict: "Kesin Karar",
      verdictColor: TEAL,
    },
    {
      layer: "Deploy & Altyapı",
      color: "#FC8181",
      recommended: "Vercel (FE) + Railway (BE)",
      why: "İkisi de ücretsiz tier var. Vercel React/Vite için optimize. Railway NestJS + PostgreSQL + Redis tek yerde çalıştırır.",
      alternatives: ["Render.com", "Fly.io", "VPS (daha fazla kontrol)"],
      libs: [
        { name: "Cloudinary", use: "Berber fotoğrafları" },
        { name: "Resend / SendGrid", use: "E-posta bildirimi" },
      ],
      verdict: "Önerilen",
      verdictColor: TEAL,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {stacks.map((s, i) => (
        <Card key={i} accent={s.color}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, alignSelf: "stretch", background: s.color, borderRadius: 4 }} />
              <span style={{ fontWeight: 700, color: s.color, fontSize: 14 }}>{s.layer}</span>
              <span style={{ fontSize: 12, color: "#E8E8F0", fontFamily: "monospace" }}>{s.recommended}</span>
            </div>
            <Tag text={s.verdict} color={s.verdictColor} />
          </div>
          <div style={{ fontSize: 12.5, color: "#9090B0", marginBottom: 12, lineHeight: 1.6 }}>{s.why}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
            {s.libs.map((l, j) => (
              <div key={j} style={{ background: "#1A1A28", border: "1px solid #2E2E50", borderRadius: 6, padding: "4px 10px" }}>
                <span style={{ fontSize: 11.5, color: "#C4B5FD", fontFamily: "monospace" }}>{l.name}</span>
                <span style={{ fontSize: 11, color: "#6B6B8A", marginLeft: 6 }}>{l.use}</span>
              </div>
            ))}
          </div>
          {s.alternatives.length > 0 && (
            <div style={{ fontSize: 12, color: "#6B6B8A" }}>
              Alternatifler: {s.alternatives.join(" · ")}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function Roles() {
  const roles = [
    {
      name: "Kuaför Sahibi (owner)",
      color: PURPLE,
      permissions: [
        "Tüm randevuları görüntüle ve yönet",
        "Personel ekle, düzenle, sil",
        "Personele rol ata (berber / resepsiyonist)",
        "Salon bilgilerini düzenle",
        "Çalışma saatlerini ayarla",
        "İstatistikleri görüntüle",
      ],
      jwt: 'role: "owner"',
    },
    {
      name: "Berber (barber)",
      color: CORAL,
      permissions: [
        "Sadece kendi randevularını görüntüle",
        "Randevu durumunu güncelle (geldi/iptal)",
        "Kendi profilini düzenle",
        "Müsaitlik durumunu güncelle",
      ],
      jwt: 'role: "barber"',
    },
    {
      name: "Resepsiyonist (receptionist)",
      color: AMBER,
      permissions: [
        "Tüm randevuları görüntüle",
        "Randevu oluştur / iptal et",
        "Personeli görüntüle (düzenleyemez)",
        "Müşteri bilgilerini görüntüle",
      ],
      jwt: 'role: "receptionist"',
    },
    {
      name: "Müşteri (customer)",
      color: TEAL,
      permissions: [
        "Kuaför & berber listesini görüntüle",
        "Randevu oluştur",
        "Kendi randevularını görüntüle & iptal et",
        "Kuaföre yorum/puan bırak (opsiyonel)",
      ],
      jwt: 'role: "customer"',
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {roles.map((r, i) => (
        <Card key={i} accent={r.color}>
          <div style={{ fontWeight: 700, color: r.color, fontSize: 14, marginBottom: 6 }}>{r.name}</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6B6B8A", background: "#0E0E14", padding: "4px 10px", borderRadius: 5, marginBottom: 12 }}>{r.jwt}</div>
          <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
            {r.permissions.map((p, j) => (
              <li key={j} style={{ fontSize: 12, color: "#B0B0C8", marginBottom: 5, lineHeight: 1.5 }}>{p}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

function Wizard() {
  const steps = [
    {
      step: "Adım 1",
      title: "Kuaför Seç",
      color: TEAL,
      route: "/randevu?step=1",
      ui: ["Kart grid — salon fotoğrafı, isim, puan, adres", "Filtre: şehir, müsaitlik", "Önceden URL param ile seçiliyse bu adım atlanır", "Seçili kuaför üstte highlight ile gösterilir"],
      api: "GET /barbers",
      state: "wizardStore: { salonId }",
    },
    {
      step: "Adım 2",
      title: "Berber Seç",
      color: TEAL,
      route: "/randevu?step=2",
      ui: ["Seçilen salona ait personel listesi", "Her kartta: fotoğraf, isim, uzmanlık", "Serbest sıra seçeneği (herhangi berber)"],
      api: "GET /barbers/:id/staff",
      state: "wizardStore: { salonId, staffId }",
    },
    {
      step: "Adım 3",
      title: "Saat Seç",
      color: TEAL,
      route: "/randevu?step=3",
      ui: ["Takvim görünümü — gün seç", "30 dakikalık slot grid (09:00, 09:30, 10:00...)", "Dolu slotlar gri + tıklanamaz", "Müsait slotlar yeşil"],
      api: "GET /barbers/:id/slots?date=2025-04-10&staffId=X",
      state: "wizardStore: { salonId, staffId, date, slotStart }",
    },
    {
      step: "Özet",
      title: "Onayla",
      color: GRAY,
      route: "/randevu?step=4",
      ui: ["Kuaför, berber, tarih-saat özeti", "Müşteri adı, telefon (auth yoksa)", "Onayla butonu → POST /reservations", "Başarı sayfası / e-posta bildirimi"],
      api: "POST /reservations",
      state: "Wizard state temizlenir",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card style={{ background: "#1A1A10", border: "1px solid #AMBER30" }}>
        <div style={{ fontSize: 12.5, color: "#9090B0", lineHeight: 1.7 }}>
          Wizard state yönetimi için <span style={{ color: "#EF9F27", fontFamily: "monospace" }}>Zustand</span> kullan. URL parametresi ile adım geçişi yap (<span style={{ fontFamily: "monospace", color: "#EF9F27" }}>?step=1</span>) — böylece sayfa yenilenmesinde kaybolmaz. Her adımda "geri" butonu ile önceki seçime dönülebilir.
        </div>
      </Card>
      {steps.map((s, i) => (
        <Card key={i} accent={s.color}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Tag text={s.step} color={s.color} />
              <span style={{ fontWeight: 700, color: "#E8E8F0", fontSize: 14 }}>{s.title}</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6B6B8A" }}>{s.route}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>UI</div>
              {s.ui.map((u, j) => <div key={j} style={{ fontSize: 12, color: "#B0B0C8", marginBottom: 4 }}>→ {u}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>API & State</div>
              <div style={{ fontFamily: "monospace", fontSize: 11.5, color: s.color, background: "#0E0E14", padding: "5px 10px", borderRadius: 5, marginBottom: 8 }}>{s.api}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#7070A0" }}>{s.state}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmailJS() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card accent={AMBER}>
        <SectionTitle color={AMBER}>EmailJS nedir ve neden kullanılıyor?</SectionTitle>
        <div style={{ fontSize: 13, color: "#B0B0C8", lineHeight: 1.7 }}>
          EmailJS, backend kodu yazmadan tarayıcıdan direkt e-posta göndermeye yarayan bir servistir. Landing page'deki kuaför sahibi kayıt formu için idealdir — form doldurup "Gönder" denildiğinde EmailJS sizin belirlediğiniz adrese (admin@siteadı.com) otomatik e-posta gönderir.
        </div>
      </Card>
      <Card>
        <SectionTitle>Kurulum adımları</SectionTitle>
        {[
          "emailjs.com'da hesap aç, ücretsiz tier: 200 e-posta/ay",
          "E-posta şablonu oluştur: salon adı, yetkili adı, telefon, e-posta alanları",
          "Service ID, Template ID, Public Key bilgilerini al",
          "Form submit'te emailjs.send() çağır",
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: AMBER + "20", color: AMBER, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 12.5, color: "#B0B0C8", lineHeight: 1.5 }}>{s}</div>
          </div>
        ))}
      </Card>
      <Card>
        <SectionTitle>Kod örneği</SectionTitle>
        {[
          "",
          "const handleSubmit = async (formData) => {",
          "  await emailjs.send(",
          "    'SERVICE_ID',",
          "    'TEMPLATE_ID',",
          "    { salon_name: formData.salonName,",
          "      owner_name: formData.ownerName,",
          "      phone: formData.phone },",
          "    'PUBLIC_KEY'",
          "  );",
          "};",
        ].map((line, i) => (
          <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: line.startsWith("//") ? "#6B6B8A" : "#68D391", background: "#0E0E14", padding: i === 0 ? "10px 14px 2px" : line === "" ? "0 14px" : "2px 14px", lineHeight: 1.8, borderRadius: i === 0 ? "8px 8px 0 0" : i === 12 ? "0 0 8px 8px" : 0 }}>
            {line || "\u00a0"}
          </div>
        ))}
      </Card>
      <Card accent={CORAL}>
        <div style={{ fontSize: 12.5, color: "#F09595", lineHeight: 1.6 }}>
          Önemli: EmailJS sadece kayıt formu için kullanılıyor. Randevu bildirimleri gibi kritik e-postalar için backend'den Resend veya SendGrid kullan — daha güvenilir ve rate limit yok.
        </div>
      </Card>
    </div>
  );
}

function DB() {
  const tables = [
    { name: "User", color: PURPLE, fields: ["id (uuid PK)", "name", "email (unique)", "phone", "passwordHash", "role (owner|barber|receptionist|customer)", "createdAt"] },
    { name: "Salon", color: TEAL, fields: ["id (uuid PK)", "ownerId (FK → User)", "name", "address", "city", "photoUrl", "workingHours (JSON)", "isActive", "createdAt"] },
    { name: "Staff", color: CORAL, fields: ["id (uuid PK)", "userId (FK → User)", "salonId (FK → Salon)", "role (barber|receptionist)", "bio", "photoUrl", "isActive"] },
    { name: "Reservation", color: AMBER, fields: ["id (uuid PK)", "customerId (FK → User)", "salonId (FK → Salon)", "staffId (FK → Staff)", "slotStart (datetime)", "slotEnd (slotStart + 30dk)", "status (pending|confirmed|cancelled)", "createdAt"] },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {tables.map((t, i) => (
        <Card key={i} accent={t.color}>
          <div style={{ fontWeight: 700, color: t.color, fontFamily: "monospace", fontSize: 14, marginBottom: 10 }}>{t.name}</div>
          {t.fields.map((f, j) => (
            <div key={j} style={{ fontFamily: "monospace", fontSize: 11.5, color: "#7070A0", padding: "3px 0", borderBottom: j < t.fields.length - 1 ? "1px solid #1A1A28" : "none" }}>{f}</div>
          ))}
        </Card>
      ))}
      <Card style={{ gridColumn: "1 / -1" }} accent={GRAY}>
        <div style={{ fontSize: 12, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Raw SQL ile calisma sekli</div>
        <div style={{ background: "#0E0E14", borderRadius: 8, padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#68D391", lineHeight: 1.9, marginBottom: 12 }}>
          <div style={{color:"#6B6B8A"}}>-- Migration: elle yazilan SQL dosyasi</div>
          <div>{"CREATE TABLE reservation ("}</div>
          <div>{"  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),"}</div>
          <div>{"  staff_id UUID REFERENCES staff(id),"}</div>
          <div>{"  slot_start TIMESTAMPTZ NOT NULL,"}</div>
          <div>{"  UNIQUE (staff_id, slot_start)"}</div>
          <div>{");"}</div>
          <div style={{marginTop:8, color:"#6B6B8A"}}>-- NestJS service icinde sorgu</div>
          <div>{"const res = await pool.query("}</div>
          <div>{"  'SELECT * FROM reservation WHERE staff_id=$1',"}</div>
          <div>{"  [staffId]"}</div>
          <div>{");"}</div>
        </div>
        <div style={{ fontSize: 12.5, color: "#9090B0", lineHeight: 1.7 }}>
          Slot race condition: Reservation tablosunda staff_id + slot_start uzerine UNIQUE constraint var. Redis ile 5 saniyelik distributed lock ekle — ayni anda iki kullanici ayni slota girisiminde biri aninda reddedilir.
        </div>
      </Card>
    </div>
  );
}

function Swagger() {
  const endpoints = [
    { group: "/auth", color: PURPLE, items: ["POST /register", "POST /login", "POST /refresh", "POST /logout"] },
    { group: "/salons", color: TEAL, items: ["GET /", "GET /:id", "POST / (owner)", "PATCH /:id (owner)", "DELETE /:id (owner)"] },
    { group: "/salons/:id/staff", color: CORAL, items: ["GET /", "POST / (owner)", "PATCH /:staffId (owner)", "DELETE /:staffId (owner)"] },
    { group: "/salons/:id/slots", color: AMBER, items: ["GET /?date=&staffId= — müsait slotlar"] },
    { group: "/reservations", color: GRAY, items: ["POST / (customer)", "GET /my (customer)", "GET /salon/:id (owner/receptionist)", "DELETE /:id (customer|owner)"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card accent={PURPLE}>
        <div style={{ fontSize: 12.5, color: "#B0B0C8", lineHeight: 1.7 }}>
          NestJS'te <span style={{ fontFamily: "monospace", color: "#C4B5FD" }}>@nestjs/swagger</span> kurulunca her controller/DTO üzerine dekoratör eklemek yeterli. Swagger UI otomatik <span style={{ fontFamily: "monospace", color: "#C4B5FD" }}>/api</span> adresinde açılır.
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {endpoints.map((e, i) => (
          <Card key={i} accent={e.color}>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: e.color, fontSize: 13, marginBottom: 8 }}>{e.group}</div>
            {e.items.map((item, j) => (
              <div key={j} style={{ fontFamily: "monospace", fontSize: 11.5, color: "#7070A0", marginBottom: 3 }}>{item}</div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Roadmap() {
  const weeks = [
    { label: "Gün 1–3", date: "1–3 Nisan", color: PURPLE, tasks: ["Backend seç ve kur (NestJS)", "Prisma şeması + migration", "Auth modülü (register/login/JWT)", "Swagger'ı baştan ayarla", "EmailJS hesabı + şablonu hazırla"] },
    { label: "Gün 4–6", date: "4–6 Nisan", color: CORAL, tasks: ["Salon CRUD endpoint'leri", "Staff CRUD + rol yönetimi", "Slot üretim mantığı", "Rezervasyon CRUD + çakışma kontrolü", "Redis slot kilitleme"] },
    { label: "Gün 7–10", date: "7–10 Nisan", color: TEAL, tasks: ["React + Vite + Tailwind kur", "Landing page + EmailJS kayıt formu", "Kuaför listesi sayfası (/kuaforler)", "Auth ekranları (giriş/kayıt)"] },
    { label: "Gün 11–13", date: "11–13 Nisan", color: TEAL, tasks: ["3 adımlı randevu wizard", "Kuaför sahibi admin paneli", "Personel yönetimi ekranı", "Rol bazlı görünüm (berber/resepsiyonist)"] },
    { label: "Buffer", date: "14–15 Nisan", color: AMBER, tasks: ["E2E test — tam randevu akışı", "Responsive düzeltmeler", "Vercel + Railway deploy", "Swagger son kontrol"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {weeks.map((w, i) => (
        <Card key={i} accent={w.color}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Tag text={w.label} color={w.color} />
            <span style={{ fontSize: 12, color: "#6B6B8A" }}>{w.date}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {w.tasks.map((t, j) => (
              <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: w.color, marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: "#B0B0C8" }}>{t}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Risks() {
  const risks = [
    { risk: "Slot Race Condition", detail: "2 kullanıcı aynı anda aynı slota reserve", solution: "Redis distributed lock + DB unique constraint", level: "high" },
    { risk: "Zaman Darlığı", detail: "15 Nisan çok yakın, 5 sayfa + backend", solution: "Admin istatistik & bildirimler MVP dışı bırak", level: "high" },
    { risk: "EmailJS rate limit", detail: "Ücretsiz 200 e-posta/ay sınırı", solution: "Yeterli, gerekirse Resend'e geçiş kolay", level: "low" },
    { risk: "Rol güvenliği", detail: "Frontend'de rol hide etmek yetmez", solution: "Her backend endpoint'te Guard + rol kontrolü", level: "high" },
    { risk: "Wizard state kaybı", detail: "Sayfa yenilenince seçimler sıfırlanır", solution: "Zustand persist + URL parametresi kombinasyonu", level: "med" },
    { risk: "Wizard adım atlama", detail: "Kullanıcı URL'yi değiştirerek adım atlayabilir", solution: "Her adımda önceki state kontrolü yap, yoksa step 1'e yönlendir", level: "med" },
  ];
  const colors = { high: CORAL, med: AMBER, low: TEAL };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {risks.map((r, i) => (
        <Card key={i} accent={colors[r.level]}>
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr 50px", gap: 12, alignItems: "center" }}>
            <div style={{ fontWeight: 700, color: "#E8E8F0", fontSize: 13 }}>{r.risk}</div>
            <div style={{ fontSize: 12, color: "#7070A0" }}>{r.detail}</div>
            <div style={{ fontSize: 12, color: "#B0B0C8" }}>✅ {r.solution}</div>
            <Tag text={r.level.toUpperCase()} color={colors[r.level]} />
          </div>
        </Card>
      ))}
    </div>
  );
}

const contentMap = { pages: Pages, tech: Tech, roles: Roles, wizard: Wizard, emailjs: EmailJS, db: DB, swagger: Swagger, roadmap: Roadmap, risks: Risks };

export default function BarberReport() {
  const [active, setActive] = useState("pages");
  const sec = sections.find((s) => s.id === active);
  const Content = contentMap[sec.content.type];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", background: "#0E0E14", minHeight: "100vh", color: "#E8E8F0", display: "flex" }}>
      <div style={{ width: 220, background: "#13131C", borderRight: "1px solid #1E1E2E", padding: "20px 0", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 18px 18px", borderBottom: "1px solid #1E1E2E" }}>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, color: "#fff" }}>✂️ Barber App</div>
          <div style={{ fontSize: 10, color: "#6B6B8A", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2 }}>Ön Hazırlık v3</div>
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#61DAFB", background: "#61DAFB18", padding: "2px 8px", borderRadius: 20, border: "1px solid #61DAFB30", fontWeight: 600 }}>Web</span>
            <span style={{ fontSize: 10, color: TEAL, background: TEAL + "18", padding: "2px 8px", borderRadius: 20, border: `1px solid ${TEAL}30`, fontWeight: 600 }}>React</span>
          </div>
        </div>
        <div style={{ paddingTop: 8, flex: 1 }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              width: "100%", textAlign: "left", padding: "9px 18px", border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 500,
              background: active === s.id ? "#1E1E30" : "transparent",
              color: active === s.id ? "#A78BFA" : "#7070A0",
              borderLeft: active === s.id ? "2px solid #A78BFA" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ marginRight: 7 }}>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "14px 18px", borderTop: "1px solid #1E1E2E" }}>
          <div style={{ fontSize: 10, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: 1 }}>Deadline</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: AMBER, marginTop: 2 }}>15 Nisan</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "26px 30px", overflowY: "auto", maxHeight: "100vh" }}>
        <div style={{ fontSize: 19, fontWeight: 800, marginBottom: 4, color: "#fff" }}>{sec.icon} {sec.label}</div>
        <div style={{ width: 34, height: 3, background: "#A78BFA", borderRadius: 2, marginBottom: 22 }} />
        <Content />
      </div>
    </div>
  );
}
