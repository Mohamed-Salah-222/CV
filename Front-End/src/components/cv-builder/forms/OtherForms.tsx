import React from "react";
import type { templateTypes } from "@cv/types";
import { TextField, RepeatCard } from "../fields/BasicFields";
import { RichTextField } from "../fields/RichTextField";
import styles from "../CVBuilder.module.css";

type CVData = templateTypes.CVData;

// ── Education Form ──
export function EducationForm({ data, onChange }: { data: CVData["education"]; onChange: (d: CVData["education"]) => void }) {
  const upd = (i: number, k: keyof CVData["education"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((entry, i) => (
        <RepeatCard key={i} title={entry.school || `Education ${i + 1}`} canRemove={true} onRemove={() => onChange(data.filter((_, idx) => idx !== i))}>
          <TextField label="School" value={entry.school} onChange={(v) => upd(i, "school", v)} placeholder="University Name" />
          <TextField label="Degree" value={entry.degree} onChange={(v) => upd(i, "degree", v)} placeholder="B.S. Computer Science" />
          <TextField label="Duration" value={entry.duration} onChange={(v) => upd(i, "duration", v)} placeholder="2018 - 2022" />
        </RepeatCard>
      ))}
      <button className={styles.addBtn} onClick={() => onChange([...data, { school: "", degree: "", duration: "" }])}>+ Add Education</button>
    </div>
  );
}

// ── Projects Form ──
export function ProjectsForm({ 
  data, 
  onChange, 
  onImprove, 
  improveLoading,
  ghostTextSuggestions 
}: { 
  data: CVData["projects"]; 
  onChange: (d: CVData["projects"]) => void; 
  onImprove: (ft: string, t: string) => void; 
  improveLoading: boolean;
  ghostTextSuggestions?: any;
}) {
  const upd = (i: number, k: keyof CVData["projects"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((entry, i) => (
        <RepeatCard key={i} title={entry.name || `Project ${i + 1}`} canRemove={true} onRemove={() => onChange(data.filter((_, idx) => idx !== i))}>
          <TextField label="Project Name" value={entry.name} onChange={(v) => upd(i, "name", v)} placeholder="My Portfolio" />
          <RichTextField 
            label="Description" 
            value={entry.description} 
            onChange={(v) => upd(i, "description", v)} 
            onImprove={(text) => onImprove(`projects.${i}`, text)} 
            improveLoading={improveLoading} 
            ghostTextSuggestions={ghostTextSuggestions}
          />
          <TextField label="Link Label" value={entry.label} onChange={(v) => upd(i, "label", v)} placeholder="GitHub" />
          <TextField label="URL" value={entry.link} onChange={(v) => upd(i, "link", v)} placeholder="https://..." />
        </RepeatCard>
      ))}
      <button className={styles.addBtn} onClick={() => onChange([...data, { name: "", description: "", link: "", label: "" }])}>+ Add Project</button>
    </div>
  );
}

// ── Links Form ──
export function LinksForm({ data, onChange }: { data: CVData["header"]["links"]; onChange: (d: CVData["header"]["links"]) => void }) {
  const upd = (i: number, k: keyof CVData["header"]["links"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((entry, i) => (
        <RepeatCard key={i} title={entry.label || `Link ${i + 1}`} canRemove={true} onRemove={() => onChange(data.filter((_, idx) => idx !== i))}>
          <TextField label="Label" value={entry.label} onChange={(v) => upd(i, "label", v)} placeholder="LinkedIn" />
          <TextField label="URL" value={entry.url} onChange={(v) => upd(i, "url", v)} placeholder="https://..." />
        </RepeatCard>
      ))}
      <button className={styles.addBtn} onClick={() => onChange([...data, { label: "", url: "" }])}>+ Add Link</button>
    </div>
  );
}
