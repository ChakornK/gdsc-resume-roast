"use client";

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import axios from "axios";
import { useEffect, useState } from "react";

interface ReviewStats {
  resumeId: number;
  _avg: {
    structure: number;
    clarity: number;
    formatting: number;
    relevance: number;
    wording: number;
  };
  _count: {
    id: number;
  };
  comments: string[];
  resumeLink: string;
  reviewCount: number;
  self: boolean;
}

const ReviewStatCard = ({ r, self }: { r: ReviewStats; self: boolean }) => {
  return (
    <div
      className={`${
        self ? "border-blue-400 border-4" : "border"
      } px-4 py-8 rounded-xl shadow-md bg-white`}
    >
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
        <div className="flex flex-col justify-center items-center space-y-6 mb-6 xl:mb-0">
          {Object.keys(r._avg).map((k, i) => {
            const calc = r._avg[k as keyof ReviewStats["_avg"]];
            const calc_p = calc * 20;
            return (
              <div key={i} className="space-y-4 w-[80%] text-center">
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
        </div>

        <div className="flex flex-col items-center space-y-4">
          <iframe
            src={r.resumeLink}
            className="border rounded-lg w-full h-full min-h-80 object-cover"
          />
          <div className="flex flex-row space-x-2">
            <a
              href={r.resumeLink}
              target="_blank"
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white text-center"
            >
              Open PDF in new tab
            </a>
          </div>
          <h4 className="font-medium text-lg">Total Ratings: {r._count.id}</h4>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 mt-4 md:px-4 w-full">
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
          onClick={() => (window.location.href = "/")}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 mb-6 px-6 py-2 rounded-lg text-white text-lg md:text-xl"
        >
          Upload a Resume
        </button>
      )}
      {loading ? (
        <Loading />
      ) : (
        <div className="gap-8 grid grid-cols-1 xl:grid-cols-2">
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
