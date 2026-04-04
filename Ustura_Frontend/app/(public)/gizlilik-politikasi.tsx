import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Platform, useWindowDimensions, ActivityIndicator, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLandingLayout } from '@/components/landing/layout';
import { Typography } from '@/constants/typography';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { downloadLegalPdf } from '@/utils/legal-pdf';

// Document content variables
const DOC_TITLE = "GIZLILIK POLITIKASI"; // Angilized for basic pdf font support
const DOC_DATE = "Son Guncelleme: 4 Nisan 2026";
const DOC_PARAGRAPHS = [
  { title: "1. Veri Toplama", content: "Ustura platformunu ('Platform') kullandiginizda ad, soyad, telefon numarasi, e-posta adresi gibi kisisel verileriniz ile hizmet tercihlerinize iliskin bilgileri topluyoruz. Bu veriler, sadece sizlere en iyi hizmeti sunabilmek amaciyla islenmektedir." },
  { title: "2. Verilerin Kullanimi", content: "Toplanan verileriniz; randevu olusturma sureclerinin yonetimi, islak imza gerekmeksizin dijital onaylarin alinmasi, sistem uzerinden size hatirlatma sms/epostasi gonderilmesi ve musteri deneyiminin iyilestirilmesi gibi mesru is amaclarina yonelik kullanilir." },
  { title: "3. Uçüncü Taraflarla Paylasim", content: "Kisisel verileriniz, yasal zorunluluklar haricinde ucuuncu sahislara satilmaz veya kiralanmaz. Yalnizca randevu aldiginiz Berber/Kuafor salonu (hizmetin ifasi geregi) ve sms saglayici is ortaklarimiz ile paylasilabilir." },
  { title: "4. Veri Guvenligi", content: "Verilerinizin guvenligini saglamak icin endustri standardi sifreleme ve guvenlik protokolleri kullanilmaktadir. Hesabiniza izinsiz erisimi onlemek icin parolanizi guvenli tutmak kismen sizin de sorumlulugunuzdadir." },
  { title: "5. Kullanici Haklari", content: "KVKK'nin 11. Maddesi kapsaminda verilerinizin islenip islenmedigini ogrenme, silinmesini veya duzeltilmesini talep etme haklariniz bulunmaktadir. Talepleriniz icin iletisim adresimiz uzerinden bize ulasabilirsiniz." },
  { title: "6. Çerezler (Cookies)", content: "Platform deneyiminizi kisisellestirmek ve gelistirmek amaciyla cihazinizda kucuk metin dosyalari (cerezler) saklanabilir. Tarayicinizin ayarlarindan bu cerezleri dilediginiz zaman yonetebilirsiniz." }
];

export default function GizlilikPolitikasiPage() {
  const surface = useThemeColor({}, 'surface');
  const surfaceContainerLow = useThemeColor({}, 'surfaceContainerLow');
  const onSurface = useThemeColor({}, 'onSurface');
  const onSurfaceVariant = useThemeColor({}, 'onSurfaceVariant');
  const primary = useThemeColor({}, 'primary');

  const { width } = useWindowDimensions();
  const layout = getLandingLayout(width);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);

      if (Platform.OS === 'web') {
        await downloadLegalPdf({
          title: DOC_TITLE,
          date: DOC_DATE,
          fileName: 'ustura-gizlilik-politikasi.pdf',
          paragraphs: DOC_PARAGRAPHS,
        });
      } else {
        // Native printing logic
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${DOC_TITLE}</title>
              <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                h1 { color: #C9A84C; font-size: 28px; border-bottom: 2px solid #C9A84C; padding-bottom: 10px; margin-bottom: 5px; }
                .date { color: #888; font-size: 14px; margin-bottom: 40px; }
                h2 { color: #222; font-size: 18px; margin-top: 30px; }
                p { font-size: 14px; text-align: justify; }
              </style>
            </head>
            <body>
              <h1>${DOC_TITLE}</h1>
              <div class="date">${DOC_DATE}</div>
              ${DOC_PARAGRAPHS.map(p => `
                <h2>${p.title}</h2>
                <p>${p.content}</p>
              `).join('')}
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          base64: false
        });
        
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Gizlilik Politikasını İndir',
          UTI: 'com.adobe.pdf'
        });
      }
    } catch (error) {
      console.error(error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <Navbar />
      <ScrollView
        style={[styles.container, { backgroundColor: surface }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainWrapper}>
          <View style={[styles.contentBlock, { backgroundColor: surfaceContainerLow, padding: layout.isTablet ? 64 : 32 }]}>
            
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: primary }]}>
              <View>
                <Text style={[styles.title, { color: onSurface }]}>{DOC_TITLE}</Text>
                <Text style={[styles.date, { color: onSurfaceVariant }]}>{DOC_DATE}</Text>
              </View>

              <Pressable 
                onPress={handleDownloadPdf}
                disabled={isGeneratingPdf}
                style={[styles.downloadBtn, isGeneratingPdf && { opacity: 0.6 }]}
              >
                <View style={styles.btnInner}>
                  {isGeneratingPdf ? (
                    <ActivityIndicator size="small" color={primary} />
                  ) : (
                    <MaterialIcons name="picture-as-pdf" size={20} color={primary} />
                  )}
                  <Text style={[styles.btnText, { color: primary }]}>
                    {isGeneratingPdf ? 'HAZIRLANIYOR...' : 'PDF İNDİR'}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Document Body */}
            <View style={styles.body}>
              {DOC_PARAGRAPHS.map((p, idx) => (
                <View key={idx} style={styles.paragraphBlock}>
                  <Text style={[styles.pTitle, { color: onSurface }]}>{p.title}</Text>
                  <Text style={[styles.pContent, { color: onSurfaceVariant }]}>{p.content}</Text>
                </View>
              ))}
            </View>
            
          </View>
        </View>
        
        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 120, // offset navbar
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    paddingHorizontal: 24,
    marginBottom: 80,
  },
  contentBlock: {
    borderRadius: 16,
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  } as any,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 24,
    borderBottomWidth: 1,
    paddingBottom: 32,
    marginBottom: 32,
  },
  title: {
    ...Typography.headlineLg,
    fontFamily: 'Manrope-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  date: {
    ...Typography.labelLg,
    letterSpacing: 1.5,
  },
  downloadBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: 'transparent',
    backgroundColor: 'rgba(201, 168, 76, 0.1)', // primary low opacity
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    ...Typography.labelMd,
    fontFamily: 'Manrope-Bold',
    letterSpacing: 1,
  },
  body: {
    gap: 24,
  },
  paragraphBlock: {
    gap: 8,
  },
  pTitle: {
    ...Typography.titleLg,
    fontFamily: 'Manrope-Bold',
  },
  pContent: {
    ...Typography.bodyLg,
    lineHeight: 28,
  },
});
