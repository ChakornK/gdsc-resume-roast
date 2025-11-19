"use client";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGlobal } from "@/hooks/useGlobal";
import Icon from "@mdi/react";
import { mdiArrowRight, mdiTrashCanOutline, mdiTrayArrowUp } from "@mdi/js";
import { MAX_RESUME_SIZE_MB } from "@/lib/consts";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileOverArea, setFileOverArea] = useState<boolean>(false);

  const { resumeUploaded, setResumeUploaded } = useGlobal();

  const router = useRouter();

  const handleFile = (file: File) => {
    console.log(file.size);
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      setFile(null);
    } else if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
      setError(
        `File size exceeds the maximum allowed size of ${MAX_RESUME_SIZE_MB} MB.`
      );
      setFile(null);
    } else {
      setFile(file);
      setError(null);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileOverArea(false);
    if (event.target.files && event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setFileOverArea(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setFileOverArea(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setFileOverArea(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/resume/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResumeUploaded(res.data.id);
    } catch (error) {
      setLoading(false);
      setError(
        "Error uploading file: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center p-8 min-h-screen">
      <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
        {resumeUploaded
          ? "Thank you for uploading!"
          : "Upload your resume here!"}
      </div>

      <img
        src={"/logo.svg"}
        alt="GDSC"
        width={200}
        height={200}
        className="aspect-square"
      />

      {resumeUploaded ? (
        <button
          type="button"
          onClick={() => router.push("/rate")}
          className="text-lg md:text-xl primary-btn btn"
        >
          Rate other resumes
          <Icon path={mdiArrowRight} size="1em" />
        </button>
      ) : (
        <div
          className="flex justify-center items-center mb-6 w-3/4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragExit={handleDragLeave}
        >
          <label
            htmlFor="dropzone-file"
            className={`flex flex-col justify-center items-center border-2 border-dashed rounded-xl w-full h-64 cursor-pointer ${
              fileOverArea
                ? "bg-primary-container border-on-primary-container"
                : "bg-surface border-outline-variant"
            }`}
          >
            <input
              disabled={file != null}
              id="dropzone-file"
              accept="application/pdf"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="flex justify-center items-center px-6 w-full max-w-full text-on-surface-variant text-xs md:text-lg text-center">
              {file ? (
                file.name
              ) : (
                <>
                  Drag & drop your PDF resume here or click to select a file
                  <br />
                  Maximum file size: {MAX_RESUME_SIZE_MB} MB
                </>
              )}
            </span>
          </label>
        </div>
      )}

      {!resumeUploaded && error && (
        <div className="mb-4 text-error">{error}</div>
      )}

      {!resumeUploaded && file && (
        <div className="flex flex-col items-center">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="primary-btn btn"
            >
              <Icon path={mdiTrayArrowUp} size="1em" />
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={loading}
              className="btn critical-btn"
            >
              <Icon path={mdiTrashCanOutline} size="1em" />
              Clear
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
