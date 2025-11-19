import { createContext } from "react";

interface GlobalContextType {
  resumeUploaded: number | null;
  resumesRated: string[];
  dbFailed: boolean;
  loading: boolean;
  setResumeUploaded: (uploaded: number) => void;
  setResumesRated: (rated: string[]) => void;
  setLoading: (loading: boolean) => void;
  setDbFailed: (failed: boolean) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);
