import { useState, useCallback, useRef, useEffect } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Hooks & Services
import { useCVService } from "@/hooks/useCVService";
import { useCVData } from "@/hooks/useCVData";
import { useCVExport } from "@/hooks/useCVExport";
import { toast } from "sonner";

// Components
import { getTemplateComponent } from "@/components/templates";
import { CVBuilderTopbar } from "@/components/cv-builder/CVBuilderTopbar";
import { CVBuilderSidebar } from "@/components/cv-builder/CVBuilderSidebar";
import { AIGenerateModal, TemplateSelectorModal } from "@/components/cv-builder/CVBuilderModals";
import { PersonalForm } from "@/components/cv-builder/forms/PersonalForm";
import { ExperienceForm } from "@/components/cv-builder/forms/ExperienceForm";
import { EducationForm, ProjectsForm, LinksForm } from "@/components/cv-builder/forms/OtherForms";
import { TagsInput } from "@/components/cv-builder/fields/TagsInput";

// Styles
import styles from "@/components/cv-builder/CVBuilder.module.css";

type SectionId = "personal" | "experience" | "education" | "skills" | "projects" | "links";

const SECTION_LABELS: Record<string, string> = {
  personal: "Personal Info",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  links: "Links",
};

export default function CVBuilderPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const { 
    cvData, setCVData, currentCVId, saving, lastSaved, isLoading, 
    handleSave, loadCV 
  } = useCVData();
  
  const [exporting, setExporting] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const { createCV, generateCV, improveField } = useCVService();
  const { exportToPDF } = useCVExport();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIGenerateModal, setShowAIGenerateModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [improveLoading, setImproveLoading] = useState(false);

  const [sectionOrder, setSectionOrder] = useState<string[]>(["personal", "experience", "education", "skills", "projects", "links"]);
  const [templateId, setTemplateId] = useState<string>("modern");

  // Sync Template ID from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      loadCV(id).then(tid => tid && setTemplateId(tid));
    }
  }, [loadCV]);

  const handleSaveWithTemplate = useCallback(() => {
    const dataToSave = { ...cvData, templateId };
    setCVData(dataToSave);
    handleSave(dataToSave);
  }, [cvData, templateId, handleSave, setCVData]);

  const handleReorder = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleGenerateFromAI = useCallback(async (rawText: string) => {
    const hasData = cvData.personal.fullName || cvData.experience.length > 0;
    if (hasData && !confirm("This will replace your current CV data. Continue?")) return;
    
    setIsGenerating(true);
    try {
      const result = await generateCV(rawText);
      if (!result) throw new Error("Generation failed");
      
      setCVData(result.cvData);
      const newId = await createCV(result.cvData);
      if (newId) window.history.replaceState(null, "", `?id=${newId}`);
      toast.success("CV Generated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate CV");
    } finally {
      setIsGenerating(false);
    }
  }, [generateCV, createCV, setCVData, cvData]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToPDF(cvRef, `${cvData.personal.fullName || "CV"}-Resume.pdf`);
      toast.success("Exported to PDF!");
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleImprove = useCallback(async (fieldType: string, text: string) => {
    if (!text || text.trim().length < 5) {
      toast.error("Add more content before improving");
      return;
    }
    setImproveLoading(true);
    try {
      const result = await improveField(fieldType, text);
      if (result?.improvements?.[0]?.text) {
        const improved = result.improvements[0].text;
        
        setCVData(prev => {
          const next = { ...prev };
          if (fieldType === "personal.summary") {
            next.personal = { ...next.personal, summary: improved };
          } else if (fieldType.startsWith("experience.")) {
            const idx = parseInt(fieldType.split(".")[1], 10);
            next.experience = [...next.experience];
            next.experience[idx] = { ...next.experience[idx], description: improved };
          } else if (fieldType.startsWith("projects.")) {
            const idx = parseInt(fieldType.split(".")[1], 10);
            next.projects = [...next.projects];
            next.projects[idx] = { ...next.projects[idx], description: improved };
          }
          return next;
        });
        toast.success("AI improvement applied");
      }
    } catch (e: any) {
      toast.error("Improvement failed");
    } finally {
      setImproveLoading(false);
    }
  }, [improveField, setCVData]);

  const TemplateComponent = getTemplateComponent(templateId);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.topbar} style={{ border: "none" }} />
        <div className={styles.sidebar}>
          <div style={{ padding: 20 }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className={styles.skeleton} style={{ height: 40, marginBottom: 12, borderRadius: 8 }} />)}
          </div>
        </div>
        <div className={styles.previewPane}>
          <div className={styles.skeleton} style={{ width: "100%", maxWidth: 740, height: "100%", borderRadius: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${mobileView === "edit" ? styles.showSidebar : styles.showPreview}`}>
      <CVBuilderTopbar
        onAIGenerate={() => setShowAIGenerateModal(true)}
        onExport={handleExport}
        onSave={handleSaveWithTemplate}
        onSelectTemplate={() => setShowTemplateSelector(true)}
        templateId={templateId}
        isGenerating={isGenerating}
        exporting={exporting}
        saving={saving}
        currentCVId={currentCVId}
      />

      <CVBuilderSidebar
        sectionOrder={sectionOrder}
        activeSection={activeSection}
        onSectionClick={(id) => setActiveSection(id as SectionId)}
        onReorder={handleReorder}
        sectionLabels={SECTION_LABELS}
      >
        {activeSection === "personal" && (
          <PersonalForm data={cvData.personal} onChange={(d) => setCVData({ ...cvData, personal: d })} onImprove={handleImprove} improveLoading={improveLoading} />
        )}
        {activeSection === "experience" && (
          <ExperienceForm data={cvData.experience} onChange={(d) => setCVData({ ...cvData, experience: d })} onImprove={handleImprove} improveLoading={improveLoading} />
        )}
        {activeSection === "education" && (
          <EducationForm data={cvData.education} onChange={(d) => setCVData({ ...cvData, education: d })} />
        )}
        {activeSection === "skills" && (
          <TagsInput tags={cvData.skills} onChange={(d) => setCVData({ ...cvData, skills: d })} />
        )}
        {activeSection === "projects" && (
          <ProjectsForm data={cvData.projects} onChange={(d) => setCVData({ ...cvData, projects: d })} onImprove={handleImprove} improveLoading={improveLoading} />
        )}
        {activeSection === "links" && (
          <LinksForm data={cvData.header.links} onChange={(d) => setCVData({ ...cvData, header: { ...cvData.header, links: d } })} />
        )}
      </CVBuilderSidebar>

      <main className={styles.previewPane}>
        <div className={styles.cvPaper} ref={cvRef}>
          <TemplateComponent data={cvData} />
        </div>
        {lastSaved && (
          <span style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 16 }}>
            Changes saved at {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </main>

      <div className={styles.mobileSwitcher}>
        <button 
          className={`${styles.switcherBtn} ${mobileView === "edit" ? styles.switcherBtnActive : ""}`}
          onClick={() => setMobileView("edit")}
        >
          ✍️ Edit
        </button>
        <button 
          className={`${styles.switcherBtn} ${mobileView === "preview" ? styles.switcherBtnActive : ""}`}
          onClick={() => setMobileView("preview")}
        >
          📄 Preview
        </button>
      </div>

      {showAIGenerateModal && (
        <AIGenerateModal
          onClose={() => setShowAIGenerateModal(false)}
          onGenerate={handleGenerateFromAI}
          isGenerating={isGenerating}
        />
      )}

      {showTemplateSelector && (
        <TemplateSelectorModal
          onClose={() => setShowTemplateSelector(false)}
          onSelect={setTemplateId}
          selectedId={templateId}
        />
      )}
    </div>
  );
}

