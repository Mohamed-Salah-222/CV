import React from "react";
import styles from "../CVBuilder.module.css";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextField({ label, value, onChange, placeholder, type = "text" }: TextFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function RepeatCard({
  title,
  canRemove,
  onRemove,
  children,
}: {
  title: string;
  canRemove: boolean;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.repeatCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>{title}</span>
        {canRemove && (
          <button 
            onClick={onRemove}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 4 }}
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
