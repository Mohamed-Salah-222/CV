import type { templateTypes } from "@cv/types";

type CVData = templateTypes.CVData;

export interface AICVResponse {
  cvData: CVData;
  suggestions: Record<string, string[]>;
}

export async function fetchCVsRequest(token: string): Promise<AICVResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/users/me/cvs`, { headers });
  const json = await res.json();
  if (json.status === "success") return json.data;
  throw new Error(json.error || "Failed to fetch CVs");
}

export async function fetchCVRequest(id: string, token: string): Promise<CVData | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/users/me/cvs/${id}`, { headers });
  const json = await res.json();
  if (json.status === "success" && json.data?.data) return json.data.data as CVData;
  return null;
}

export async function createCVRequest(cvData: CVData, token: string, title?: string): Promise<string | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/users/me/cvs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      template_id: "default",
      title: (title ?? cvData.personal.fullName) || "Untitled CV",
      data: cvData,
    }),
  });
  const json = await res.json();
  return json.data?.id ?? null;
}

export async function updateCVRequest(id: string, cvData: CVData, token: string, title?: string): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  await fetch(`/api/users/me/cvs/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      title: (title ?? cvData.personal.fullName) || "Untitled CV",
      data: cvData,
    }),
  });
}

export async function deleteCVRequest(id: string, token: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  await fetch(`/api/users/me/cvs/${id}`, {
    method: "DELETE",
    headers,
  });
}

export async function generateCVRequest(token: string, rawText: string): Promise<AICVResponse | null> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/ai/generate-cv`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rawText }),
  });
  const json = await res.json();
  if (json.status === "success" && json.data) {
    return json.data;
  }
  return null;
}
