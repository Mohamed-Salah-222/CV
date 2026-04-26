import { useState, useRef, useCallback, useEffect } from "react";
import type { templateTypes } from "@cv/types";
import { useCVService } from "./useCVService";

type CVData = templateTypes.CVData;

interface DefaultCVData {
  header: { links: { label: string; url: string }[] };
  personal: { fullName: string; email: string; phone: string; location: string; summary: string };
  experience: { company: string; role: string; duration: string; description: string }[];
  education: { school: string; degree: string; duration: string }[];
  skills: string[];
  projects: { name: string; description: string; link: string }[];
}

const defaultCVData: DefaultCVData = {
  header: { links: [] },
  personal: { fullName: "", email: "", phone: "", location: "", summary: "" },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export function useCVData(options?: { autoSave?: boolean; autoSaveDelay?: number }) {
  const autoSaveDelay = options?.autoSaveDelay ?? 1500;
  const autoSaveEnabled = options?.autoSave ?? true;

  const [cvData, setCVData] = useState<CVData>(defaultCVData as CVData);
  const [currentCVId, setCurrentCVId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentCVIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { fetchCV, createCV, updateCV } = useCVService();

  const loadCV = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCV(id);
      if (data) {
        setCVData(data);
        setCurrentCVId(id);
        currentCVIdRef.current = id;
        // Return the templateId if present
        return data.templateId;
      }
    } catch (e) {
      console.error("Failed to load CV:", e);
    } finally {
      setIsLoading(false);
    }
    return undefined;
  }, [fetchCV]);

  const doSave = useCallback(async (data: CVData) => {
    setSaving(true);
    try {
      const id = currentCVIdRef.current;
      if (id) {
        await updateCV(id, data);
      } else {
        const newId = await createCV(data);
        if (newId) {
          setCurrentCVId(newId);
          currentCVIdRef.current = newId;
          window.history.replaceState(null, "", `?id=${newId}`);
        }
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  }, [createCV, updateCV]);

  const handleSave = useCallback((dataOverride?: CVData) => {
    doSave(dataOverride || cvData);
  }, [doSave, cvData]);

  const scheduleAutoSave = useCallback((data: CVData) => {
    if (!autoSaveEnabled) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      doSave(data);
    }, autoSaveDelay);
  }, [autoSaveEnabled, autoSaveDelay, doSave]);

  const updateField = useCallback(<K extends keyof CVData>(field: K, value: CVData[K]) => {
    setCVData(prev => ({ ...prev, [field]: value }));
  }, []);

  // URL param loading
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      // Mark as initialized before loading - we'll save after load completes
      hasInitializedRef.current = true;
      loadCV(id);
    } else {
      setIsLoading(false);
    }
  }, [loadCV]);

  // Auto-save when data changes (debounced) - but skip the first save after loading
  const isInitialLoadRef = useRef(true);
  useEffect(() => {
    if (isLoading) return;
    if (!currentCVIdRef.current) return;
    
    // Skip the very first trigger after loading an existing CV
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }
    
    scheduleAutoSave(cvData);
  }, [cvData, isLoading, scheduleAutoSave]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    cvData,
    setCVData,
    updateField,
    currentCVId,
    saving,
    lastSaved,
    isLoading,
    handleSave,
    loadCV,
  };
}