import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { env } from "@/config/env";

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

  useEffect(() => {
    async function fetchCVs() {
      try {
        const res = await fetch(`${env.API_URL}/api/users/me/cvs`, {
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (json.status === "success") {
          setCvs(json.data || []);
        } else {
          setError(json.error || "Failed to fetch CVs");
        }
      } catch (e) {
        setError("Failed to fetch CVs");
      } finally {
        setLoading(false);
      }
    }
    fetchCVs();
  }, []);

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
            <Link
              key={cv.id}
              to={`/cv-builder?id=${cv.id}`}
              style={{
                display: "block",
                padding: 16,
                background: "#fff",
                border: "0.5px solid rgba(0,0,0,0.1)",
                borderRadius: 10,
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
          ))}
        </div>
      )}
    </div>
  );
}