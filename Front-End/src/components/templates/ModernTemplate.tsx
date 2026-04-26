import type { templateTypes } from "@cv/types";
import React from "react";

type CVData = templateTypes.CVData;

const styles = {
  page: {
    width: "100%",
    height: "100%",
    padding: 40,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#2d3748",
    background: "#fff",
  } as React.CSSProperties,
  header: {
    borderLeft: "4px solid #4f46e5",
    paddingLeft: 20,
    paddingBottom: 20,
    marginBottom: 24,
  } as React.CSSProperties,
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: "#1a202c",
    marginBottom: 8,
  } as React.CSSProperties,
  contact: {
    fontSize: 12,
    color: "#4a5568",
  } as React.CSSProperties,
  section: {
    marginBottom: 24,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    color: "#4f46e5",
    marginBottom: 14,
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
    fontWeight: 600,
    fontSize: 14,
    color: "#1a202c",
  } as React.CSSProperties,
  entryMeta: {
    fontSize: 12,
    color: "#4a5568",
  } as React.CSSProperties,
  entryDesc: {
    fontSize: 13,
    marginTop: 6,
    color: "#4a5568",
  } as React.CSSProperties,
  tags: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
  } as React.CSSProperties,
  tag: {
    fontSize: 11,
    padding: "4px 12px",
    background: "#eef2ff",
    color: "#4338ca",
    borderRadius: 12,
    fontWeight: 500,
  } as React.CSSProperties,
  summary: {
    fontSize: 13,
    color: "#4a5568",
    lineHeight: 1.7,
  } as React.CSSProperties,
};

export function ModernTemplate({ data }: { data: CVData }) {
  const { personal, experience, education, skills, projects, header } = data;
  
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  const activeExp = experience.filter(e => e.company || e.role);
  const activeEdu = education.filter(e => e.school || e.degree);
  const activeProj = projects.filter(p => p.name);

  return (
    <div style={styles.page}>
      {/* Header with indigo accent */}
      <div style={styles.header}>
        <div style={styles.name}>{personal.fullName || "Your Name"}</div>
        <div style={styles.contact}>{contactParts.join(" • ")}</div>
        {header.links.length > 0 && (
          <div style={{ marginTop: 6, fontSize: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {header.links.filter(l => l.label || l.url).map((link, i) => (
              <a 
                key={i} 
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}
              >
                {i > 0 && <span style={{ color: "#4a5568", marginRight: 10 }}>•</span>}
                {link.label || link.url}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {personal.summary && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Professional Summary</div>
          <div style={styles.summary} dangerouslySetInnerHTML={{ __html: personal.summary }} />
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
              <div style={{ fontSize: 12, color: "#4a5568", fontWeight: 500 }}>{exp.company || "Company"}</div>
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
              <div style={{ fontSize: 12, color: "#4a5568" }}>{edu.degree || "Degree"}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills with indigo tags */}
      {skills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          <div style={styles.tags}>
            {skills.filter(s => s).map((skill, i) => (
              <span key={i} style={styles.tag}>{skill}</span>
            ))}
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
                    style={{ fontSize: 11, color: "#4f46e5", textDecoration: "none" }}
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