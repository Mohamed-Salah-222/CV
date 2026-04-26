type itemFields = Record<string, { type: "text" | "textarea"; label: string }>;
type fields = Record<string, { type: "text" | "textarea" | "repeatable"; label: string }>;

interface TemplateField {
  type: "text" | "textarea" | "repeatable" | "tags" | "section";
  label?: string;
  itemFields?: itemFields;
  fields?: fields;
}

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  fields: Record<string, TemplateField>;
}

interface CVData {
  header: {
    links: { label: string; url: string }[];
  };
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    duration: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    link: string;
    label?: string;
  }[];
  sectionOrder?: string[];
  templateId?: string;
}

interface AIGeneratedCV {
  cvData: CVData;
  suggestions: {
    [fieldId: string]: string[];
  };
}

export type { Template, TemplateField, CVData, AIGeneratedCV, fields, itemFields };
