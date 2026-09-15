// src/utils/pdfExport.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

// មុខងារជំនួយសម្រាប់បង្កើត PDF ពី HTML Element
const generatePDFFromElement = async (elementId, fileName) => {
  const element = document.getElementById(elementId);

  if (!element) {
    alert('រកមិនឃើញផ្ទាំងសម្រាប់ Export ទេ!');
    return;
  }

  try {
    // បំលែង HTML ទៅជារូបភាពគុណភាពខ្ពស់
    const canvas = await html2canvas(element, {
      scale: 2, // ប្រើ 2 គឺគ្រប់គ្រាន់ ព្រោះយើងនឹងកំណត់ទំហំទំព័រតាមរូបភាព
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // គណនាទំហំទំព័រ PDF ឱ្យត្រូវនឹងរូបភាព
    // បំលែងពី px ទៅ mm (1px = 0.264583mm នៅ 96 DPI)
    const pxToMm = 0.264583;
    const imgWidthMm = canvas.width * pxToMm / 2; // ចែកនឹង 2 ព្រោះ scale=2
    const imgHeightMm = canvas.height * pxToMm / 2;

    // បង្កើត PDF ជាមួយទំហំត្រូវនឹងរូបភាព
    const pdf = new jsPDF({
      orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [imgWidthMm, imgHeightMm],
    });

    // បន្ថែមរូបភាពឱ្យពេញទំព័រ (គ្មានចន្លោះ)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm);

    pdf.save(fileName);
  } catch (error) {
    console.error('PDF Export Error:', error);
    alert('មានបញ្ហាក្នុងការបង្កើត PDF: ' + error.message);
  }
};

// Export បញ្ជីបេក្ខជន
export const exportCandidatesToPDF = async () => {
  await generatePDFFromElement(
    'candidates-print-area',
    `បញ្ជីបេក្ខជន_${Date.now()}.pdf`
  );
};

// Export បញ្ជីអ្នកបោះឆ្នោត
export const exportVotersToPDF = async () => {
  await generatePDFFromElement(
    'voters-print-area',
    `បញ្ជីអ្នកបោះឆ្នោត_${Date.now()}.pdf`
  );
};

// Export លទ្ធផលបោះឆ្នោត
export const exportResultsToPDF = async () => {
  await generatePDFFromElement(
    'results-print-area',
    `លទ្ធផលបោះឆ្នោត_${Date.now()}.pdf`
  );
};