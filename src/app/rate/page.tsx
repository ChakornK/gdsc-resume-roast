'use client'

import Loading from "@/components/Loading";
import { useGlobal } from "@/hooks/useGlobal";
import { Resume } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MINIMAL_RESUMES_TO_RATE = 5;
const RUBRICS = ['formatting', 'relevance', 'structure', 'clarity', 'wording'];

interface Ratings {
    [resumeId: number]: {
        formatting: number;
        relevance: number;
        structure: number;
        clarity: number;
        wording: number;
    };
}

export default function Rate() {
    const { resumeUploaded } = useGlobal();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [ratings, setRatings] = useState<Ratings>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [rated, setRated] = useState<number>(0);
    const [submitting, setSubmitting] = useState<{ [resumeId: number]: boolean }>({});
    const router = useRouter();

    useEffect(() => {
        if (!resumeUploaded) {
            router.push("/");
        } else {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const res = await axios.post("/api/resume/query", { id: resumeUploaded });
                    setResumes(res.data);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [resumeUploaded, router]);

    const handleRatingChange = (resumeId: number, rubric: string, value: number) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [resumeId]: {
                ...prevRatings[resumeId],
                [rubric]: value,
            },
        }));
    };

    const handleSubmitReview = async (resumeId: number) => {
        setSubmitting((prevSubmitting) => ({ ...prevSubmitting, [resumeId]: true }));
        try {
            const review = ratings[resumeId];
            await axios.post("/api/review/new", {
                resumeId,
                formatting: review.formatting,
                relevance: review.relevance,
                clarity: review.clarity,
                structure: review.structure,
                wording: review.wording
            });
            setResumes((resumes) => resumes.filter((r) => r.id !== resumeId));
            setRated((r) => r + 1);
        } catch (error) {
            alert("Failed to submit review");
        } finally {
            setSubmitting((prevSubmitting) => ({ ...prevSubmitting, [resumeId]: false }));
        }
    };


    return (
        <main className="flex min-h-screen flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8">
            <div className="text-3xl md:text-5xl xl:text-7xl font-bold mb-8 text-center">Rate others' resumes!</div>

            {rated < MINIMAL_RESUMES_TO_RATE ?
                <div className="text-sm md:text-md xl:text-lg font-semibold mb-8 text-center">You have to rate <span className="font-bold">{MINIMAL_RESUMES_TO_RATE - rated}</span> more resumes before proceeding.</div> :
                <button
                    type="button"
                    onClick={() => window.location.href = "/stats"}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg md:text-xl hover:bg-blue-600 disabled:bg-blue-300 mb-6"
                >
                    View Stats
                </button>}

            {loading ? <Loading /> : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {resumes.map((resume) => (
                        <div key={resume.id} className="border px-4 py-8 rounded-lg shadow-md bg-white grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-6 justify-center items-center">
                                {RUBRICS.map((rubric) => (
                                    <div key={rubric} className="w-full text-center">
                                        <h4 className="font-medium text-lg mb-2">{rubric.charAt(0).toUpperCase() + rubric.slice(1)}</h4>
                                        <div className="flex justify-center space-x-2">
                                            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                                                <button
                                                    key={star}
                                                    className={`${ratings[resume.id] && ratings[resume.id][rubric as keyof Ratings[typeof resume.id]] >= star
                                                        ? "text-yellow-500"
                                                        : "text-gray-500"
                                                        }`}
                                                    onClick={() => handleRatingChange(resume.id, rubric, star)}
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
                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(resume.link)}&embedded=true`}
                                        className="w-full h-80 border rounded-lg mb-4"
                                        frameBorder="0"
                                        style={{ maxHeight: "1000px", objectFit: "cover" }}
                                    />
                                </a>
                                <div className="flex flex-row space-x-4">
                                    <a
                                        href={resume.link}
                                        target="_blank"
                                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 text-center"
                                    >
                                        Full PDF
                                    </a>
                                    <button
                                        className={`bg-blue-500 text-white py-2 px-6 rounded-lg ${Object.keys(ratings[resume.id] || {}).length === 5 ? '' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={() => handleSubmitReview(resume.id)}
                                        disabled={Object.keys(ratings[resume.id] || {}).length !== 5 || submitting[resume.id]}
                                    >
                                        {submitting[resume.id] ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
