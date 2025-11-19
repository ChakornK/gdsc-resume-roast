import { createContext } from "react";

interface GlobalContextType {
  resumeUploaded: number | null;
  ratingUploaded: boolean;
  resumesRated: string[];
  dbFailed: boolean;
  loading: boolean;
  setResumeUploaded: (uploaded: number) => void;
  setRatingUploaded: (uploaded: boolean) => void;
  setResumesRated: (rated: string[]) => void;
  setLoading: (loading: boolean) => void;
  setDbFailed: (failed: boolean) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);
