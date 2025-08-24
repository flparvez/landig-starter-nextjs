"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@imagekit/next";
import Image from "next/image";

interface FileUploadProps {
  // This callback will receive an array of URLs from the latest upload batch
  onUploadComplete: (urls: string[]) => void;
  // This callback will be triggered when an image is removed
  onImageRemove: (updatedUrls: string[]) => void;
  defaultImages?: { url: string }[] | string[];
}

const FileUpload = ({ 
  onUploadComplete, 
  onImageRemove,
  defaultImages = [] 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Tracks progress of each file by its name during an upload session
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  // This state holds all URLs displayed in the component
  const [displayedUrls, setDisplayedUrls] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // Memoize the initial setup to prevent re-renders from changing the default images
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current && defaultImages.length > 0) {
      const initialUrls = defaultImages.map((img) =>
        typeof img === "string" ? img : img.url
      );
      setDisplayedUrls(initialUrls);
      hasInitialized.current = true;
    }
  }, [defaultImages]);

  const getAuthParams = async () => {
    try {
      const res = await fetch("/api/auth/imagekit-auth");
      if (!res.ok) {
        throw new Error(`Authentication request failed: ${res.statusText}`);
      }
      return res.json();
    } catch (error) {
      console.error("Failed to get ImageKit authentication parameters.", error);
      throw error; // Re-throw to be caught in handleFiles
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setProgresses({}); // Reset progress for the new batch

    try {
      const auth = await getAuthParams();

      // Create an array of upload promises to run them in parallel
      const uploadPromises = fileArray.map((file) =>
        upload({
          file,
          fileName: file.name,
          publicKey: auth.publicKey,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
          onProgress: (e) => {
            setProgresses((prev) => ({
              ...prev,
              [file.name]: Math.round((e.loaded / e.total) * 100),
            }));
          },
        })
      );

      // Wait for ALL uploads to complete
      const results = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads and get the URLs
      const newUrls = results
        .map((result) => result.url)
        .filter((url): url is string => !!url);

      // --- KEY CHANGE ---
      // 1. Send ONLY the new URLs to the parent component
      if (newUrls.length > 0) {
        onUploadComplete(newUrls);
      }

      // 2. Update the local display state to include the new images
      setDisplayedUrls((prevUrls) => [...prevUrls, ...newUrls]);

    } catch (error) {
      console.error("An error occurred during the file upload process:", error);
      // Optionally, add some user-facing error feedback here
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!uploading) {
        handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      // Reset the input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (urlToRemove: string) => {
    const updatedUrls = displayedUrls.filter((url) => url !== urlToRemove);
    setDisplayedUrls(updatedUrls);
    // Notify the parent that the list of images has changed
    onImageRemove(updatedUrls);
  };

  return (
    <div className="border border-dashed rounded-md p-4 bg-gray-50">
      <div
        className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-md transition ${
          uploading
            ? "cursor-not-allowed bg-gray-200"
            : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
        } ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? "Uploading..." : "📤 Drag & drop files here or click to select"}
      </div>

      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && Object.keys(progresses).length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="font-semibold mb-2">Upload Progress</h4>
          {Object.entries(progresses).map(([fileName, progress]) => (
            <div key={fileName}>
              <p className="text-sm text-gray-600 truncate">{fileName}</p>
              <div className="flex items-center gap-2">
                <progress value={progress} max={100} className="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-value]:bg-blue-600 [&::-moz-progress-bar]:bg-blue-600" />
                <span className="text-sm font-medium">{progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayedUrls.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">📸 Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {displayedUrls.map((url, idx) => (
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
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  title="Remove Image"
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