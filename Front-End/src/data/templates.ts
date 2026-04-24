export interface TemplateField {
  type: "text" | "textarea" | "repeatable" | "tags" | "section";
  label?: string;
  itemFields?: Record<string, { type: "text" | "textarea"; label: string }>;
  fields?: Record<string, { type: "text" | "textarea"; label: string }>;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  fields: Record<string, TemplateField>;
}

export const templateFields: Record<string, TemplateField> = {
  header: {
    type: "section",
    fields: {
      links: {
        type: "repeatable",
        itemFields: {
          label: { type: "text", label: "Label" },
          url: { type: "text", label: "URL" },
        },
      },
    },
  },
  personal: {
    type: "section",
    fields: {
      fullName: { type: "text", label: "Full Name" },
      email: { type: "text", label: "Email" },
      phone: { type: "text", label: "Phone" },
      location: { type: "text", label: "Location" },
      summary: { type: "textarea", label: "Summary" },
    },
  },
  experience: {
    type: "repeatable",
    label: "Experience",
    itemFields: {
      company: { type: "text", label: "Company" },
      role: { type: "text", label: "Role" },
      duration: { type: "text", label: "Duration" },
      description: { type: "textarea", label: "Description" },
    },
  },
  education: {
    type: "repeatable",
    label: "Education",
    itemFields: {
      school: { type: "text", label: "School" },
      degree: { type: "text", label: "Degree" },
      duration: { type: "text", label: "Duration" },
    },
  },
  skills: {
    type: "tags",
    label: "Skills",
  },
  projects: {
    type: "repeatable",
    label: "Projects",
    itemFields: {
      name: { type: "text", label: "Project Name" },
      description: { type: "textarea", label: "Description" },
      link: { type: "text", label: "Link" },
    },
  },
};

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=500&fit=crop",
    fields: templateFields,
  },
  {
    id: "classic",
    name: "Classic",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=500&fit=crop",
    fields: templateFields,
  },
  {
    id: "minimal",
    name: "Minimal",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=500&fit=crop",
    fields: templateFields,
  },
  {
    id: "creative",
    name: "Creative",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=500&fit=crop",
    fields: templateFields,
  },
];
