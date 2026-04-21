import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type HealthResponse = {
  status: string;
  timestamp: string;
  database: string;
};

export default function HealthPage() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<HealthResponse>("/api/health")
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Backend Health</h1>
      {loading && <p className="mt-4 text-gray-500">Checking…</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {data && (
        <pre className="mt-4 rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
