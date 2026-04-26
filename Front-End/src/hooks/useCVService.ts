import { useAuth } from "@clerk/react";
import { useCallback } from "react";
import * as cvApi from "./cv.service";
import type { templateTypes } from "@cv/types";

type CVData = templateTypes.CVData;

export interface AICVResponse {
  cvData: CVData;
  suggestions: Record<string, string[]>;
}

export function useCVService() {
  const { getToken } = useAuth();

  const fetchCVs = useCallback(async () => {
    const token = await getToken();
    return cvApi.fetchCVsRequest(token ?? "");
  }, [getToken]);

  const fetchCV = useCallback(async (id: string) => {
    const token = await getToken();
    return cvApi.fetchCVRequest(id, token ?? "");
  }, [getToken]);

  const createCV = useCallback(async (cvData: CVData, title?: string) => {
    const token = await getToken();
    return cvApi.createCVRequest(cvData, token ?? "", title);
  }, [getToken]);

  const updateCV = useCallback(async (id: string, cvData: CVData, title?: string) => {
    const token = await getToken();
    return cvApi.updateCVRequest(id, cvData, token ?? "", title);
  }, [getToken]);

  const deleteCV = useCallback(async (id: string) => {
    const token = await getToken();
    return cvApi.deleteCVRequest(id, token ?? "");
  }, [getToken]);

  const generateCV = useCallback(async (rawText: string): Promise<AICVResponse | null> => {
    const token = await getToken();
    return cvApi.generateCVRequest(token ?? "", rawText);
  }, [getToken]);

  return {
    fetchCVs,
    fetchCV,
    createCV,
    updateCV,
    deleteCV,
    generateCV,
  };
}