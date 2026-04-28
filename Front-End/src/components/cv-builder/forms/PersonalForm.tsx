import React from "react";
import type { templateTypes } from "@cv/types";
import { TextField } from "../fields/BasicFields";
import { RichTextField } from "../fields/RichTextField";

type CVData = templateTypes.CVData;

interface PersonalFormProps {
  data: CVData["personal"];
  onChange: (d: CVData["personal"]) => void;
  onImprove: (fieldType: string, text: string) => void;
  improveLoading: boolean;
  ghostTextSuggestions?: any;
}

export function PersonalForm({ data, onChange, onImprove, improveLoading, ghostTextSuggestions }: PersonalFormProps) {
  const set = (k: keyof CVData["personal"]) => (v: string) => onChange({ ...data, [k]: v });
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <TextField label="Full name" value={data.fullName} onChange={set("fullName")} placeholder="Jane Smith" />
      <TextField label="Email" value={data.email} onChange={set("email")} placeholder="jane@example.com" />
      <TextField label="Phone" value={data.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
      <TextField label="Location" value={data.location} onChange={set("location")} placeholder="New York, NY" />
      <RichTextField 
        label="Professional Summary" 
        value={data.summary} 
        onChange={set("summary")} 
        placeholder="Brief professional summary..."
        onImprove={(text) => onImprove("personal.summary", text)}
        improveLoading={improveLoading}
        ghostTextSuggestions={ghostTextSuggestions}
      />
    </div>
  );
}
