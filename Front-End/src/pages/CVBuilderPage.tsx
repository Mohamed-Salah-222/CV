import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { templates } from "@/data/templates";
import { CVData, dummyCVData } from "@/data/cvData";

export default function CVBuilderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template");
  const template = templates.find((t) => t.id === templateId);

  const [cvData, setCVData] = useState<CVData>(dummyCVData);

  if (!template) {
    return (
      <div className="p-8">
        <h1 className="text-xl text-red-600">Template not found</h1>
        <Link to="/templates" className="mt-4 text-blue-600 hover:underline">
          Back to templates
        </Link>
      </div>
    );
  }

  const updateField = (section: keyof CVData, index: number | null, field: string, value: string) => {
    const newData = { ...cvData };
    if (index === null) {
      (newData[section as keyof CVData] as Record<string, string>)[field] = value;
    } else if (Array.isArray(newData[section as keyof CVData])) {
      const arr = [...(newData[section as keyof CVData] as unknown as Record<string, string>[])];
      arr[index] = { ...arr[index], [field]: value };
      (newData[section as keyof CVData] as unknown) = arr;
    }
    setCVData(newData as CVData);
  };

  const addItem = (section: keyof CVData) => {
    const newData = { ...cvData };
    if (section === "experience") {
      newData.experience = [...newData.experience, { company: "", role: "", duration: "", description: "" }];
    } else if (section === "education") {
      newData.education = [...newData.education, { school: "", degree: "", duration: "" }];
    } else if (section === "projects") {
      newData.projects = [...newData.projects, { name: "", description: "", link: "" }];
    } else if (section === "skills") {
      newData.skills = [...newData.skills, ""];
    } else if (section === "header") {
      newData.header.links = [...newData.header.links, { label: "", url: "" }];
    }
    setCVData(newData);
  };

  const removeItem = (section: keyof CVData, index: number) => {
    const newData = { ...cvData };
    if (section === "experience") {
      newData.experience = newData.experience.filter((_, i) => i !== index);
    } else if (section === "education") {
      newData.education = newData.education.filter((_, i) => i !== index);
    } else if (section === "projects") {
      newData.projects = newData.projects.filter((_, i) => i !== index);
    } else if (section === "skills") {
      newData.skills = newData.skills.filter((_, i) => i !== index);
    } else if (section === "header") {
      newData.header.links = newData.header.links.filter((_, i) => i !== index);
    }
    setCVData(newData);
  };

  const renderTextField = (section: keyof CVData, field: string, label: string, value: string) => (
    <div key={field} className="mb-3">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => updateField(section, null, field, e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );

  const renderTextareaField = (section: keyof CVData, field: string, label: string, value: string) => (
    <div key={field} className="mb-3">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => updateField(section, null, field, e.target.value)}
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );

  const renderRepeatableItem = (
    section: keyof CVData,
    items: { company?: string; role?: string; duration?: string; description?: string; school?: string; degree?: string; name?: string; link?: string; label?: string; url?: string }[],
    itemFields: Record<string, { type: "text" | "textarea"; label: string }>,
    onAdd: () => void,
    onRemove: (i: number) => void
  ) => (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="relative rounded-lg border border-gray-200 p-4">
          <button
            onClick={() => onRemove(idx)}
            className="absolute right-2 top-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
          {Object.entries(itemFields).map(([fieldKey, fieldDef]) => (
            <div key={fieldKey} className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">{fieldDef.label}</label>
              {fieldDef.type === "textarea" ? (
                <textarea
                  value={(item as Record<string, string>)[fieldKey] || ""}
                  onChange={(e) => {
                    const newData = { ...cvData };
                    const arr = [...(newData[section as keyof CVData] as unknown as Record<string, string>[])];
                    arr[idx] = { ...arr[idx], [fieldKey]: e.target.value };
                    (newData[section as keyof CVData] as unknown) = arr;
                    setCVData(newData as CVData);
                  }}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={(item as Record<string, string>)[fieldKey] || ""}
                  onChange={(e) => {
                    const newData = { ...cvData };
                    const arr = [...(newData[section as keyof CVData] as unknown as Record<string, string>[])];
                    arr[idx] = { ...arr[idx], [fieldKey]: e.target.value };
                    (newData[section as keyof CVData] as unknown) = arr;
                    setCVData(newData as CVData);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="rounded border border-dashed border-gray-400 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        + Add
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-2">
      {cvData.skills.map((skill, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={skill}
            onChange={(e) => {
              const newSkills = [...cvData.skills];
              newSkills[idx] = e.target.value;
              setCVData({ ...cvData, skills: newSkills });
            }}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <button onClick={() => removeItem("skills", idx)} className="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={() => addItem("skills")}
        className="rounded border border-dashed border-gray-400 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        + Add Skill
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left: Form */}
      <div className="w-1/2 overflow-y-auto border-r bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to={`/template/${templateId}`}
              className="mb-2 inline-block text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to template
            </Link>
            <h1 className="text-2xl font-bold">{template.name} CV Builder</h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Header - Links */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Header / Links</h2>
            {renderRepeatableItem(
              "header",
              cvData.header.links,
              {
                label: { type: "text", label: "Label" },
                url: { type: "text", label: "URL" },
              },
              () => addItem("header"),
              (idx) => removeItem("header", idx)
            )}
          </section>

          {/* Personal */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Personal Info</h2>
            {renderTextField("personal", "fullName", "Full Name", cvData.personal.fullName)}
            {renderTextField("personal", "email", "Email", cvData.personal.email)}
            {renderTextField("personal", "phone", "Phone", cvData.personal.phone)}
            {renderTextField("personal", "location", "Location", cvData.personal.location)}
            {renderTextareaField("personal", "summary", "Summary", cvData.personal.summary)}
          </section>

          {/* Experience */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Experience</h2>
            {renderRepeatableItem(
              "experience",
              cvData.experience,
              {
                company: { type: "text", label: "Company" },
                role: { type: "text", label: "Role" },
                duration: { type: "text", label: "Duration" },
                description: { type: "textarea", label: "Description" },
              },
              () => addItem("experience"),
              (idx) => removeItem("experience", idx)
            )}
          </section>

          {/* Education */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Education</h2>
            {renderRepeatableItem(
              "education",
              cvData.education,
              {
                school: { type: "text", label: "School" },
                degree: { type: "text", label: "Degree" },
                duration: { type: "text", label: "Duration" },
              },
              () => addItem("education"),
              (idx) => removeItem("education", idx)
            )}
          </section>

          {/* Skills */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Skills</h2>
            {renderSkills()}
          </section>

          {/* Projects */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Projects</h2>
            {renderRepeatableItem(
              "projects",
              cvData.projects,
              {
                name: { type: "text", label: "Project Name" },
                description: { type: "textarea", label: "Description" },
                link: { type: "text", label: "Link" },
              },
              () => addItem("projects"),
              (idx) => removeItem("projects", idx)
            )}
          </section>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex w-1/2 flex-col bg-gray-100 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview</h2>
          <button
            onClick={() => navigate(`/cv-preview?template=${templateId}`)}
            className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Edit / Full Preview
          </button>
        </div>
        
        {/* Preview thumbnail - placeholder */}
        <div className="flex flex-1 items-center justify-center">
          <div className="aspect-[3/4] w-64 overflow-hidden rounded bg-white shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-bold">{cvData.personal.fullName || "Your Name"}</h3>
              <p className="text-sm text-gray-600">{cvData.personal.email}</p>
              <p className="text-xs text-gray-500">{cvData.personal.location}</p>
              <hr className="my-2" />
              <p className="text-xs text-gray-700 line-clamp-4">{cvData.personal.summary}</p>
              <hr className="my-2" />
              <p className="text-xs font-medium">Experience:</p>
              {cvData.experience.slice(0, 2).map((exp, i) => (
                <p key={i} className="text-xs text-gray-600">
                  {exp.role} at {exp.company}
                </p>
              ))}
              <p className="text-xs font-medium mt-2">Skills:</p>
              <p className="text-xs text-gray-600">{cvData.skills.slice(0, 5).join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}