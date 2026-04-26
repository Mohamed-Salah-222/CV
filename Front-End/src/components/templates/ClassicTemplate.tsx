import type { templateTypes } from "@cv/types";
import React from "react";

type CVData = templateTypes.CVData;

const styles = {
  page: {
    width: "100%",
    height: "100%",
    padding: 40,
    fontFamily: "Georgia, serif",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#1a1a1a",
    background: "#fff",
  } as React.CSSProperties,
  header: {
    borderBottom: "2px solid #1a1a1a",
    paddingBottom: 20,
    marginBottom: 24,
  } as React.CSSProperties,
  name: {
    fontSize: 28,
    fontWeight: "bold" as const,
    marginBottom: 6,
  } as React.CSSProperties,
  contact: {
    fontSize: 12,
    color: "#444",
  } as React.CSSProperties,
  section: {
    marginBottom: 20,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: 4,
    marginBottom: 12,
  } as React.CSSProperties,
  entry: {
    marginBottom: 16,
  } as React.CSSProperties,
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  } as React.CSSProperties,
  entryTitle: {
    fontWeight: "bold" as const,
    fontSize: 14,
  } as React.CSSProperties,
  entryMeta: {
    fontSize: 12,
    color: "#444",
  } as React.CSSProperties,
  entryDesc: {
    fontSize: 12,
    marginTop: 4,
  } as React.CSSProperties,
  skills: {
    fontSize: 12,
    color: "#1a1a1a",
    lineHeight: 1.6,
  } as React.CSSProperties,
  link: {
    color: "#1a56db",
    textDecoration: "underline",
  } as React.CSSProperties,
};

export function ClassicTemplate({ data }: { data: CVData }) {
  const { personal, experience, education, skills, projects, header } = data;
  
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  const activeExp = experience.filter(e => e.company || e.role);
  const activeEdu = education.filter(e => e.school || e.degree);
  const activeProj = projects.filter(p => p.name);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.name}>{personal.fullName || "Your Name"}</div>
        <div style={styles.contact}>{contactParts.join(" • ")}</div>
        {header.links.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 12 }}>
            {header.links.filter(l => l.label || l.url).map((link, i) => (
              <a 
                key={i} 
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1a56db", textDecoration: "underline", fontSize: 12 }}
              >
                {i > 0 && <span style={{ color: "#444", textDecoration: "none", marginRight: 12 }}>•</span>}
                {link.label || link.url}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {personal.summary && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Summary</div>
          <div style={{ fontSize: 12 }} dangerouslySetInnerHTML={{ __html: personal.summary }} />
        </div>
      )}

      {/* Experience */}
      {activeExp.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Experience</div>
          {activeExp.map((exp, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{exp.role || "Role"}</span>
                <span style={styles.entryMeta}>{exp.duration || "Duration"}</span>
              </div>
              <div style={styles.entryMeta}>{exp.company || "Company"}</div>
              <div style={styles.entryDesc} dangerouslySetInnerHTML={{ __html: exp.description || "" }} />
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {activeEdu.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Education</div>
          {activeEdu.map((edu, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{edu.school || "School"}</span>
                <span style={styles.entryMeta}>{edu.duration || "Duration"}</span>
              </div>
              <div style={styles.entryMeta}>{edu.degree || "Degree"}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills as comma-separated text */}
      {skills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          <div style={styles.skills}>
            {skills.filter(s => s).join(", ")}
          </div>
        </div>
      )}

      {/* Projects */}
      {activeProj.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Projects</div>
          {activeProj.map((proj, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{proj.name || "Project"}</span>
                {proj.link && (
                  <a 
                    href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1a56db", textDecoration: "underline", fontSize: 12 }}
                  >
                    {proj.label || proj.link}
                  </a>
                )}
              </div>
              <div style={styles.entryDesc} dangerouslySetInnerHTML={{ __html: proj.description || "" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}