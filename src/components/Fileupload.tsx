"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@imagekit/next";
import Image from "next/image";

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  defaultImages?: { url: string }[] | string[];
}

const FileUpload = ({ onUploadComplete, defaultImages = [] }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progresses, setProgresses] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // Auth fetcher
  const getAuthParams = async () => {
    const res = await fetch("/api/auth/imagekit-auth");
    if (!res.ok) throw new Error("ImageKit authentication failed");
    return res.json();
  };

  // Handle selected files
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    const auth = await getAuthParams();
    const newUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        const result = await upload({
          file,
          fileName: file.name,
          publicKey: auth.publicKey,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
          onProgress: (e) => {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgresses((prev) => {
              const updated = [...prev];
              updated[i] = percent;
              return updated;
            });
          },
        });

        if (result?.url) newUrls.push(result.url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    const updatedUrls = [...uploadedUrls, ...newUrls];
    setUploadedUrls(updatedUrls);
    onUploadComplete(updatedUrls);
    setUploading(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    await handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await handleFiles(e.target.files);
  };

  const removeImage = (url: string) => {
    const updated = uploadedUrls.filter((u) => u !== url);
    setUploadedUrls(updated);
    onUploadComplete(updated);
  };

  // Set default images on mount
const hasInitialized = useRef(false);

useEffect(() => {
  if (!hasInitialized.current && defaultImages && Array.isArray(defaultImages)) {
    const urls = defaultImages.map((img) =>
      typeof img === "string" ? img : img.url
    );
    setUploadedUrls(urls);
    onUploadComplete(urls);
    hasInitialized.current = true;
  }
}, [defaultImages, onUploadComplete]);

  return (
    <div className="border border-dashed rounded-md p-4 bg-gray-50">
      <div
        className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer transition ${
          dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? "Uploading..." : "📤 Drag & drop files here or click to select"}
      </div>

      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {progresses.length > 0 && (
        <div className="mt-2 space-y-1">
          {progresses.map((p, i) => (
            <div key={i}>
              Upload {i + 1}: <progress value={p} max={100}></progress>
            </div>
          ))}
        </div>
      )}

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">📸 Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {uploadedUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <Image
                  width={200}
                  height={200}
                  src={url}
                  alt={`uploaded-${idx}`}
                  className="rounded w-full h-28 object-cover"
                />
                <button
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-1 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
