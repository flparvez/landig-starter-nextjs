"use client";

import { upload, UploadResponse } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: { url: string;  }) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      setError("Please upload a valid video file.");
      return false;
    }

    if (fileType === "image" && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return false;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB.");
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
      if (!publicKey) throw new Error("Missing ImageKit public key");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateFile(file)) continue;

        const res: UploadResponse = await upload({
          file,
          fileName: file.name,
          publicKey,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
          onProgress: (event: ProgressEvent) => {
            if (event.lengthComputable && onProgress) {
              const percent = (event.loaded / event.total) * 100;
              onProgress(Math.round(percent));
            }
          },
        });

        // ✅ Safe check before calling onSuccess
        if (res.url) {
          onSuccess({ url: res.url });
        } else {
          console.warn("Upload response missing URL", res);
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-1">
      <input
        type="file"
        multiple
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="cursor-pointer"
      />
      {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
