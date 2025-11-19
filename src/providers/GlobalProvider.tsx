"use client";

import { useState, useEffect } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import Loading from "@/components/Loading";
import Image from "next/image";

interface GlobalProviderProps {
  children: React.ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [resumeUploaded, setResumeUploaded] = useState<number | null>(null);
  const [ratingUploaded, setRatingUploaded] = useState<boolean>(false);
  const [resumesRated, setResumesRated] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbFailed, setDbFailed] = useState<boolean>(false);

  useEffect(() => {
    const storedResumeUploaded = localStorage.getItem("resumeUploaded");
    const storedRatingUploaded = localStorage.getItem("ratingUploaded");
    const storedResumesRated = localStorage.getItem("resumesRated");

    if (storedResumeUploaded) {
      setResumeUploaded(JSON.parse(storedResumeUploaded));
    }
    if (storedRatingUploaded) {
      setRatingUploaded(JSON.parse(storedRatingUploaded));
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
    localStorage.setItem("ratingUploaded", JSON.stringify(ratingUploaded));
  }, [ratingUploaded]);

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
        <Image
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
        ratingUploaded,
        resumesRated,
        dbFailed,
        setResumeUploaded,
        setRatingUploaded,
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
