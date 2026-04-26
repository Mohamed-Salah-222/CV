import React from "react";
import type { templateTypes } from "@cv/types";
import { TextField, RepeatCard } from "../fields/BasicFields";
import { RichTextField } from "../fields/RichTextField";
import styles from "../CVBuilder.module.css";

type CVData = templateTypes.CVData;

interface ExperienceFormProps {
  data: CVData["experience"];
  onChange: (d: CVData["experience"]) => void;
  onImprove: (fieldType: string, text: string) => void;
  improveLoading: boolean;
}

export function ExperienceForm({ data, onChange, onImprove, improveLoading }: ExperienceFormProps) {
  const upd = (i: number, k: keyof CVData["experience"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));

  const addItem = () => onChange([...data, { company: "", role: "", duration: "", description: "" }]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((entry, i) => (
        <RepeatCard
          key={i}
          title={entry.company || `Position ${i + 1}`}
          canRemove={data.length > 0} // Allow removing all if desired
          onRemove={() => onChange(data.filter((_, idx) => idx !== i))}
        >
          <TextField label="Company" value={entry.company} onChange={(v) => upd(i, "company", v)} placeholder="Acme Corp" />
          <TextField label="Role" value={entry.role} onChange={(v) => upd(i, "role", v)} placeholder="Senior Engineer" />
          <TextField label="Duration" value={entry.duration} onChange={(v) => upd(i, "duration", v)} placeholder="Jan 2022 – Present" />
          <RichTextField 
            label="Description" 
            value={entry.description} 
            onChange={(v) => upd(i, "description", v)} 
            placeholder="Key responsibilities and achievements..."
            onImprove={(text) => onImprove(`experience.${i}`, text)}
            improveLoading={improveLoading}
          />
        </RepeatCard>
      ))}
      <button className={styles.addBtn} onClick={addItem} style={{ padding: "12px", borderStyle: "dashed", background: "none", color: "var(--text-muted)", cursor: "pointer", borderRadius: "var(--radius-md)", border: "1px dashed var(--border)" }}>
        + Add Experience
      </button>
    </div>
  );
}
