"use client";

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import { MINIMAL_RESUMES_TO_RATE } from "@/lib/consts";
import { ClientResume } from "@/lib/types";
import {
  mdiArrowRight,
  mdiChartBoxOutline,
  mdiOpenInNew,
  mdiSendVariantOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
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
      (async () => {
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
      })();
    }
  }, [resumeUploaded, router]);

  return (
    <main className="flex flex-col justify-center items-center p-8 min-h-screen">
      <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
        Rate other resumes!
      </div>

      {loading ? null : rawResumeNum < MINIMAL_RESUMES_TO_RATE ? (
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
          className="mb-8 text-lg md:text-xl btn primary-btn"
        >
          View stats
          <Icon path={mdiArrowRight} size="1em" />
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
  const [commentBoxHasFocus, setCommentBoxHasFocus] = useState<boolean>(false);
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
        className="flex flex-col items-center gap-4 bg-surface shadow-md p-8 rounded-3xl gap"
      >
        <div className="flex sm:flex-row flex-col gap-4 w-full">
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

        <div className="relative flex flex-col items-stretch w-full">
          <div className="h-0.5"></div>
          <p className={`absolute transition-all px-1`}>
            <span className="-top-2.5 left-2.5 absolute w-full h-full">
              <span
                className={`top-0 left-1/2 absolute bg-surface h-full transition-all -translate-x-1/2 ${
                  commentBoxHasFocus || comments.length > 0
                    ? "w-full ease-out"
                    : "w-0 ease-in"
                }`}
              ></span>
            </span>
            <span
              className={`relative transition-all ${
                commentBoxHasFocus
                  ? "text-primary text-sm -top-2.5 left-2.5"
                  : comments.length > 0
                  ? "text-sm -top-2.5 left-2.5"
                  : "text-outline-variant top-2.5 left-1.5"
              }`}
            >
              Comments
            </span>
          </p>
          <textarea
            className={`p-2 rounded outline-none min-h-32 resize-y ${
              commentBoxHasFocus
                ? "border-2 border-primary"
                : "border border-outline-variant"
            }`}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            onFocus={() => setCommentBoxHasFocus(true)}
            onBlur={() => setCommentBoxHasFocus(false)}
          />
        </div>

        <div className="flex flex-row space-x-4">
          <button
            onClick={() => window.open(resume.link)}
            className="btn primary-btn"
          >
            <Icon path={mdiOpenInNew} size="1em" />
            Open PDF in new tab
          </button>
          <button
            className={"btn primary-btn"}
            onClick={handleRatingSubmit}
            disabled={
              Object.keys(ratings).length !== RUBRICS.length ||
              !comments ||
              submitting
            }
          >
            <Icon path={mdiSendVariantOutline} size="1em" />
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    )
  );
}
