"use client";

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import { generatePDF } from "@/lib/pdf";
import { ReviewStats } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ReviewStatCard = ({ r, self }: { r: ReviewStats; self: boolean }) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  return (
    <div
      className={`${
        self ? "border-blue-400 border-4" : ""
      } p-8 rounded-xl shadow-md bg-white`}
    >
      <div className="flex sm:flex-row flex-col gap-4">
        <div className="flex flex-col justify-center items-center space-y-6 mb-6 xl:mb-0 sm:w-2/5 shrink-0">
          {Object.keys(r._avg).map((k, i) => {
            const calc = r._avg[k as keyof ReviewStats["_avg"]];
            const calc_p = calc * 20;
            return (
              <div key={i} className="space-y-2 w-full text-center">
                <h4 className="font-medium text-lg">{`${
                  k.charAt(0).toUpperCase() + k.slice(1)
                }: ${calc.toPrecision(2)} / 5`}</h4>
                <div className="bg-gray-300 rounded-full w-full h-2.5">
                  <div
                    className={`${
                      calc > 4
                        ? "bg-green-600"
                        : calc > 2.5
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }  h-2.5 rounded-full`}
                    style={{ width: `${calc_p}%` }}
                  />
                </div>
              </div>
            );
          })}
          <h4 className="font-medium text-lg">Total Ratings: {r._count.id}</h4>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full min-w-3xs">
          <iframe
            src={r.resumeLink}
            className="border rounded-lg w-full h-full min-h-80 object-cover"
          />
          <div className="flex flex-row space-x-2">
            <button
              onClick={() => window.open(r.resumeLink)}
              className="btn primary-btn"
            >
              Open PDF in new tab
            </button>
            <button
              onClick={() => {
                (async () => {
                  setGeneratingPdf(true);
                  try {
                    const url = await generatePDF(r);
                    window.open(url);
                  } catch {}
                  setGeneratingPdf(false);
                })();
              }}
              className="primary-btn btn"
              disabled={generatingPdf}
            >
              {generatingPdf ? "Generating PDF..." : "Download summary"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 mt-4 w-full">
        <h4 className="font-medium text-lg">Comments</h4>
        <div className="space-y-2">
          {r.comments.map((c, i) => (
            <p
              key={i}
              className="bg-gray-100 px-4 py-2 rounded-xl rounded-tl-none wrap-break-word"
            >
              {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Stats() {
  const [reviewStats, setReviewStats] = useState<ReviewStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { resumeUploaded } = useGlobal();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/review/aggregate", {
          id: resumeUploaded,
        });
        setReviewStats(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const selfResume = resumeUploaded
    ? reviewStats?.find((r) => r.self === true)
    : null;

  return (
    <main className="flex flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8 min-h-screen">
      <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
        Resume Statistics
      </div>
      {resumeUploaded ? (
        <div className="mb-8 font-semibold md:text-md text-sm xl:text-lg text-center">
          {selfResume
            ? "The highlighted resume is yours!"
            : "No ratings for your resume yet"}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 text-lg md:text-xl btn primary-btn"
        >
          Upload a resume
        </button>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
          {selfResume && <ReviewStatCard key={0} r={selfResume} self={true} />}
          {reviewStats
            ?.filter((r) => r.resumeId != resumeUploaded)
            .map((r, i) => (
              <ReviewStatCard key={i + 1} r={r} self={false} />
            ))}
        </div>
      )}
    </main>
  );
}
