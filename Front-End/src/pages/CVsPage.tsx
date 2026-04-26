import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCVService } from "@/hooks/useCVService";

interface CV {
  id: string;
  title: string;
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CVsPage() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const { fetchCVs, deleteCV, duplicateCV } = useCVService();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;
    try {
      await deleteCV(id);
      setCvs(cvs.filter((cv) => cv.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete CV");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const newId = await duplicateCV(id);
      if (newId) {
        setCvs(cvs.map((cv) => cv)); // Refresh list
      }
    } catch (e: any) {
      alert(e.message || "Failed to duplicate CV");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 500 }}>My CVs</h1>
        <Link
          to="/cv-builder"
          style={{
            padding: "8px 16px",
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          + New CV
        </Link>
      </div>

      {cvs.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
          No CVs yet. Create your first one!
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {cvs.map((cv) => (
            <div
              key={cv.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.1)",
                borderRadius: 10,
              }}
            >
              <Link
                to={`/cv-builder?id=${cv.id}`}
                style={{
                  flex: 1,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  {cv.title || "Untitled CV"}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  Last updated: {new Date(cv.updatedAt).toLocaleString()}
                </div>
              </Link>
              <button
                onClick={() => handleDelete(cv.id)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "0.5px solid rgba(0,0,0,0.1)",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => handleDuplicate(cv.id)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "0.5px solid rgba(0,0,0,0.1)",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                Duplicate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}