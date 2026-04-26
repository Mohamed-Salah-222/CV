import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type RefObject,
} from "react";
import type { templateTypes } from "@cv/types";
import { useSettings } from "@/contexts/SettingsContext";
import { fetchGitHubData } from "@/lib/github";
import { useCVService } from "@/hooks/useCVService";

type CVData = templateTypes.CVData;

async function exportCVToPDF(cvRef: RefObject<HTMLDivElement | null>) {
  const el = cvRef.current;
  if (!el) return;

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // Strip visual chrome so edges are clean in the PDF
  const prev = {
    borderRadius: el.style.borderRadius,
    boxShadow: el.style.boxShadow,
    border: el.style.border,
  };
  el.style.borderRadius = "0";
  el.style.boxShadow = "none";
  el.style.border = "none";

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  el.style.borderRadius = prev.borderRadius;
  el.style.boxShadow = prev.boxShadow;
  el.style.border = prev.border;

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const imgH = pageW * (canvas.height / canvas.width);

  // Tile content across pages if taller than one A4
  let yOffset = 0;
  let remaining = imgH;
  while (remaining > 0) {
    pdf.addImage(imgData, "PNG", 0, -yOffset, pageW, imgH);
    remaining -= pageH;
    yOffset += pageH;
    if (remaining > 0) pdf.addPage();
  }

  pdf.save("cv.pdf");
}

// ─── Default data ─────────────────────────────────────────────────────────────

const defaultCVData: CVData = {
  header: { links: [] },
  personal: { fullName: "", email: "", phone: "", location: "", summary: "" },
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ school: "", degree: "", duration: "" }],
  skills: [],
  projects: [{ name: "", description: "", link: "" }],
};

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "personal", label: "Personal info" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "links", label: "Links" },
] as const;

type SectionId = (typeof NAV_SECTIONS)[number]["id"];

const SECTION_LABELS: Record<SectionId, string> = {
  personal: "Personal info",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  links: "Links",
};

// ─── Plain text field ─────────────────────────────────────────────────────────

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <div style={s.field}>
      <label style={s.fieldLabel}>{label}</label>
      <input
        style={s.input}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─── Rich text field ──────────────────────────────────────────────────────────

const FONT_SIZES = [11, 12, 13, 14, 16, 18, 20, 24];

interface RichFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function RichTextField({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 80,
}: RichFieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [fmt, setFmt] = useState({ bold: false, italic: false, underline: false });
  const lastHtml = useRef(value);

  // Sync only when value changes externally (e.g. section switch / reset)
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
      // surroundContents can fail if selection crosses element boundaries — ignore
    }
    emit();
  };

  const isEmpty =
    !value ||
    value === "<br>" ||
    value === "" ||
    value === "<div><br></div>";

  return (
    <div style={s.field}>
      <label style={s.fieldLabel}>{label}</label>

      {/* Toolbar */}
      <div style={s.richToolbar}>
        {(["bold", "italic", "underline"] as const).map((cmd) => (
          <button
            key={cmd}
            style={{ ...s.toolBtn, ...(fmt[cmd] ? s.toolBtnActive : {}) }}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd);
            }}
            title={cmd.charAt(0).toUpperCase() + cmd.slice(1)}
          >
            {cmd === "bold" && <strong>B</strong>}
            {cmd === "italic" && <em style={{ fontStyle: "italic" }}>I</em>}
            {cmd === "underline" && (
              <span style={{ textDecoration: "underline" }}>U</span>
            )}
          </button>
        ))}

        <div style={s.toolDivider} />

        <select
          style={s.toolSelect}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) applyFontSize(Number(e.target.value));
            e.target.value = "";
          }}
          title="Font size"
        >
          <option value="" disabled>
            Size
          </option>
          {FONT_SIZES.map((sz) => (
            <option key={sz} value={sz}>
              {sz}px
            </option>
          ))}
        </select>

        <div style={s.toolDivider} />

        <button
          style={s.toolBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
          title="Bullet list"
        >
          • list
        </button>
        <button
          style={s.toolBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertOrderedList");
          }}
          title="Numbered list"
        >
          1. list
        </button>

        <div style={s.toolDivider} />

        <button
          style={s.toolBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("removeFormat");
          }}
          title="Clear formatting"
        >
          clear
        </button>
      </div>

      {/* Editable area */}
      <div style={{ position: "relative" }}>
        {isEmpty && !focused && (
          <div style={s.richPlaceholder}>{placeholder}</div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            ...s.richEditor,
            minHeight,
            borderColor: focused
              ? "rgba(0,0,0,0.3)"
              : "rgba(0,0,0,0.18)",
            boxShadow: focused ? "0 0 0 2px rgba(0,0,0,0.06)" : "none",
          }}
          onFocus={() => {
            setFocused(true);
            refreshFmt();
          }}
          onBlur={() => {
            setFocused(false);
            emit();
          }}
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

