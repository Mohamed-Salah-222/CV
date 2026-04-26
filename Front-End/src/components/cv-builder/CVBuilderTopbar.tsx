import React from "react";
import styles from "./CVBuilder.module.css";
import { templates } from "@/components/templates";

interface TopbarProps {
  onAIGenerate: () => void;
  onExport: () => void;
  onSave: () => void;
  onSelectTemplate: () => void;
  templateId: string;
  isGenerating: boolean;
  exporting: boolean;
  saving: boolean;
  currentCVId: string | null;
}

export function CVBuilderTopbar({
  onAIGenerate,
  onExport,
  onSave,
  onSelectTemplate,
  templateId,
  isGenerating,
  exporting,
  saving,
  currentCVId,
}: TopbarProps) {
  const currentTemplate = templates.find((t) => t.id === templateId);

  return (
    <header className={styles.topbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>CV Builder</span>
        <span style={{ fontSize: 11, background: "var(--accent-soft)", color: "var(--accent)", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
          Live Preview
        </span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className={styles.navItem} style={{ width: "auto", border: "1px solid var(--border)" }} onClick={onAIGenerate} disabled={isGenerating}>
          {isGenerating ? "..." : "✨ Generate with AI"}
        </button>
        
        <button className={styles.navItem} style={{ width: "auto", border: "1px solid var(--border)" }} onClick={onSelectTemplate}>
          Template: {currentTemplate?.name || "Modern"}
        </button>

        <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 4px" }} />

        <button 
          className={styles.navItem} 
          style={{ width: "auto", border: "1px solid var(--border)" }} 
          onClick={onExport} 
          disabled={exporting}
        >
          {exporting ? "Exporting..." : "Export PDF"}
        </button>

        <button 
          className={styles.navItem} 
          style={{ width: "auto", background: "var(--text-main)", color: "#fff" }} 
          onClick={onSave} 
          disabled={saving}
        >
          {saving ? "Saving..." : currentCVId ? "Save Changes" : "Create CV"}
        </button>
      </div>
    </header>
  );
}
