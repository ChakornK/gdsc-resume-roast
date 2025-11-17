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
        "headers": {
          "Content-Type": "multipart/form-data"
        }
      });
      setResumeUploaded(res.data.id);
    } catch (error) {
      setLoading(false);
      setError("Error uploading file: " + (error instanceof Error ? error.message : "Unknown error"));
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-center items-center bg-linear-to-br from-gray-100 to-gray-200 p-8">
      <div className="text-3xl md:text-5xl xl:text-7xl font-bold mb-8 text-center">{resumeUploaded ? "Thank you for Uploading!" : "Upload your resume here!"}</div>

      <Image src={"/icon.png"} alt="GDSC" width={200} height={200} />

      {resumeUploaded ? (
        <button
          type="button"
          onClick={() => window.location.href = "/rate"}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg md:text-xl hover:bg-blue-600 disabled:bg-blue-300"
        >
          Rate Others!
        </button>
      ) : (
        <div
          className="flex items-center justify-center w-3/4 mb-6"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-gray-500"
          >
            <input
              disabled={file != null}
              id="dropzone-file"
              accept="application/pdf"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-gray-500 text-center w-full flex justify-center items-center max-w-full text-xs md:text-lg px-6">{file ? file.name : "Drag & Drop your PDF resume here"}</span>
          </label>
        </div>
      )}

      {(!resumeUploaded && error) && <div className="text-red-500 mb-4">{error}</div>}

      {(!resumeUploaded && file) && (
        <div className="flex flex-col items-center">

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={loading}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:bg-red-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
