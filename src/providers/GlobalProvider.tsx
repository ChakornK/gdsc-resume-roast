"use client";

import { useState, useEffect } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import Loading from "@/components/Loading";

interface GlobalProviderProps {
  children: React.ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [resumeUploaded, setResumeUploaded] = useState<number | null>(null);
  const [resumesRated, setResumesRated] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbFailed, setDbFailed] = useState<boolean>(false);

  useEffect(() => {
    const storedResumeUploaded = localStorage.getItem("resumeUploaded");
    const storedResumesRated = localStorage.getItem("resumesRated");

    if (storedResumeUploaded) {
      setResumeUploaded(JSON.parse(storedResumeUploaded));
    }
    if (storedResumesRated) {
      setResumesRated(JSON.parse(storedResumesRated));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (resumeUploaded !== null) {
      localStorage.setItem("resumeUploaded", JSON.stringify(resumeUploaded));
    }
  }, [resumeUploaded]);

  useEffect(() => {
    localStorage.setItem("resumesRated", JSON.stringify(resumesRated));
  }, [resumesRated]);

  if (loading) {
    return (
      <main className="flex flex-col justify-center items-center p-8 min-h-screen">
        <Loading />
      </main>
    );
  }

  if (dbFailed) {
    return (
      <main className="flex flex-col justify-center items-center p-8 min-h-screen">
        <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
          Service Unavailable
        </div>
        <div className="mb-8 font-semibold md:text-md text-sm xl:text-lg text-center">
          We apologize for the inconvenience, please try again later!
        </div>
        <img
          src={"/logo.svg"}
          alt="GDSC"
          width={200}
          height={200}
          className="aspect-square"
        />
      </main>
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        resumeUploaded,
        resumesRated,
        dbFailed,
        setResumeUploaded,
        setResumesRated,
        setLoading,
        setDbFailed,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
