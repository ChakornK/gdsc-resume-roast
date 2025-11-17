'use client'

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
    resumeLink: string;
    reviewCount: number;
}

const ReviewStatCard = ({ r, self }: { r: ReviewStats, self: boolean }) => {
    return (
        <div className={`${self ? 'border-black border-4' : 'border'} px-4 py-8 rounded-lg shadow-md bg-white grid grid-cols-1 xl:grid-cols-2 gap-4`}>
            <div className="flex flex-col space-y-6 justify-center items-center xl:mb-0 mb-6">
                {Object.keys(r._avg).map((k, i) => {
                    const calc = r._avg[k as keyof ReviewStats["_avg"]];
                    const calc_p = calc * 20;
                    return (
                        <div key={i} className="w-[80%] space-y-4 text-center">
                            <h4 className="font-medium text-lg">{`${k.charAt(0).toUpperCase() + k.slice(1)}: ${calc.toPrecision(2)} / 5`}</h4>
                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                <div
                                    className={`${calc > 4 ? 'bg-green-600' : (calc > 2.5 ? 'bg-yellow-500' : 'bg-red-600')}  h-2.5 rounded-full`}
                                    style={{ width: `${calc_p}%` }}
                                />
                            </div>
                        </div>
                    );
                })}

            </div>

            <div className="flex flex-col items-center space-y-4">
                <a href={r.resumeLink} target="_blank" rel="noopener noreferrer">
                    <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(r.resumeLink)}&embedded=true`}
                        className="w-full h-80 border rounded-lg mb-2"
                        frameBorder="0"
                        style={{ maxHeight: "1000px", objectFit: "cover" }}
                    />
                </a>
                <h4 className="font-medium text-lg">Total Ratings: {r._count.id}</h4>
                <div className="flex flex-row space-x-2">
                    <a
                        href={r.resumeLink}
                        target="_blank"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 text-center"
                    >
                        Full PDF
                    </a>
                </div>
            </div>
        </div>)
}

export default function Stats() {
    const [reviewStats, setReviewStats] = useState<ReviewStats[] | null>(null);
    const [loading, setLoading] = useState(true);
    const { resumeUploaded } = useGlobal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/review/aggregate");
                setReviewStats(res.data);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    const selfResume = resumeUploaded ? reviewStats?.find((r) => r.resumeId === resumeUploaded) : null;

    return (
        <main className="flex min-h-screen flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8">
            <div className="text-3xl md:text-5xl xl:text-7xl font-bold mb-8 text-center">Resume Statistics</div>
            {resumeUploaded ?
                <div className="text-sm md:text-md xl:text-lg font-semibold mb-8 text-center">{selfResume ? "The highlighted resume is yours!" : "No ratings for your resume yet"}</div> :
                <button
                    type="button"
                    onClick={() => window.location.href = "/"}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg md:text-xl hover:bg-blue-600 disabled:bg-blue-300 mb-6"
                >
                    Upload a Resume
                </button>}
            {loading ? <Loading /> : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {selfResume && (
                        <ReviewStatCard key={0} r={selfResume} self={true} />
                    )}
                    {reviewStats?.filter((r) => r.resumeId != resumeUploaded).map((r, i) => (
                        <ReviewStatCard key={i + 1} r={r} self={false} />
                    ))}
                </div>
            )}
        </main>
    );
}
