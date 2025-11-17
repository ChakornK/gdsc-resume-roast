import { createContext, useContext, useState } from "react";

interface GlobalContextType {
  resumeUploaded: number | null;
  ratingUploaded: boolean;
  resumesRated: number[];
  loading: boolean;
  setResumeUploaded: (uploaded: number) => void;
  setRatingUploaded: (uploaded: boolean) => void;
  setResumesRated: (rated: number[]) => void;
  setLoading: (loading: boolean) => void;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);
