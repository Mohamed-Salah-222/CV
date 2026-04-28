import { useAuth } from "@clerk/react";
import { useCallback } from "react";
import * as cvApi from "../services/cv.service";
import type { templateTypes } from "@cv/types";
import { toast } from "sonner";

type CVData = templateTypes.CVData;

export interface AICVResponse {
  cvData: CVData;
  suggestions: Record<string, string[]>;
}

export function useCVService() {
  const { getToken, isSignedIn } = useAuth();

  const fetchCVs = useCallback(async () => {
    console.log("useCVService fetchCVs - isSignedIn:", isSignedIn);
    const token = await getToken();
    console.log("useCVService - token:", token ? "exists" : "null", token?.substring(0, 30) ?? "");
    if (!token) return [];
    return cvApi.fetchCVsRequest(token);
  }, [getToken, isSignedIn]);

  const fetchCV = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return null;
    return cvApi.fetchCVRequest(id, token);
  }, [getToken]);

  const createCV = useCallback(async (cvData: CVData, title?: string) => {
    const token = await getToken();
    if (!token) return null;
    return cvApi.createCVRequest(cvData, token, title);
  }, [getToken]);

  const updateCV = useCallback(async (id: string, cvData: CVData, title?: string) => {
    const token = await getToken();
    if (!token) return;
    return cvApi.updateCVRequest(id, cvData, token, title);
  }, [getToken]);

  const deleteCV = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    return cvApi.deleteCVRequest(id, token);
  }, [getToken]);

  const generateCV = useCallback(async (rawText: string): Promise<AICVResponse | null> => {
    const token = await getToken();
    if (!token) return null;
    return cvApi.generateCVRequest(token, rawText);
  }, [getToken]);

  const duplicateCV = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return null;
    return cvApi.duplicateCVRequest(id, token);
  }, [getToken]);

  const improveField = useCallback(async (fieldType: string, currentText: string, context?: string) => {
    const token = await getToken();
    if (!token) return null;
    return cvApi.improveFieldRequest(token, fieldType, currentText, context);
  }, [getToken]);

  const parseCV = useCallback(async (rawText: string): Promise<AICVResponse | null> => {
    const token = await getToken();
    if (!token) return null;
    return cvApi.parseCVRequest(token, rawText);
  }, [getToken]);

  return {
    fetchCVs,
    fetchCV,
    createCV,
    updateCV,
    deleteCV,
    generateCV,
    duplicateCV,
    improveField,
    parseCV,
  };
}