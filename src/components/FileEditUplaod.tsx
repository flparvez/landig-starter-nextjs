"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@imagekit/next";

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  defaultImages?: { url: string }[] | string[];
}

const FileEditUpload = ({ onUploadComplete, defaultImages = [] }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const getAuthParams = async () => {
    const res = await fetch("/api/auth/imagekit-auth");
    if (!res.ok) throw new Error("ImageKit auth failed");
    return res.json();
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    const auth = await getAuthParams();
    const newUrls: string[] = [];

    for (const file of fileArray) {
      try {
        const result = await upload({
          file,
          fileName: file.name,
          publicKey: auth.publicKey,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
        });
        if (result?.url) newUrls.push(result.url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    const updated = [...uploadedUrls, ...newUrls];
    setUploadedUrls(updated);
    onUploadComplete(updated);
    setUploading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(e.target.files);
    }
  };

  const removeImage = (url: string) => {
    const updated = uploadedUrls.filter((u) => u !== url);
    setUploadedUrls(updated);
    onUploadComplete(updated);
  };

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && defaultImages.length > 0) {
      const arrayImages = Array.isArray(defaultImages) ? defaultImages : [defaultImages];
      const urls = arrayImages.map((img) =>
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
        className="w-full h-32 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? "Uploading..." : "📤 Click to select files"}
      </div>

      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">📸 Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {uploadedUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <Image
                  src={url}
                  width={200}
                  height={200}
                  alt={`uploaded-${idx}`}
                  className="rounded w-full h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
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

export default FileEditUpload;
