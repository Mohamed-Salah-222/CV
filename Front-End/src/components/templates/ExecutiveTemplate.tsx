import React from "react";
import type { templateTypes } from "@cv/types";

type CVData = templateTypes.CVData;

const styles = {
  page: {
    width: "100%",
    height: "100%",
    display: "flex",
    fontFamily: "'Inter', sans-serif",
    color: "#1a202c",
    background: "#fff",
  } as React.CSSProperties,
  sidebar: {
    width: "35%",
    backgroundColor: "#2d3748",
    color: "#fff",
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 32,
  } as React.CSSProperties,
  main: {
    width: "65%",
    padding: "40px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  } as React.CSSProperties,
  name: {
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 8,
    color: "#fff",
  } as React.CSSProperties,
  role: {
    fontSize: 14,
    color: "#a0aec0",
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    fontWeight: 600,
  } as React.CSSProperties,
  sideSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
    marginBottom: 16,
    color: "#cbd5e0",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: 8,
  } as React.CSSProperties,
  mainSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#2d3748",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: 8,
    marginBottom: 16,
  } as React.CSSProperties,
  contactItem: {
    fontSize: 12,
    marginBottom: 8,
    display: "flex",
    flexDirection: "column" as const,
  } as React.CSSProperties,
  contactLabel: {
    fontSize: 10,
    color: "#718096",
    textTransform: "uppercase" as const,
    marginBottom: 2,
  } as React.CSSProperties,
  link: {
    color: "#63b3ed",
    textDecoration: "none",
    fontSize: 12,
  } as React.CSSProperties,
  skillTag: {
    fontSize: 12,
    padding: "4px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  } as React.CSSProperties,
  entry: {
    marginBottom: 20,
  } as React.CSSProperties,
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  } as React.CSSProperties,
  entryTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a202c",
  } as React.CSSProperties,
  entryMeta: {
    fontSize: 12,
    color: "#718096",
    fontWeight: 500,
  } as React.CSSProperties,
  entryDesc: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#4a5568",
  } as React.CSSProperties,
};

export function ExecutiveTemplate({ data }: { data: CVData }) {
  const { personal, experience, education, skills, projects, header } = data;
  
  const activeExp = experience.filter(e => e.company || e.role);
  const activeEdu = education.filter(e => e.school || e.degree);
  const activeProj = projects.filter(p => p.name);

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div>
          <div style={styles.name}>{personal.fullName || "Your Name"}</div>
          <div style={styles.role}>{activeExp[0]?.role || "Professional"}</div>
        </div>

        <div>
          <div style={styles.sideSectionTitle}>Contact</div>
          <div style={styles.contactItem}>
            <span style={styles.contactLabel}>Email</span>
            <span>{personal.email}</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactLabel}>Phone</span>
            <span>{personal.phone}</span>
          </div>
          <div style={styles.contactItem}>
            <span style={styles.contactLabel}>Location</span>
            <span>{personal.location}</span>
          </div>
        </div>

        {header.links.length > 0 && (
          <div>
            <div style={styles.sideSectionTitle}>Links</div>
            {header.links.map((link, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <a 
                  href={link.url.startsWith("http") ? link.url : `https://${link.url}`} 
                  target="_blank" rel="noreferrer" style={styles.link}
                >
                  {link.label || link.url}
                </a>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <div style={styles.sideSectionTitle}>Expertise</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {skills.map((skill, i) => (
                <div key={i} style={styles.skillTag}>{skill}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {personal.summary && (
          <section>
            <div style={styles.mainSectionTitle}>Professional Summary</div>
            <div style={styles.entryDesc} dangerouslySetInnerHTML={{ __html: personal.summary }} />
          </section>
        )}

        {activeExp.length > 0 && (
          <section>
            <div style={styles.mainSectionTitle}>Experience</div>
            {activeExp.map((exp, i) => (
              <div key={i} style={styles.entry}>
                <div style={styles.entryHeader}>
                  <span style={styles.entryTitle}>{exp.role}</span>
                  <span style={styles.entryMeta}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: 13, color: "#4a5568", fontWeight: 600, marginBottom: 6 }}>{exp.company}</div>
                <div style={styles.entryDesc} dangerouslySetInnerHTML={{ __html: exp.description || "" }} />
              </div>
            ))}
          </section>
        )}

        {activeEdu.length > 0 && (
          <section>
            <div style={styles.mainSectionTitle}>Education</div>
            {activeEdu.map((edu, i) => (
              <div key={i} style={styles.entry}>
                <div style={styles.entryHeader}>
                  <span style={styles.entryTitle}>{edu.school}</span>
                  <span style={styles.entryMeta}>{edu.duration}</span>
                </div>
                <div style={styles.entryDesc}>{edu.degree}</div>
              </div>
            ))}
          </section>
        )}

        {activeProj.length > 0 && (
          <section>
            <div style={styles.mainSectionTitle}>Projects</div>
            {activeProj.map((proj, i) => (
              <div key={i} style={styles.entry}>
                <div style={styles.entryHeader}>
                  <span style={styles.entryTitle}>{proj.name}</span>
                  {proj.link && (
                    <a 
                      href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`} 
                      target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#63b3ed", textDecoration: "none" }}
                    >
                      {proj.label || "Link"}
                    </a>
                  )}
                </div>
                <div style={styles.entryDesc} dangerouslySetInnerHTML={{ __html: proj.description || "" }} />
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
