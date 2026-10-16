"use client";

import { buttonStyles } from "@/components/ui";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonStyles.primary} data-umami-event="resume-print">
      Print / save as PDF
    </button>
  );
}
