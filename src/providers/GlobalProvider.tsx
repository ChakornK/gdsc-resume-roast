'use client';

import { useState, useEffect } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import Loading from "@/components/Loading";
import axios from "axios";
import Image from "next/image";

interface GlobalProviderProps {
    children: React.ReactNode;
}

export default function GlobalProvider({ children }: GlobalProviderProps) {
    const [resumeUploaded, setResumeUploaded] = useState<number | null>(null);
    const [ratingUploaded, setRatingUploaded] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [checkDb, setCheckDb] = useState<boolean | null>(null);

    useEffect(() => {
        const checkDatabase = async () => {
            try {
                const res = await axios.get('/api/checkdb');
                if (res.status === 200) {
                    setCheckDb(true);
                } else {
                    setCheckDb(false);
                }
            } catch (error) {
                setCheckDb(false);
            }
        };

        checkDatabase();

        const storedResumeUploaded = localStorage.getItem("resumeUploaded");
        const storedRatingUploaded = localStorage.getItem("ratingUploaded");

        if (storedResumeUploaded) {
            setResumeUploaded(JSON.parse(storedResumeUploaded));
        }
        if (storedRatingUploaded) {
            setRatingUploaded(JSON.parse(storedRatingUploaded));
        }

        setTimeout(() => {
            setLoading(false);
        }, 4000);
    }, []);

    useEffect(() => {
        if (resumeUploaded !== null) {
            localStorage.setItem("resumeUploaded", JSON.stringify(resumeUploaded));
        }
    }, [resumeUploaded]);

    useEffect(() => {
        localStorage.setItem("ratingUploaded", JSON.stringify(ratingUploaded));
    }, [ratingUploaded]);

    if (loading || checkDb === null) {
        return (
            <main className="flex min-h-screen flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8">
                <Loading />
            </main>
        );
    }

    if (checkDb === false) {
        return (
            <main className="flex min-h-screen flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8">
                <div className="text-3xl md:text-5xl xl:text-7xl font-bold mb-8 text-center">Service Unavailable</div>
                <div className="text-sm md:text-md xl:text-lg font-semibold mb-8 text-center">We apologize for the inconvenience, please try again later!</div> :
                <Image src={"/icon.png"} alt="GDSC" width={200} height={200} />
            </main>
        )
    }

    return (
        <GlobalContext.Provider
            value={{
                resumeUploaded,
                ratingUploaded,
                setResumeUploaded,
                setRatingUploaded,
                setLoading,
                loading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
