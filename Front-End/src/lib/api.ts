import { useAuth } from "@clerk/react";
import { env } from "@/config/env";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(`${env.API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message ?? `Request failed: ${response.status}`);
  }

  return response.json();
}

export function useApi() {
  const { getToken } = useAuth();

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body } = options;
    const token = await getToken();

    const response = await fetch(`${env.API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody?.error?.message ?? `Request failed: ${response.status}`);
    }

    return response.json();
  }

  return { request };
}
