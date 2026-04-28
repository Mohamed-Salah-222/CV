import type { templateTypes } from "@cv/types";
import { env } from "@/config/env";

type CVData = templateTypes.CVData;

export interface AICVResponse {
  cvData: CVData;
  suggestions?: Record<string, string[]>;
  cvId?: string;
}

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseJSON(res: Response): Promise<any> {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    throw new Error(`Expected JSON but got ${ct} (status ${res.status})`);
  }
  return res.json();
}

export async function fetchCVsRequest(token: string): Promise<any> {
  if (!token) return [];

  const res = await fetch(`${env.API_URL}/api/users/me/cvs`, {
    headers: authHeaders(token),
  });
  if (!res.ok) return [];

  const json = await parseJSON(res);
  if (json.status === "success") return json.data;
  return [];
}

export async function fetchCVRequest(id: string, token: string): Promise<CVData | null> {
  if (!token) return null;

  const res = await fetch(`${env.API_URL}/api/users/me/cvs/${id}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) return null;

  const json = await parseJSON(res);
  if (json.status === "success" && json.data?.data) return json.data.data as CVData;
  return null;
}

export async function createCVRequest(cvData: CVData, token: string, title?: string): Promise<string | null> {
  if (!token) return null;

  const res = await fetch(`${env.API_URL}/api/users/me/cvs`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      template_id: "default",
      title: (title ?? cvData.personal.fullName) || "Untitled CV",
      data: cvData,
    }),
  });
  if (!res.ok) return null;

  const json = await parseJSON(res);
  return json.data?.id ?? null;
}

export async function updateCVRequest(id: string, cvData: CVData, token: string, title?: string): Promise<void> {
  if (!token) return;

  await fetch(`${env.API_URL}/api/users/me/cvs/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({
      title: (title ?? cvData.personal.fullName) || "Untitled CV",
      data: cvData,
    }),
  });
}

export async function deleteCVRequest(id: string, token: string): Promise<void> {
  if (!token) return;

  await fetch(`${env.API_URL}/api/users/me/cvs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function generateCVRequest(token: string, rawText: string): Promise<AICVResponse | null> {
  if (!token) return null;

  const res = await fetch(`${env.API_URL}/api/ai/generate-cv`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ rawText }),
  });
  if (!res.ok) return null;

  const json = await parseJSON(res);
  if (json.status === "success" && json.data) return json.data;
  return null;
}

export async function duplicateCVRequest(id: string, token: string): Promise<string | null> {
  if (!token) return null;

  const res = await fetch(`${env.API_URL}/api/users/me/cvs/${id}/duplicate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const json = await parseJSON(res);
  return json.data?.id ?? null;
}

export interface ImproveFieldResponse {
  improvements: { text: string; reasoning: string }[];
}

export async function parseCVRequest(token: string, rawText: string): Promise<AICVResponse | null> {
  if (!token) return null;

  const res = await fetch(`${env.API_URL}/api/ai/parse-cv`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ rawText }),
  });
  if (!res.ok) return null;

  const json = await parseJSON(res);
  if (json.status === "success" && json.data) return json.data;
  return null;
}
export async function improveFieldRequest(
  token: string,
  fieldType: string,
  currentText: string,
  context?: string
): Promise<ImproveFieldResponse | null> {
  if (!token) return null;

  const res = await fetch(`${env.API_URL}/api/ai/improve-field`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ fieldType, currentText, context }),
  });
  if (!res.ok) return null;

  const json = await parseJSON(res);
  if (json.status === "success" && json.data) return json.data;
  return null;
}
