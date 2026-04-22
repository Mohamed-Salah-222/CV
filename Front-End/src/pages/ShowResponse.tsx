import { useState } from "react";
import { apiFetch } from "@/lib/api";
// import { AISuggestion } from "@cv/types";


export default function ShowResponse() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleClick() {
    setLoading(true);
    try {
      const res = await apiFetch<any>("/api/ai/suggest");
      setData(res);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">AI suggestion</h1>
      <p className="mt-4 text-gray-500">
        This is a demo of the AI suggestion API. It uses ai to generate a response based on the input text.
      </p>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Generate suggestion
      </button>
      {loading && <p className="mt-4 text-gray-500">Generating…</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {data && (
        <pre className="mt-4 rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
