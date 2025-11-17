"use client";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGlobal } from "@/hooks/useGlobal";
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { resumeUploaded, setResumeUploaded } = useGlobal();

  const router = useRouter();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const selectedFile = event.dataTransfer.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
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
    <main className="flex flex-col justify-center items-center bg-linear-to-br from-neutral-100 to-neutral-200 p-8 min-h-screen">
      <div className="mb-8 font-bold text-3xl md:text-5xl xl:text-7xl text-center">
        {resumeUploaded
          ? "Thank you for uploading!"
          : "Upload your resume here!"}
      </div>

      <Image src={"/icon.png"} alt="GDSC" width={200} height={200} />

      {resumeUploaded ? (
        <button
          type="button"
          onClick={() => (window.location.href = "/rate")}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 px-6 py-2 rounded-lg text-white text-lg md:text-xl"
        >
          Rate other resumes!
        </button>
      ) : (
        <div
          className="flex justify-center items-center mb-6 w-3/4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col justify-center items-center bg-gray-50 border-2 border-gray-300 hover:border-gray-500 border-dashed rounded-lg w-full h-64 cursor-pointer"
          >
            <input
              disabled={file != null}
              id="dropzone-file"
              accept="application/pdf"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="flex justify-center items-center px-6 w-full max-w-full text-gray-500 text-xs md:text-lg text-center">
              {file ? file.name : "Drag & drop your PDF resume here"}
            </span>
          </label>
        </div>
      )}

      {!resumeUploaded && error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}

      {!resumeUploaded && file && (
        <div className="flex flex-col items-center">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 px-6 py-2 rounded-lg text-white"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 px-6 py-2 rounded-lg text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
