"use client";

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import { generatePDF } from "@/lib/pdf";
import { ReviewStats } from "@/lib/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiArrowRight, mdiOpenInNew, mdiTrayArrowDown } from "@mdi/js";
import { MINIMAL_RESUMES_TO_RATE } from "@/lib/consts";
import { Paginator } from "@/components/Paginator";

const MAX_PER_PAGE = 16;

let refreshTimer = 0;
export default function Stats() {
  const [reviewStats, setReviewStats] = useState<ReviewStats[][]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selfResume, setSelfResume] = useState<ReviewStats | null>(null);
  const { resumeUploaded, resumesRated, setDbFailed } = useGlobal();
  const router = useRouter();

  const fetchReviews = async (isRefresh = false) => {
    try {
      const res = await axios.post("/api/review/aggregate", {
        id: resumeUploaded,
      });
      const mine = res.data.find((r: ReviewStats) => r.self === true);
      if (mine) setSelfResume(mine);
      const arranged = mine
        ? [mine, ...res.data.filter((r: ReviewStats) => r.self === false)]
        : res.data;

      if (!isRefresh || (isRefresh && mine)) {
        setReviewStats(
          Array.from(
            { length: Math.ceil(arranged.length / MAX_PER_PAGE) },
            (_, i) =>
              arranged.slice(i * MAX_PER_PAGE, i * MAX_PER_PAGE + MAX_PER_PAGE)
          )
        );
      }
      setLoading(false);
    } catch {
      setDbFailed(true);
    }
  };

  useEffect(() => {
    if (!resumeUploaded) {
      router.push("/");
    } else if (resumesRated.length < MINIMAL_RESUMES_TO_RATE) {
      router.push("/rate");
    } else {
      fetchReviews();
    }
  }, []);

  useEffect(() => {
    if (refreshTimer === 0) {
      refreshTimer = setInterval(fetchReviews, 10000) as never as number;
    }
  }, []);
  useEffect(() => {
    if (selfResume) {
      try {
        clearInterval(refreshTimer);
      } catch {}
      refreshTimer = 0;
    }
  }, [selfResume]);

  return (
    <main className="flex flex-col justify-center items-center p-8 min-h-screen">
      <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
        Resume statistics
      </div>
      {!loading && (
        <div className="mb-8 font-semibold md:text-md text-sm xl:text-lg text-center">
          {selfResume
            ? "The highlighted resume is yours!"
            : "No ratings for your resume yet"}
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        reviewStats.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => router.push("/rate")}
              className="mb-8 text-lg md:text-xl btn primary-btn"
            >
              Rate more resumes
              <Icon path={mdiArrowRight} size="1em" />
            </button>
            <Paginator
              n={reviewStats.length}
              current={currentPage}
              setCurrent={setCurrentPage}
            />
            <div className="place-self-stretch gap-8 grid grid-cols-1 lg:grid-cols-2 my-8">
              {reviewStats[currentPage].map((resume) => (
                <ReviewStatCard key={resume.resumeLink} r={resume} />
              ))}
            </div>
            <Paginator
              n={reviewStats.length}
              current={currentPage}
              setCurrent={setCurrentPage}
            />
          </>
        )
      )}
    </main>
  );
}

const ReviewStatCard = ({ r }: { r: ReviewStats }) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);

  return (
    <div
      className={`${
        r.self ? "border-primary border-4" : ""
      } p-8 rounded-3xl shadow-md bg-surface`}
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
                }: ${calc.toPrecision(2)} / 5.0`}</h4>
                <div className="bg-gray-300 m-auto rounded-full w-full max-w-xs h-2.5">
                  <div
                    className="rounded-full h-2.5"
                    style={{
                      width: `${calc_p}%`,
                      background:
                        calc > 4
                          ? "#00bc7d"
                          : calc > 2.5
                          ? "#f0b100"
                          : "#fb2c36",
                    }}
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
        </div>
      </div>

      <div className="flex sm:flex-row flex-col items-stretch gap-2 mt-4">
        <button
          onClick={() => window.open(r.resumeLink)}
          className="btn primary-btn grow"
        >
          <Icon path={mdiOpenInNew} size="1em" />
          Open PDF in new tab
        </button>
        {r.self && (
          <button
            onClick={() => {
              (async () => {
                setGeneratingPdf(true);
                try {
                  const url = await generatePDF(r);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Resume roast summary.pdf";
                  a.click();
                } catch {}
                setGeneratingPdf(false);
              })();
            }}
            className="btn filled-btn grow"
            disabled={generatingPdf}
          >
            <Icon path={mdiTrayArrowDown} size="1em" />
            {generatingPdf ? "Generating PDF..." : "Download summary"}
          </button>
        )}
      </div>

      <div className="flex flex-col items-stretch gap-2 mt-4 w-full">
        <h4 className="font-medium text-lg">Comments</h4>
        <div className="space-y-2">
          {r.comments.map((c, i) => (
            <p
              key={i}
              className="bg-gray-100 px-4 py-2 rounded-xl wrap-break-word"
            >
              {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
