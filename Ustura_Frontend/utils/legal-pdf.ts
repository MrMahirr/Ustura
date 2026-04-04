export interface LegalPdfParagraph {
  title: string;
  content: string;
}

interface DownloadLegalPdfOptions {
  title: string;
  date: string;
  fileName: string;
  paragraphs: LegalPdfParagraph[];
}

export async function downloadLegalPdf({
  title,
  date,
  fileName,
  paragraphs,
}: DownloadLegalPdfOptions) {
  const { jsPDF } = await import('jspdf/dist/jspdf.es.min.js');
  const doc = new jsPDF();

  const margin = 20;
  const maxWidth = 170;
  const pageBottom = 280;
  let y = 20;

  doc.setFontSize(22);
  doc.text(title, margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(date, margin, y);
  y += 15;

  doc.setTextColor(0);

  paragraphs.forEach((paragraph) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text(paragraph.title, margin, y);
    y += 8;

    doc.setFontSize(11);
    const lines = doc.splitTextToSize(paragraph.content, maxWidth);

    if (y + lines.length * 6 > pageBottom) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, margin, y);
    y += lines.length * 5.5 + 12;
  });

  doc.save(fileName);
}
