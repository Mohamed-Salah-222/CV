import { useCallback, type RefObject } from "react";

export function useCVExport() {
  const exportToPDF = useCallback(async (cvRef: RefObject<HTMLDivElement | null>, fileName?: string) => {
    const el = cvRef.current;
    if (!el) return;

    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const prev = {
      borderRadius: el.style.borderRadius,
    };
    el.style.borderRadius = "0";

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    el.style.borderRadius = prev.borderRadius;

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const name = fileName || "CV.pdf";
    pdf.save(name);
  }, []);

  return { exportToPDF };
}