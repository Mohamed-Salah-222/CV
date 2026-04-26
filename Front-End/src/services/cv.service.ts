import type { templateTypes } from "@cv/types";

type CVData = templateTypes.CVData;

export interface AICVResponse {
  cvData: CVData;
  suggestions: Record<string, string[]>;
}

export async function fetchCVs(): Promise<any> {
  const res = await fetch(`/api/users/me/cvs`, { credentials: "include" });
  const json = await res.json();
  if (json.status === "success") return json.data;
  throw new Error(json.error || "Failed to fetch CVs");
}

export async function fetchCV(id: string): Promise<CVData | null> {
  const res = await fetch(`/api/users/me/cvs/${id}`, { credentials: "include" });
  const json = await res.json();
  if (json.status === "success" && json.data?.data) return json.data.data as CVData;
  return null;
}

export async function createCV(cvData: CVData, title?: string): Promise<string | null> {
  const res = await fetch(`/api/users/me/cvs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      template_id: "default",
      title: title ?? cvData.personal.fullName || "Untitled CV",
      data: cvData,
    }),
  });
  const json = await res.json();
  return json.data?.id ?? null;
}

export async function updateCV(id: string, cvData: CVData, title?: string): Promise<void> {
  await fetch(`/api/users/me/cvs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: title ?? cvData.personal.fullName || "Untitled CV",
      data: cvData,
    }),
  });
}

export async function deleteCV(id: string): Promise<void> {
  await fetch(`/api/users/me/cvs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function generateCVFromAI(rawText: string): Promise<AICVResponse | null> {
  const res = await fetch(`/api/ai/generate-cv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rawText }),
  });
  const json = await res.json();
  if (json.status === "success" && json.data) {
    return json.data;
  }
  return null;
}