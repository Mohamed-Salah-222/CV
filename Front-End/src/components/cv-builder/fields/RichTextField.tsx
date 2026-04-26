import React, { useState, useRef, useEffect } from "react";
import styles from "../CVBuilder.module.css";

const FONT_SIZES = [11, 12, 13, 14, 16, 18, 20, 24];

interface RichFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  onImprove?: (text: string) => void;
  improveLoading?: boolean;
}

export function RichTextField({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 100,
  onImprove,
  improveLoading,
}: RichFieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [fmt, setFmt] = useState({ bold: false, italic: false, underline: false });
  const lastHtml = useRef(value);

  useEffect(() => {
    if (editorRef.current && value !== lastHtml.current) {
      editorRef.current.innerHTML = value;
      lastHtml.current = value;
    }
  }, [value]);

  const emit = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastHtml.current = html;
    onChange(html);
  };

  const refreshFmt = () =>
    setFmt({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    emit();
    refreshFmt();
  };

  const applyFontSize = (size: number) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;
    try {
      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      range.surroundContents(span);
      sel.removeAllRanges();
    } catch {
      // ignore
    }
    emit();
  };

  const isEmpty = !value || value === "<br>" || value === "" || value === "<div><br></div>";

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>

      <div className={styles.richToolbar}>
        {(["bold", "italic", "underline"] as const).map((cmd) => (
          <button
            key={cmd}
            className={`${styles.toolBtn} ${fmt[cmd] ? styles.toolBtnActive : ""}`}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd);
            }}
            title={cmd.charAt(0).toUpperCase() + cmd.slice(1)}
            aria-label={cmd}
          >
            {cmd === "bold" ? "B" : cmd === "italic" ? "I" : "U"}
          </button>
        ))}

        <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 4px" }} />

        <select
          className={styles.toolSelect}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) applyFontSize(Number(e.target.value));
            e.target.value = "";
          }}
          title="Font Size"
        >
          <option value="" disabled>Size</option>
          {FONT_SIZES.map((sz) => <option key={sz} value={sz}>{sz}px</option>)}
        </select>

        <div style={{ width: 1, height: 16, background: "var(--border)", margin: "0 4px" }} />

        <button 
          className={styles.toolBtn} 
          onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}
          title="Bullet List"
        >
          • List
        </button>
        
        {onImprove && (
          <button
            className={styles.improveBtnPremium}
            onClick={() => onImprove(editorRef.current?.innerHTML || "")}
            disabled={improveLoading}
            style={{ marginLeft: "auto" }}
            title="Improve this section with AI"
          >
            {improveLoading ? "..." : "✨ Improve"}
          </button>
        )}
      </div>

      <div style={{ position: "relative" }}>
        {isEmpty && !focused && (
          <div style={{ position: "absolute", top: 12, left: 12, color: "var(--text-faint)", pointerEvents: "none", fontSize: 14 }}>
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={styles.richEditor}
          style={{ minHeight }}
          onFocus={() => { setFocused(true); refreshFmt(); }}
          onBlur={() => { setFocused(false); emit(); }}
          onInput={emit}
          onKeyUp={refreshFmt}
          onMouseUp={refreshFmt}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
          }}
        />
      </div>
    </div>
  );
}
