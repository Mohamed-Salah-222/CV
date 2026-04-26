import type { templateTypes } from "@cv/types";
import React from "react";

type CVData = templateTypes.CVData;

const styles = {
  page: {
    width: "100%",
    height: "100%",
    padding: 48,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 13,
    lineHeight: 1.7,
    color: "#111",
    background: "#fff",
  } as React.CSSProperties,
  name: {
    fontSize: 32,
    fontWeight: 300,
    marginBottom: 12,
    letterSpacing: -1,
  } as React.CSSProperties,
  contact: {
    fontSize: 12,
    color: "#666",
    marginBottom: 40,
  } as React.CSSProperties,
  section: {
    marginBottom: 32,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: 2,
    color: "#999",
    marginBottom: 20,
  } as React.CSSProperties,
  entry: {
    marginBottom: 20,
    paddingLeft: 16,
    borderLeft: "1px solid #f0f0f0",
  } as React.CSSProperties,
  entryTitle: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 4,
  } as React.CSSProperties,
  entryMeta: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  } as React.CSSProperties,
  entryDesc: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.6,
  } as React.CSSProperties,
  summary: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.8,
  } as React.CSSProperties,
  skills: {
    fontSize: 13,
    color: "#333",
    lineHeight: 1.6,
  } as React.CSSProperties,
};

export function MinimalTemplate({ data }: { data: CVData }) {
  const { personal, experience, education, skills, projects, header } = data;
  
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean);
  const activeExp = experience.filter(e => e.company || e.role);
  const activeEdu = education.filter(e => e.school || e.degree);
  const activeProj = projects.filter(p => p.name);

  return (
    <div style={styles.page}>
      {/* Header - minimal */}
      <div style={styles.name}>{personal.fullName || "Your Name"}</div>
      <div style={styles.contact}>
        {contactParts.join(" • ")}
        {header.links.length > 0 && contactParts.length > 0 && " • "}
        {header.links.filter(l => l.label || l.url).map((link, i) => (
          <a 
            key={i} 
            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#111", textDecoration: "none" }}
          >
            {i > 0 && " • "}
            {link.label || link.url}
          </a>
        ))}
      </div>

      {/* Summary */}
      {personal.summary && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>About</div>
          <div style={styles.summary} dangerouslySetInnerHTML={{ __html: personal.summary }} />
        </div>
      )}

      {/* Experience */}
      {activeExp.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Experience</div>
          {activeExp.map((exp, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryTitle}>{exp.role || "Role"}</div>
              <div style={styles.entryMeta}>{exp.company}{exp.company && exp.duration && " • "}{exp.duration}</div>
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
              <div style={styles.entryTitle}>{edu.school || "School"}</div>
              <div style={styles.entryMeta}>{edu.degree}{edu.degree && edu.duration && " • "}{edu.duration}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Skills</div>
          <div style={styles.skills}>
            {skills.filter(s => s).join(" • ")}
          </div>
        </div>
      )}

      {/* Projects */}
      {activeProj.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Projects</div>
          {activeProj.map((proj, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryTitle}>
                {proj.name || "Project"}
                {proj.link && (
                  <a 
                    href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontWeight: 400, color: "#666", textDecoration: "none" }}
                  >
                    {" — "}{proj.label || proj.link}
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