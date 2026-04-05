import React from 'react';

import LegalDocumentPage from '@/components/landing/LegalDocumentPage';

const DOC_TITLE = 'KULLANIM KOSULLARI';
const DOC_DATE = 'Son Guncelleme: 4 Nisan 2026';
const DOC_PARAGRAPHS = [
  {
    title: '1. Taraflar',
    content:
      "Isbu sozlesme, Ustura ile Platform'u kullanan uyeler ve ziyaretciler arasinda akdedilmistir. Platformu kullanarak bu sartlari kabul etmis sayilirsiniz.",
  },
  {
    title: '2. Hizmetlerin Kapsami',
    content:
      'Platform, berber ve kuafor hizmetleri sunan salonlar ile bu hizmetlerden faydalanmak isteyen musterileri dijital ortamda bir araya getiren bir rezervasyon ve yonetim platformudur.',
  },
  {
    title: '3. Kullanici Yukumlulukleri',
    content:
      'Kullanici, randevu alirken verdigi bilgilerin dogrulugunu taahhut eder. Randevulara zamaninda gidilmesi esastir. Gecerli bir mazeret bildirmeden art arda uc kez randevusuna gitmeyen kullanicinin hesabi gecici olarak askiya alinabilir.',
  },
  {
    title: '4. Gizlilik ve Kisisel Veriler',
    content:
      "Platform, kullanici verilerini 6698 sayili Kisisel Verilerin Korunmasi Kanunu uyarinca isler ve saklar. Ayrintili bilgi 'Gizlilik Politikasi' metninde yer almaktadir.",
  },
  {
    title: '5. Iptal ve Iade',
    content:
      'Kullanicilar randevularini, randevu saatinden en az 2 saat onceye kadar kesintisiz iptal edebilir. Daha gec yapilan iptallerde ilgili salonun kendi inisiyatifinde cezai sartlar uygulanabilir.',
  },
  {
    title: '6. Degisiklikler',
    content:
      'Platform yonetimi, isbu Kullanim Kosullari metnini onceden haber vermeksizin tek tarafli olarak degistirme hakkini sakli tutar. Guncel kosullar sitede yayinlandigi andan itibaren gecerli olur.',
  },
];

export default function KullanimKosullariPage() {
  return (
    <LegalDocumentPage
      title={DOC_TITLE}
      date={DOC_DATE}
      fileName="ustura-kullanim-kosullari.pdf"
      paragraphs={DOC_PARAGRAPHS}
    />
  );
}
