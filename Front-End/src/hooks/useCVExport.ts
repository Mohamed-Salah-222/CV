import { useCallback, type RefObject } from "react";

export function useCVExport() {
  const exportToPDF = useCallback(
    async (cvRef: RefObject<HTMLDivElement | null>, _fileName?: string) => {
      const el = cvRef.current;
      if (!el) return;

      // Open a blank window
      const printWindow = window.open("", "_blank", "width=794,height=1123");
      if (!printWindow) {
        alert("Please allow popups to export your CV.");
        return;
      }

      // Clone the CV content (inline styles travel with the clone)
      const clone = el.cloneNode(true) as HTMLElement;

      // Write a minimal HTML document containing only the CV
      printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CV Export</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      background: #fff;
      font-family: 'Inter', 'DM Sans', system-ui, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      overflow: hidden; /* Prevent extra pages */
    }

    @page {
      size: A4;
      margin: 0;
    }

    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
      }
    }

    /* Make sure list items render properly */
    ul { padding-left: 18px; }
    li { margin-bottom: 2px; }
    a { color: inherit; }
  </style>
</head>
<body></body>
</html>`);

      printWindow.document.close();
      
      // Wrap clone in a scaler div
      const container = printWindow.document.createElement("div");
      container.id = "scaler-container";
      container.appendChild(clone);
      printWindow.document.body.appendChild(container);

      // Scaling Logic
      const scaleToFit = () => {
        const content = clone;
        const targetHeight = 1120; // A4 height in pixels approx
        const currentHeight = content.offsetHeight;

        if (currentHeight > targetHeight) {
          const ratio = targetHeight / currentHeight;
          // Apply scaling to the clone
          content.style.transform = `scale(${ratio})`;
          content.style.transformOrigin = "top center";
          // Ensure container height doesn't cause a second page
          container.style.height = "297mm";
          container.style.overflow = "hidden";
        }
      };

      // Wait for images and fonts then scale and print
      printWindow.onload = () => {
        scaleToFit();
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 500);
      };

      // Fallback
      setTimeout(() => {
        if (!printWindow.closed) {
          scaleToFit();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }, 1500);
    },
    []
  );

  return { exportToPDF };
}