import React, { useState, useRef } from "react";
import styles from "../CVBuilder.module.css";
import { toast } from "sonner";

interface TagsInputProps {
  tags: string[];
  onChange: (t: string[]) => void;
  label?: string;
}

export function TagsInput({ tags, onChange, label = "Skills" }: TagsInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const val = raw.trim();
    if (!val) return;
    
    if (tags.includes(val)) {
      toast.warning("Skill already added");
      setInput("");
      return;
    }
    
    onChange([...tags, val]);
    setInput("");
  };

  const remove = (i: number) => onChange(tags.filter((_, idx) => idx !== i));

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <div 
        className={styles.tagsWrap} 
        style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8, border: "1px solid var(--border)", borderRadius: "var(--radius-md)", minHeight: 44, background: "#fff" }}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span 
            key={i} 
            style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--accent-soft)", color: "var(--accent)", padding: "4px 10px", borderRadius: 20, fontSize: 13, fontWeight: 500 }}
          >
            {tag}
            <button 
              onClick={(e) => { e.stopPropagation(); remove(i); }} 
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: 14, padding: 0 }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          style={{ border: "none", outline: "none", flex: 1, minWidth: 100, fontSize: 14 }}
          value={input}
          placeholder={tags.length === 0 ? "e.g. React, Python..." : ""}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(input);
            } else if (e.key === "Backspace" && !input && tags.length > 0) {
              remove(tags.length - 1);
            }
          }}
        />
      </div>
      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>Press Enter to add</p>
    </div>
  );
}