// ─── Repeatable card wrapper ──────────────────────────────────────────────────

function RepeatCard({
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
    <div style={s.repeatCard}>
      <div style={s.repeatCardHeader}>
        <span style={s.repeatLabel}>{title}</span>
        {canRemove && (
          <button style={s.iconBtn} onClick={onRemove} aria-label="Remove">
            ✕
          </button>
        )}
      </div>
      <div style={s.fieldGroup}>{children}</div>
    </div>
  );
}

// ─── Tags input ───────────────────────────────────────────────────────────────

function TagsInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (t: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const val = raw.trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };
  const remove = (i: number) => onChange(tags.filter((_, idx) => idx !== i));

  return (
    <div style={s.field}>
      <label style={s.fieldLabel}>Press Enter to add a skill</label>
      <div style={s.tagsWrap} onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <span key={i} style={s.tag}>
            {tag}
            <button style={s.tagRemoveBtn} onClick={() => remove(i)}>
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          style={s.tagInput}
          value={input}
          placeholder={tags.length === 0 ? "e.g. TypeScript" : ""}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              add(input);
            } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
              remove(tags.length - 1);
            }
          }}
        />
      </div>
    </div>
  );
}

// ─── Section forms ────────────────────────────────────────────────────────────

function PersonalForm({
  data,
  onChange,
}: {
  data: CVData["personal"];
  onChange: (d: CVData["personal"]) => void;
}) {
  const set = (k: keyof CVData["personal"]) => (v: string) =>
    onChange({ ...data, [k]: v });
  return (
    <div style={s.fieldGroup}>
      <TextField label="Full name" value={data.fullName} onChange={set("fullName")} placeholder="Jane Smith" />
      <TextField label="Email" value={data.email} onChange={set("email")} placeholder="jane@example.com" />
      <TextField label="Phone" value={data.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
      <TextField label="Location" value={data.location} onChange={set("location")} placeholder="New York, NY" />
      <RichTextField label="Summary" value={data.summary} onChange={set("summary")} placeholder="Brief professional summary..." minHeight={88} />
    </div>
  );
}

function ExperienceForm({
  data,
  onChange,
}: {
  data: CVData["experience"];
  onChange: (d: CVData["experience"]) => void;
}) {
  const upd = (i: number, k: keyof CVData["experience"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <>
      {data.map((entry, i) => (
        <RepeatCard
          key={i}
          title={entry.company || `Company ${i + 1}`}
          canRemove={data.length > 1}
          onRemove={() => onChange(data.filter((_, idx) => idx !== i))}
        >
          <TextField label="Company" value={entry.company} onChange={(v) => upd(i, "company", v)} placeholder="Acme Corp" />
          <TextField label="Role" value={entry.role} onChange={(v) => upd(i, "role", v)} placeholder="Senior Engineer" />
          <TextField label="Duration" value={entry.duration} onChange={(v) => upd(i, "duration", v)} placeholder="Jan 2022 – Present" />
          <RichTextField label="Description" value={entry.description} onChange={(v) => upd(i, "description", v)} placeholder="Key responsibilities and achievements..." />
        </RepeatCard>
      ))}
      <button style={s.addBtn} onClick={() => onChange([...data, { company: "", role: "", duration: "", description: "" }])}>
        + Add position
      </button>
    </>
  );
}

function EducationForm({
  data,
  onChange,
}: {
  data: CVData["education"];
  onChange: (d: CVData["education"]) => void;
}) {
  const upd = (i: number, k: keyof CVData["education"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <>
      {data.map((entry, i) => (
        <RepeatCard
          key={i}
          title={entry.school || `School ${i + 1}`}
          canRemove={data.length > 1}
          onRemove={() => onChange(data.filter((_, idx) => idx !== i))}
        >
          <TextField label="School" value={entry.school} onChange={(v) => upd(i, "school", v)} placeholder="MIT" />
          <TextField label="Degree" value={entry.degree} onChange={(v) => upd(i, "degree", v)} placeholder="B.Sc. Computer Science" />
          <TextField label="Duration" value={entry.duration} onChange={(v) => upd(i, "duration", v)} placeholder="2018 – 2022" />
        </RepeatCard>
      ))}
      <button style={s.addBtn} onClick={() => onChange([...data, { school: "", degree: "", duration: "" }])}>
        + Add education
      </button>
    </>
  );
}

function ProjectsForm({
  data,
  onChange,
}: {
  data: CVData["projects"];
  onChange: (d: CVData["projects"]) => void;
}) {
  const upd = (i: number, k: keyof CVData["projects"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <>
      {data.map((entry, i) => (
        <RepeatCard
          key={i}
          title={entry.name || `Project ${i + 1}`}
          canRemove={data.length > 1}
          onRemove={() => onChange(data.filter((_, idx) => idx !== i))}
        >
          <TextField label="Name" value={entry.name} onChange={(v) => upd(i, "name", v)} placeholder="My Project" />
          <RichTextField label="Description" value={entry.description} onChange={(v) => upd(i, "description", v)} placeholder="What it does and the tech used..." />
          <TextField label="Link" value={entry.link} onChange={(v) => upd(i, "link", v)} placeholder="https://github.com/..." />
        </RepeatCard>
      ))}
      <button style={s.addBtn} onClick={() => onChange([...data, { name: "", description: "", link: "" }])}>
        + Add project
      </button>
    </>
  );
}

function LinksForm({
  data,
  onChange,
}: {
  data: CVData["header"]["links"];
  onChange: (d: CVData["header"]["links"]) => void;
}) {
  const upd = (i: number, k: keyof CVData["header"]["links"][number], v: string) =>
    onChange(data.map((e, idx) => (idx === i ? { ...e, [k]: v } : e)));
  return (
    <>
      {data.map((entry, i) => (
        <RepeatCard
          key={i}
          title={entry.label || `Link ${i + 1}`}
          canRemove={data.length > 1}
          onRemove={() => onChange(data.filter((_, idx) => idx !== i))}
        >
          <TextField label="Label" value={entry.label} onChange={(v) => upd(i, "label", v)} placeholder="LinkedIn" />
          <TextField label="URL" value={entry.url} onChange={(v) => upd(i, "url", v)} placeholder="https://linkedin.com/in/..." />
        </RepeatCard>
      ))}
      <button style={s.addBtn} onClick={() => onChange([...data, { label: "", url: "" }])}>
        + Add link
      </button>
    </>
  );
}

// ─── CV Preview ───────────────────────────────────────────────────────────────

function CVPreview({
  data,
  cvRef,
}: {
  data: CVData;
  cvRef: RefObject<HTMLDivElement | null>;
}) {
  const { personal, experience, education, skills, projects, header } = data;
  const activeExp = experience.filter((e) => e.company || e.role || e.description);
  const activeEdu = education.filter((e) => e.school || e.degree);
  const activeProj = projects.filter((p) => p.name || p.description);
  const activeLinks = header.links.filter((l) => l.label || l.url);
  const metaParts = [personal.email, personal.phone, personal.location].filter(Boolean);

  return (
    <div id="cv-preview" ref={cvRef} style={s.cvPaper}>
      <div style={s.cvName}>
        {personal.fullName || <span style={s.emptyHint}>Your Name</span>}
      </div>

      {metaParts.length > 0 && (
        <div style={s.cvMeta}>
          {metaParts.map((m, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <span style={{ color: "#ccc" }}>·</span>}
              {m}
            </span>
          ))}
        </div>
      )}

      {activeLinks.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10, marginTop: 4 }}>
          {activeLinks.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noreferrer" style={s.cvLink}>
              {l.label || l.url}
            </a>
          ))}
        </div>
      )}

      {personal.summary && (
        <div style={s.cvSummary} dangerouslySetInnerHTML={{ __html: personal.summary }} />
      )}

      {activeExp.length > 0 && (
        <>
          <hr style={s.cvDivider} />
          <div style={s.cvSectionLabel}>Experience</div>
          {activeExp.map((e, i) => (
            <div key={i} style={s.cvEntry}>
              <div style={s.cvEntryHeader}>
                <div>
                  <div style={s.cvEntryTitle}>{e.role || "\u00A0"}</div>
                  <div style={s.cvEntrySub}>{e.company}</div>
                </div>
                <div style={s.cvEntryDate}>{e.duration}</div>
              </div>
              {e.description && (
                <div style={s.cvEntryDesc} dangerouslySetInnerHTML={{ __html: e.description }} />
              )}
            </div>
          ))}
        </>
      )}

      {activeEdu.length > 0 && (
        <>
          <hr style={s.cvDivider} />
          <div style={s.cvSectionLabel}>Education</div>
          {activeEdu.map((e, i) => (
            <div key={i} style={s.cvEntry}>
              <div style={s.cvEntryHeader}>
                <div>
                  <div style={s.cvEntryTitle}>{e.degree || "\u00A0"}</div>
                  <div style={s.cvEntrySub}>{e.school}</div>
                </div>
                <div style={s.cvEntryDate}>{e.duration}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <hr style={s.cvDivider} />
          <div style={s.cvSectionLabel}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
            {skills.map((sk, i) => (
              <span key={i} style={s.cvTag}>{sk}</span>
            ))}
          </div>
        </>
      )}

      {activeProj.length > 0 && (
        <>
          <hr style={s.cvDivider} />
          <div style={s.cvSectionLabel}>Projects</div>
          {activeProj.map((p, i) => (
            <div key={i} style={s.cvEntry}>
              <div style={s.cvEntryHeader}>
                <div style={s.cvEntryTitle}>{p.name || "Untitled"}</div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" style={s.cvProjectLink}>
                    View →
                  </a>
                )}
              </div>
              {p.description && (
                <div style={s.cvEntryDesc} dangerouslySetInnerHTML={{ __html: p.description }} />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function CVBuilderPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [exporting, setExporting] = useState(false);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  const currentCVIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cvRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { settings } = useSettings();
  const autoSaveEnabled = settings?.autoSave ?? true;
  const { fetchCV, createCV, updateCV, generateCV } = useCVService();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]> | null>(null);
  const [showAIGenerateModal, setShowAIGenerateModal] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [modalText, setModalText] = useState("");
  const [modalGithub, setModalGithub] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      async function loadCV() {
        try {
          const cvData = await fetchCV(id);
          if (cvData) {
            setCVData(cvData);
            setCurrentCVId(id);
            currentCVIdRef.current = id;
          }
        } catch (e) {
          console.error("Failed to load CV:", e);
        } finally {
          setIsLoading(false);
        }
      }
      loadCV();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateFromAI = useCallback(async (rawText: string) => {
    setGenerateError(null);
    setIsGenerating(true);
    try {
      const result = await generateCV(rawText);
      if (!result) {
        setGenerateError("Failed to generate CV. Please try again.");
        return;
      }
      
      setCVData(result.cvData);
      setAiSuggestions(result.suggestions);
      hasInitializedRef.current = true;

      const newId = await createCV(result.cvData);
      if (newId) {
        setCurrentCVId(newId);
        currentCVIdRef.current = newId;
        window.history.replaceState(null, "", `?id=${newId}`);
      }
    } catch (e: any) {
      console.error("Failed to generate CV:", e);
      setGenerateError(e.message || "Failed to generate CV. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const doSave = useCallback(async (data: CVData) => {
    setSaving(true);
    try {
      const id = currentCVIdRef.current;
      if (id) {
        await updateCV(id, data);
      } else {
        const newId = await createCV(data);
        if (newId) {
          setCurrentCVId(newId);
          currentCVIdRef.current = newId;
          hasInitializedRef.current = true;
          window.history.replaceState(null, "", `?id=${newId}`);
        }
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    doSave(cvData);
  }, [doSave, cvData]);

  const scheduleAutoSave = useCallback((data: CVData) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      doSave(data);
    }, 1500);
  }, [doSave]);

  useEffect(() => {
    if (isLoading) return;
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }
    if (!autoSaveEnabled) return;
    scheduleAutoSave(cvData);
  }, [cvData, isLoading, autoSaveEnabled]);

  const updatePersonal = useCallback(
    (personal: CVData["personal"]) => setCVData((d) => ({ ...d, personal })),
    []
  );
  const updateExperience = useCallback(
    (experience: CVData["experience"]) => setCVData((d) => ({ ...d, experience })),
    []
  );
  const updateEducation = useCallback(
    (education: CVData["education"]) => setCVData((d) => ({ ...d, education })),
    []
  );
  const updateSkills = useCallback(
    (skills: CVData["skills"]) => setCVData((d) => ({ ...d, skills })),
    []
  );
  const updateProjects = useCallback(
    (projects: CVData["projects"]) => setCVData((d) => ({ ...d, projects })),
    []
  );
  const updateLinks = useCallback(
    (links: CVData["header"]["links"]) =>
      setCVData((d) => ({ ...d, header: { ...d.header, links } })),
    []
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportCVToPDF(cvRef);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={s.page}>
      {isLoading && (
        <div style={{ ...s.page, placeItems: "center", position: "absolute", inset: 0, background: "#f5f4f1" }}>
          Loading...
        </div>
      )}
      {/* Top bar */}
      <div style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={s.logo}>CV Builder</span>
          <span style={s.badge}>Live preview</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={s.btn}
            onClick={() => setShowAIGenerateModal(true)}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate with AI"}
          </button>
          <button
            style={{ ...s.btn, ...s.btnPrimary, opacity: exporting ? 0.6 : 1 }}
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Sidebar nav + form */}
      <aside style={s.sidebar}>
        <nav style={s.sectionNav}>
          {NAV_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              style={{
                ...s.navItem,
                ...(activeSection === sec.id ? s.navItemActive : {}),
              }}
              onClick={() => setActiveSection(sec.id)}
            >
              <span
                style={{
                  ...s.navDot,
                  ...(activeSection === sec.id ? s.navDotActive : {}),
                }}
              />
              {sec.label}
            </button>
          ))}
        </nav>

        <div style={s.formArea}>
          <div style={s.sectionTitle}>{SECTION_LABELS[activeSection]}</div>

          {activeSection === "personal" && (
            <PersonalForm data={cvData.personal} onChange={updatePersonal} />
          )}
          {activeSection === "experience" && (
            <ExperienceForm data={cvData.experience} onChange={updateExperience} />
          )}
          {activeSection === "education" && (
            <EducationForm data={cvData.education} onChange={updateEducation} />
          )}
          {activeSection === "skills" && (
            <TagsInput tags={cvData.skills} onChange={updateSkills} />
          )}
          {activeSection === "projects" && (
            <ProjectsForm data={cvData.projects} onChange={updateProjects} />
          )}
          {activeSection === "links" && (
            <LinksForm data={cvData.header.links} onChange={updateLinks} />
          )}
        </div>
      </aside>

      {/* Live preview */}
      <main style={s.previewPane}>
        <CVPreview data={cvData} cvRef={cvRef} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
          <button style={s.btn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : currentCVId ? "Save" : "Create CV"}
          </button>
          {lastSaved && (
            <span style={s.savedIndicator}>
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </main>

      {/* AI Generate Modal */}
      {showAIGenerateModal && (
        <div style={s.modalOverlay} onClick={() => !isGenerating && setShowAIGenerateModal(false)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={{ margin: 0 }}>Generate CV with AI</h2>
              <button
                style={s.modalCloseBtn}
                onClick={() => !isGenerating && setShowAIGenerateModal(false)}
                disabled={isGenerating}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Enter your experience, skills, or paste your resume text:
                </label>
                <textarea
                  value={modalText}
                  onChange={(e) => setModalText(e.target.value)}
                  style={{ ...s.input, width: "100%", minHeight: 200, resize: "vertical", fontFamily: "inherit" }}
                  placeholder="Paste your resume, LinkedIn summary, or describe your experience..."
                  disabled={isGenerating}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Or enter GitHub URL / username:
                </label>
                <input
                  value={modalGithub}
                  onChange={(e) => setModalGithub(e.target.value)}
                  style={{ ...s.input, width: "100%" }}
                  placeholder="github.com/username or just username"
                  disabled={isGenerating}
                />
              </div>

              {generateError && (
                <div style={{ padding: "12px", background: "#fee2e2", borderRadius: 8, color: "#dc2626", marginBottom: 16 }}>
                  {generateError}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  style={s.btn}
                  onClick={() => setShowAIGenerateModal(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  style={{ ...s.btn, ...s.btnPrimary }}
                  onClick={async () => {
                    const rawText = modalText.trim() || modalGithub.trim();
                    if (!rawText) {
                      setGenerateError("Please enter some text or a GitHub URL.");
                      return;
                    }

                    if (modalGithub.trim()) {
                      setGenerateError(null);
                      setIsGenerating(true);
                      try {
                        const githubData = await fetchGitHubData(modalGithub.trim());
                        await handleGenerateFromAI(githubData);
                        setShowAIGenerateModal(false);
                        setModalText("");
                        setModalGithub("");
                      } catch (e: any) {
                        console.error("Failed to fetch GitHub:", e);
                        setGenerateError(e.message || "Failed to fetch GitHub data");
                      } finally {
                        setIsGenerating(false);
                      }
                    } else {
                      await handleGenerateFromAI(rawText);
                      setShowAIGenerateModal(false);
                      setModalText("");
                      setModalGithub("");
                    }
                  }}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gridTemplateRows: "52px 1fr",
    height: "100vh",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: 14,
    color: "#1a1a1a",
    background: "#f5f4f1",
  } as React.CSSProperties,

  topbar: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    background: "#fff",
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
  } as React.CSSProperties,

  logo: { fontWeight: 500, fontSize: 15 } as React.CSSProperties,

  badge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 6,
    background: "#e8f0fe",
    color: "#1a56db",
  } as React.CSSProperties,

  btn: {
    fontSize: 13,
    padding: "6px 14px",
    borderRadius: 8,
    border: "0.5px solid rgba(0,0,0,0.15)",
    background: "transparent",
    color: "#1a1a1a",
    cursor: "pointer",
    fontFamily: "inherit",
  } as React.CSSProperties,

  btnPrimary: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
  } as React.CSSProperties,

  savedIndicator: {
    fontSize: 11,
    color: "#888",
  } as React.CSSProperties,

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  } as React.CSSProperties,

  modalContent: {
    background: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
  } as React.CSSProperties,

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
  } as React.CSSProperties,

  modalCloseBtn: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#666",
    padding: 4,
  } as React.CSSProperties,

  sidebar: {
    background: "#fff",
    borderRight: "0.5px solid rgba(0,0,0,0.1)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  sectionNav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "12px 8px",
    borderBottom: "0.5px solid rgba(0,0,0,0.08)",
  } as React.CSSProperties,

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    color: "#666",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    textAlign: "left",
    width: "100%",
  } as React.CSSProperties,

  navItemActive: {
    background: "#f5f4f1",
    color: "#1a1a1a",
    fontWeight: 500,
  } as React.CSSProperties,

  navDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.15)",
    flexShrink: 0,
  } as React.CSSProperties,

  navDotActive: { background: "#1a1a1a" } as React.CSSProperties,

  formArea: { padding: 16, overflowY: "auto" } as React.CSSProperties,

  sectionTitle: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.06em",
    color: "#aaa",
    textTransform: "uppercase",
    marginBottom: 14,
  } as React.CSSProperties,

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 16,
  } as React.CSSProperties,

  field: { display: "flex", flexDirection: "column", gap: 4 } as React.CSSProperties,

  fieldLabel: { fontSize: 12, color: "#555", fontWeight: 500 } as React.CSSProperties,

  input: {
    fontSize: 13,
    padding: "7px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(0,0,0,0.18)",
    background: "#fff",
    color: "#1a1a1a",
    fontFamily: "inherit",
    outline: "none",
    lineHeight: 1.5,
  } as React.CSSProperties,

  // ── Rich text ──

  richToolbar: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: "4px 6px",
    background: "#f8f7f5",
    border: "0.5px solid rgba(0,0,0,0.12)",
    borderBottom: "none",
    borderRadius: "8px 8px 0 0",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  toolBtn: {
    background: "none",
    border: "none",
    padding: "3px 6px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
    color: "#444",
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  } as React.CSSProperties,

  toolBtnActive: {
    background: "rgba(0,0,0,0.08)",
    color: "#1a1a1a",
  } as React.CSSProperties,

  toolDivider: {
    width: 1,
    height: 16,
    background: "rgba(0,0,0,0.12)",
    margin: "0 2px",
    flexShrink: 0,
  } as React.CSSProperties,

  toolSelect: {
    fontSize: 11,
    border: "0.5px solid rgba(0,0,0,0.15)",
    borderRadius: 4,
    padding: "2px 4px",
    background: "#fff",
    color: "#444",
    fontFamily: "inherit",
    cursor: "pointer",
  } as React.CSSProperties,

  richEditor: {
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: "0 0 8px 8px",
    border: "0.5px solid",
    background: "#fff",
    color: "#1a1a1a",
    fontFamily: "inherit",
    lineHeight: 1.6,
    overflowY: "auto",
    transition: "border-color 0.15s, box-shadow 0.15s",
    // Ensure list styles render inside the editable
    listStylePosition: "inside",
  } as React.CSSProperties,

  richPlaceholder: {
    position: "absolute",
    top: 8,
    left: 10,
    fontSize: 13,
    color: "#bbb",
    pointerEvents: "none",
    lineHeight: 1.6,
  } as React.CSSProperties,

  // ── Repeat cards ──

  repeatCard: {
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    background: "#faf9f7",
  } as React.CSSProperties,

  repeatCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  } as React.CSSProperties,

  repeatLabel: { fontSize: 12, fontWeight: 500, color: "#555" } as React.CSSProperties,

  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#aaa",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 14,
    lineHeight: 1,
    fontFamily: "inherit",
  } as React.CSSProperties,

  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    width: "100%",
    padding: "8px 10px",
    border: "0.5px dashed rgba(0,0,0,0.2)",
    borderRadius: 8,
    background: "none",
    color: "#888",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "inherit",
  } as React.CSSProperties,

  // ── Tags ──

  tagsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    padding: "7px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(0,0,0,0.18)",
    minHeight: 38,
    cursor: "text",
    background: "#fff",
  } as React.CSSProperties,

  tag: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#f0efec",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 20,
    padding: "2px 8px 2px 10px",
    fontSize: 12,
  } as React.CSSProperties,

  tagRemoveBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#aaa",
    fontSize: 15,
    lineHeight: 1,
    padding: 0,
    fontFamily: "inherit",
  } as React.CSSProperties,

  tagInput: {
    border: "none",
    outline: "none",
    fontSize: 12,
    background: "transparent",
    color: "#1a1a1a",
    minWidth: 80,
    fontFamily: "inherit",
  } as React.CSSProperties,

  // ── Preview pane ──

  previewPane: {
    background: "#f0eeea",
    overflowY: "auto",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "32px 24px",
  } as React.CSSProperties,

  cvPaper: {
    width: "100%",
    maxWidth: 680,
    background: "#fff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: "40px 48px",
    minHeight: 600,
    fontSize: 13,
    lineHeight: 1.6,
  } as React.CSSProperties,

  cvName: {
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 2,
    letterSpacing: "-0.02em",
  } as React.CSSProperties,

  cvMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  } as React.CSSProperties,

  cvLink: { color: "#1a56db", textDecoration: "none", fontSize: 12 } as React.CSSProperties,

  cvSummary: {
    fontSize: 13,
    color: "#555",
    marginTop: 8,
    lineHeight: 1.65,
  } as React.CSSProperties,

  cvDivider: {
    border: "none",
    borderTop: "0.5px solid rgba(0,0,0,0.1)",
    margin: "20px 0",
  } as React.CSSProperties,

  cvSectionLabel: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: 12,
  } as React.CSSProperties,

  cvEntry: { marginBottom: 14 } as React.CSSProperties,

  cvEntryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 8,
  } as React.CSSProperties,

  cvEntryTitle: { fontWeight: 500, fontSize: 13 } as React.CSSProperties,

  cvEntrySub: { fontSize: 12, color: "#666", marginTop: 1 } as React.CSSProperties,

  cvEntryDate: { fontSize: 11, color: "#aaa", whiteSpace: "nowrap" } as React.CSSProperties,

  cvEntryDesc: { fontSize: 12, color: "#555", marginTop: 4, lineHeight: 1.6 } as React.CSSProperties,

  cvTag: {
    fontSize: 11,
    padding: "2px 9px",
    borderRadius: 20,
    border: "0.5px solid rgba(0,0,0,0.15)",
    color: "#555",
  } as React.CSSProperties,

  cvProjectLink: { fontSize: 11, color: "#1a56db", textDecoration: "none" } as React.CSSProperties,

  emptyHint: { color: "#ccc", fontStyle: "italic", fontWeight: 400 } as React.CSSProperties,
} as const;
