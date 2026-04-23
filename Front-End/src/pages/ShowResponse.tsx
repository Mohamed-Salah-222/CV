import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Spectre } from "@/lib/spectre";
import { apiFetch } from "@/lib/api";
// import { AISuggestion } from "@cv/types";


export default function ShowResponse() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const elementRef = useRef(null);
  const responseElementRef = useRef(null);
  const spectre = useMemo(() => new Spectre(), []);

  function handleClickAccept() {
    spectre.accept("response1");
    spectre.accept("response2");
    return;
  }

  function handleResponse(response: any) {
    const content = new Map([["response1", "value1"], ["response2", "value2"]]);
    spectre.mount(content);
    return;
  }

  function useSpectreRef(rule) {
    const idRef = useRef(crypto.randomUUID());

    return useCallback((el) => {
      if (!el) return;

      // const ref = { id: idRef.current, element: el };
      spectre.register(rule, el);

      return () => {
        spectre.unregister(rule);
      };
    }, [rule]);
  }

  async function handleClick() {
    setLoading(true);
    try {
      // const res = await apiFetch<any>("/api/ai/suggest");
      const res = "Place Holder response";

      handleResponse(res);
      setData(res);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  // HACK: this effectively how we do this we just need to find a better way to capture all refs only once, when the component is mounted
  // we then pass the refs in an asscociative array to the spectre lib
  // const spectre = new Spectre(*args);
  // spectre.init();
  useEffect(() => {
    console.log("respose ref: ", responseElementRef);
    console.log("element refref: ", elementRef);

    if (responseElementRef.current && data) {
      console.log("setting ref: ", responseElementRef.current);
      responseElementRef.current.value = data;

    }
    // Accessible here after mount
    if (elementRef.current) {
      // const id = spectre.addRef(elementRef.current);
      // spectre.style({ id :id, style: spectreStyle  });
      setTimeout(() => {
        console.log("setting ref");
        elementRef.current.textContent = "Clicked!";
      }, 1000);
      return () => {
        console.log("removing ref");
      };
    }
  }, []);


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

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        ref={useSpectreRef("click")}
        onClick={handleClickAccept}
      >
        Try me
      </button>

      {loading && <p className="mt-4 text-gray-500">Generating…</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      {data && (
        <pre className="mt-4 rounded bg-gray-100 p-4 text-sm"
        >
          {data}
        </pre>
      )}

      <input className="mt-4 rounded bg-gray-100 p-4 text-sm" ref={useSpectreRef("response1")} />
      <input ref={useSpectreRef("response2")} className="mt-4 rounded bg-gray-100 p-4 text-sm" />
    </div>

  );
}
