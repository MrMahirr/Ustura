import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { getLandingLayout } from '@/components/landing/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { downloadLegalPdf } from '@/utils/legal-pdf';

type LegalParagraph = {
  title: string;
  content: string;
};

interface LegalDocumentPageProps {
  title: string;
  date: string;
  fileName: string;
  paragraphs: LegalParagraph[];
}

export default function LegalDocumentPage({ title, date, fileName, paragraphs }: LegalDocumentPageProps) {
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
          title,
          date,
          fileName,
          paragraphs,
        });
      } else {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${title}</title>
              <style>
                body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                h1 { color: #C9A84C; font-size: 28px; border-bottom: 2px solid #C9A84C; padding-bottom: 10px; margin-bottom: 5px; }
                .date { color: #888; font-size: 14px; margin-bottom: 40px; }
                h2 { color: #222; font-size: 18px; margin-top: 30px; }
                p { font-size: 14px; text-align: justify; }
              </style>
            </head>
            <body>
              <h1>${title}</h1>
              <div class="date">${date}</div>
              ${paragraphs
                .map(
                  (paragraph) => `
                <h2>${paragraph.title}</h2>
                <p>${paragraph.content}</p>
              `,
                )
                .join('')}
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          base64: false,
        });

        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'PDF indir',
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.error(error);
      alert('PDF olusturulurken bir hata olustu.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <Navbar />
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: surface }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 120 }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-20 w-full max-w-[960px] self-center px-6">
          <View
            className="rounded-2xl"
            style={[
              {
                backgroundColor: surfaceContainerLow,
                padding: layout.isTablet ? 64 : 32,
              },
              Platform.OS === 'web'
                ? ({ boxShadow: '0 10px 40px rgba(0,0,0,0.2)' } as any)
                : {
                    shadowColor: '#000000',
                    shadowOpacity: 0.18,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 8,
                  },
            ]}>
            <View className="mb-8 flex-row flex-wrap items-start justify-between gap-6 border-b pb-8" style={{ borderBottomColor: primary }}>
              <View>
                <Text className="mb-2 font-body text-[32px] font-bold" style={{ color: onSurface }}>
                  {title}
                </Text>
                <Text className="font-label text-base uppercase tracking-[1.5px]" style={{ color: onSurfaceVariant }}>
                  {date}
                </Text>
              </View>

              <Pressable
                className="bg-[rgba(201,168,76,0.1)] px-5 py-3"
                disabled={isGeneratingPdf}
                onPress={handleDownloadPdf}
                style={isGeneratingPdf ? { opacity: 0.6 } : undefined}>
                <View className="flex-row items-center gap-2">
                  {isGeneratingPdf ? (
                    <ActivityIndicator size="small" color={primary} />
                  ) : (
                    <MaterialIcons name="picture-as-pdf" size={20} color={primary} />
                  )}
                  <Text className="font-label text-sm uppercase tracking-[1px]" style={{ color: primary, fontFamily: 'Manrope-Bold' }}>
                    {isGeneratingPdf ? 'HAZIRLANIYOR...' : 'PDF INDIR'}
                  </Text>
                </View>
              </Pressable>
            </View>

            <View className="gap-6">
              {paragraphs.map((paragraph) => (
                <View key={paragraph.title} className="gap-2">
                  <Text className="font-body text-xl font-bold" style={{ color: onSurface }}>
                    {paragraph.title}
                  </Text>
                  <Text className="font-body text-lg" style={{ color: onSurfaceVariant, lineHeight: 28 }}>
                    {paragraph.content}
                  </Text>
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
