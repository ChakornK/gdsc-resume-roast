"use client";

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import { ClientResume } from "@/lib/types";
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
  const { resumeUploaded, resumesRated } = useGlobal();
  const [resumes, setResumes] = useState<ClientResume[]>([]);
  const [rawResumeNum, setRawResumeNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [rated, setRated] = useState<number>(resumesRated.length);

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
          setRawResumeNum(res.data.length);
          setResumes(
            res.data.filter((r: ClientResume) => !resumesRated.includes(r.link))
          );
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

      {rawResumeNum < MINIMAL_RESUMES_TO_RATE ? (
        <div className="mb-8 font-semibold md:text-md text-sm xl:text-lg text-center">
          Please wait until more resumes are available.
        </div>
      ) : rated < MINIMAL_RESUMES_TO_RATE ? (
        <div className="mb-8 font-semibold md:text-md text-sm xl:text-lg text-center">
          You have to rate{" "}
          <span className="font-bold">{MINIMAL_RESUMES_TO_RATE - rated}</span>{" "}
          more resume
          {Math.min(MINIMAL_RESUMES_TO_RATE, resumes.length) - rated == 1
            ? ""
            : "s"}{" "}
          before proceeding.
        </div>
      ) : (
        <button
          type="button"
          onClick={() => router.push("/stats")}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 mb-6 px-6 py-2 rounded-lg text-white text-lg md:text-xl"
        >
          View stats
        </button>
      )}

      {loading ? (
        <Loading />
      ) : rawResumeNum < MINIMAL_RESUMES_TO_RATE ? null : (
        <div className="place-self-stretch gap-8 grid grid-cols-1 lg:grid-cols-2">
          {resumes.map((resume) => (
            <RateResumeCard
              key={resume.link}
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
  resume: ClientResume;
  onRatingSubmitted: () => void;
}) {
  const [visible, setVisible] = useState<boolean>(true);
  const [ratings, setRatings] = useState<Partial<Ratings>>({});
  const [comments, setComments] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { resumesRated, setResumesRated } = useGlobal();

  const handleRatingChange = useCallback(
    (rubric: keyof Ratings, value: number) => {
      setRatings({
        ...ratings,
        [rubric]: value,
      });
    },
    [ratings]
  );

  const handleRatingSubmit = async () => {
    if (Object.keys(ratings).length < RUBRICS.length) return;
    if (!comments) return;
    setSubmitting(true);
    try {
      await axios.post("/api/review/new", {
        resumeLink: resume.link,
        ...ratings,
        comments,
      });
      setVisible(false);
      onRatingSubmitted();
      setResumesRated([...resumesRated, resume.link]);
    } catch {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    visible && (
      <div
        key={resume.link}
        className="flex flex-col items-center gap-4 bg-white shadow-md px-4 py-8 border rounded-xl gap"
      >
        <div className="flex sm:flex-row flex-col gap-4">
          <div className="flex flex-col justify-center items-center space-y-6 mb-6 xl:mb-0 sm:w-2/5 shrink-0">
            {RUBRICS.map((rubric: keyof Ratings) => (
              <div key={rubric} className="w-full text-center">
                <h4 className="font-medium text-lg capitalize">{rubric}</h4>
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                    <button
                      key={star}
                      className={`cursor-pointer text-lg ${
                        ratings &&
                        (ratings[rubric as keyof Ratings] || 0) >= star
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

          <div className="flex flex-col items-center w-full min-w-3xs">
            <iframe
              src={resume.link}
              className="border rounded-lg w-full h-full min-h-80 object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-stretch md:px-4 w-full">
          <h4 className="mb-2 px-1 font-medium text-lg">Comments</h4>
          <textarea
            className="p-2 border rounded-lg min-h-32 resize-y"
            placeholder="Write your comments here..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div className="flex flex-row space-x-4">
          <button
            onClick={() => window.open(resume.link)}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white text-center"
          >
            Open PDF in new tab
          </button>
          <button
            className={`bg-blue-500 text-white py-2 px-6 rounded-lg ${
              Object.keys(ratings).length === RUBRICS.length && comments
                ? "cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleRatingSubmit}
            disabled={
              Object.keys(ratings).length !== RUBRICS.length ||
              !comments ||
              submitting
            }
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    )
  );
}
