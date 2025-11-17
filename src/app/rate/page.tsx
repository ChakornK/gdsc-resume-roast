"use client";

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import { Resume } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Ratings {
  formatting: number;
  relevance: number;
  structure: number;
  clarity: number;
  wording: number;
}

const MINIMAL_RESUMES_TO_RATE = 5;
const RUBRICS = [
  "formatting",
  "relevance",
  "structure",
  "clarity",
  "wording",
] as (keyof Ratings)[];

export default function Rate() {
  const { resumeUploaded } = useGlobal();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rated, setRated] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    if (!resumeUploaded) {
      router.push("/");
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await axios.post("/api/resume/query", {
            id: resumeUploaded,
          });
          setResumes(res.data);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [resumeUploaded, router]);

  return (
    <main className="flex flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8 min-h-screen">
      <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
        Rate others' resumes!
      </div>

      {rated < Math.min(resumes.length, MINIMAL_RESUMES_TO_RATE) ? (
        <div className="mb-8 font-semibold md:text-md text-sm xl:text-lg text-center">
          You have to rate{" "}
          <span className="font-bold">
            {Math.min(resumes.length, MINIMAL_RESUMES_TO_RATE) - rated}
          </span>{" "}
          more resumes before proceeding.
        </div>
      ) : (
        <button
          type="button"
          onClick={() => (window.location.href = "/stats")}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 mb-6 px-6 py-2 rounded-lg text-white text-lg md:text-xl"
        >
          View Stats
        </button>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="gap-8 grid grid-cols-1 xl:grid-cols-2">
          {resumes.map((resume) => (
            <RateResumeCard
              key={resume.id}
              resume={resume}
              onRatingSubmitted={() => setRated((r) => r + 1)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function RateResumeCard({
  resume,
  onRatingSubmitted,
}: {
  resume: Resume;
  onRatingSubmitted: () => void;
}) {
  const [visible, setVisible] = useState<boolean>(true);
  const [ratings, setRatings] = useState<Partial<Ratings>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleRatingChange = useCallback(
    (rubric: keyof Ratings, value: number) => {
      setRatings({
        ...ratings,
        [rubric]: value,
      });
    },
    [ratings]
  );

  const handleRatingSubmit = useCallback(async () => {
    if (Object.keys(ratings).length < RUBRICS.length);
    setSubmitting(true);
    try {
      await axios.post("/api/review/new", {
        resumeId: resume.id,
        ...ratings,
      });
      setVisible(false);
      onRatingSubmitted();
    } catch {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }, [ratings]);

  return (
    visible && (
      <div
        key={resume.id}
        className="gap-4 grid grid-cols-1 md:grid-cols-2 bg-white shadow-md px-4 py-8 border rounded-lg"
      >
        <div className="flex flex-col justify-center items-center space-y-6">
          {RUBRICS.map((rubric: keyof Ratings) => (
            <div key={rubric} className="w-full text-center">
              <h4 className="font-medium text-lg capitalize">{rubric}</h4>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                  <button
                    key={star}
                    className={`cursor-pointer text-lg ${
                      ratings && (ratings[rubric as keyof Ratings] || 0) >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRatingChange(rubric, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <a href={resume.link} target="_blank" rel="noopener noreferrer">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                resume.link
              )}&embedded=true`}
              className="mb-4 border rounded-lg w-full h-80 object-cover"
              style={{ maxHeight: "1000px" }}
            />
          </a>
          <div className="flex flex-row space-x-4">
            <a
              href={resume.link}
              target="_blank"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white text-center"
            >
              Full PDF
            </a>
            <button
              className={`bg-blue-500 text-white py-2 px-6 rounded-lg ${
                Object.keys(ratings).length === RUBRICS.length
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleRatingSubmit}
              disabled={
                Object.keys(ratings).length !== RUBRICS.length || submitting
              }
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
