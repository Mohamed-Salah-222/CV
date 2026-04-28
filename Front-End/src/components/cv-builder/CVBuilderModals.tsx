import React, { useState } from "react";
import styles from "./CVBuilder.module.css";
import { templates } from "@/components/templates";
import { fetchGitHubData } from "@/lib/github";

// ── AI Generate Modal ──
interface AIGenerateModalProps {
  onClose: () => void;
  onGenerate: (text: string) => Promise<void>;
  onParse: (text: string) => Promise<void>;
  isGenerating: boolean;
}

export function AIGenerateModal({ onClose, onGenerate, onParse, isGenerating }: AIGenerateModalProps) {
  const [modalText, setModalText] = useState("");
  const [modalGithub, setModalGithub] = useState("");
  const [improveWithAI, setImproveWithAI] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const rawText = modalText.trim() || modalGithub.trim();
    if (!rawText) {
      setError("Please enter some text or a GitHub URL.");
      return;
    }

    setError(null);
    try {
      let dataToUse: string;
      if (modalGithub.trim()) {
        dataToUse = await fetchGitHubData(modalGithub.trim());
      } else {
        dataToUse = rawText;
      }

      if (improveWithAI) {
        await onGenerate(dataToUse);
      } else {
        await onParse(dataToUse);
      }
      onClose();
    } catch (e: any) {
      setError(e.message || improveWithAI ? "Failed to generate CV" : "Failed to parse CV");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 500, overflow: "hidden" }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Generate with AI</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          <textarea
            className={styles.input}
            style={{ width: "100%", minHeight: 150, marginBottom: 16, resize: "vertical" }}
            placeholder="Paste your resume text or describe your career..."
            value={modalText}
            onChange={(e) => setModalText(e.target.value)}
          />
          <input
            className={styles.input}
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Or GitHub username (e.g. torvalds)"
            value={modalGithub}
            onChange={(e) => setModalGithub(e.target.value)}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, padding: "12px 16px", background: "#f9fafb", borderRadius: 8 }}>
            <div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Improve with AI</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{improveWithAI ? "AI will enhance your content" : "Only parse data, no changes"}</p>
            </div>
            <button
              type="button"
              onClick={() => setImproveWithAI(!improveWithAI)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: improveWithAI ? "var(--accent)" : "#d1d5db",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s"
              }}
            >
              <span style={{
                position: "absolute",
                top: 2,
                left: improveWithAI ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
              }} />
            </button>
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 16 }}>{error}</p>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button className={styles.navItem} style={{ width: "auto" }} onClick={onClose}>Cancel</button>
            <button className={styles.navItem} style={{ width: "auto", background: "var(--text-main)", color: "#fff" }} onClick={handleSubmit} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Template Selector Modal ──
interface TemplateSelectorProps {
  onClose: () => void;
  onSelect: (id: string) => void;
  selectedId: string;
}

export function TemplateSelectorModal({ onClose, onSelect, selectedId }: TemplateSelectorProps) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 600 }}>
        <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Choose a Template</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => { onSelect(t.id); onClose(); }}
              style={{
                cursor: "pointer",
                border: `2px solid ${selectedId === t.id ? "var(--accent)" : "transparent"}`,
                borderRadius: 10,
                padding: 8,
                transition: "all 0.2s"
              }}
            >
              <div style={{ aspectRatio: "3/4", background: "#f5f5f5", borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
                <img src={t.thumbnail} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, textAlign: "center" }}>{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
