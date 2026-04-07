import React from 'react';

import LegalDocumentPage from '@/components/landing/LegalDocumentPage';

const DOC_TITLE = 'GIZLILIK POLITIKASI';
const DOC_DATE = 'Son Guncelleme: 4 Nisan 2026';
const DOC_PARAGRAPHS = [
  {
    title: '1. Veri Toplama',
    content:
      "Ustura platformunu ('Platform') kullandiginizda ad, soyad, telefon numarasi, e-posta adresi gibi kisisel verileriniz ile hizmet tercihlerinize iliskin bilgileri topluyoruz. Bu veriler, sadece sizlere en iyi hizmeti sunabilmek amaciyla islenmektedir.",
  },
  {
    title: '2. Verilerin Kullanimi',
    content:
      'Toplanan verileriniz; randevu olusturma sureclerinin yonetimi, dijital onaylarin alinmasi, sistem uzerinden size hatirlatma SMS veya e-postasi gonderilmesi ve musteri deneyiminin iyilestirilmesi gibi mesru is amaclarina yonelik kullanilir.',
  },
  {
    title: '3. Ucuncu Taraflarla Paylasim',
    content:
      'Kisisel verileriniz, yasal zorunluluklar haricinde ucuncu sahislara satilmaz veya kiralanmaz. Yalnizca randevu aldiginiz salon ve hizmetin ifasi icin gerekli is ortaklari ile paylasilabilir.',
  },
  {
    title: '4. Veri Guvenligi',
    content:
      'Verilerinizin guvenligini saglamak icin endustri standardi sifreleme ve guvenlik protokolleri kullanilmaktadir. Hesabiniza izinsiz erisimi onlemek icin parolanizi guvenli tutmak kismen sizin de sorumlulugunuzdadir.',
  },
  {
    title: '5. Kullanici Haklari',
    content:
      "KVKK'nin 11. maddesi kapsaminda verilerinizin islenip islenmedigini ogrenme, silinmesini veya duzeltilmesini talep etme haklariniz bulunmaktadir. Talepleriniz icin iletisim adresimiz uzerinden bize ulasabilirsiniz.",
  },
  {
    title: '6. Cerezler',
    content:
      'Platform deneyiminizi kisisellestirmek ve gelistirmek amaciyla cihazinizda kucuk metin dosyalari saklanabilir. Tarayicinizin ayarlarindan bu cerezleri dilediginiz zaman yonetebilirsiniz.',
  },
];

export default function GizlilikPolitikasiPage() {
  return (
    <LegalDocumentPage
      title={DOC_TITLE}
      date={DOC_DATE}
      fileName="ustura-gizlilik-politikasi.pdf"
      paragraphs={DOC_PARAGRAPHS}
    />
  );
}
