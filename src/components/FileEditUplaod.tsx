"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@imagekit/next";

interface FileUploadProps {
  // Callback for when a NEW batch of files is uploaded
  onUploadComplete: (urls: string[]) => void;
  // Callback for when an image is removed, providing the full updated list
  onImageRemove: (updatedUrls: string[]) => void;
  defaultImages?: { url: string }[] | string[];
}

const FileEditUpload = ({ 
  onUploadComplete, 
  onImageRemove,
  defaultImages = [] 
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // State for tracking progress of each individual file
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  // State to hold URLs for display within this component
  const [displayedUrls, setDisplayedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  // This effect syncs the component's display with the parent's state.
  // It's crucial for correctly showing initial data and for resetting the component.
  useEffect(() => {
    const initialUrls = defaultImages.map((img) =>
      typeof img === "string" ? img : img.url
    );
    setDisplayedUrls(initialUrls);
  }, [defaultImages]);


  const getAuthParams = async () => {
    try {
      const res = await fetch("/api/auth/imagekit-auth");
      if (!res.ok) throw new Error("ImageKit authentication failed");
      return res.json();
    } catch (error) {
      console.error("Failed to get ImageKit authentication parameters.", error);
      throw error;
    }
  };

  // Handles both dropped files and selected files
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setProgresses({}); // Reset progress for the new batch

    try {
      const auth = await getAuthParams();

      // Create an array of upload promises to run them all concurrently
      const uploadPromises = fileArray.map((file) =>
        upload({
          file,
          fileName: file.name,
          publicKey: auth.publicKey,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
          onProgress: (e) => {
            // Update progress state for each file by its name
            setProgresses((prev) => ({
              ...prev,
              [file.name]: Math.round((e.loaded / e.total) * 100),
            }));
          },
        })
      );

      // Wait for all simultaneous uploads to finish
      const results = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads and collect the successful URLs
      const newUrls = results
        .map((result) => result.url)
        .filter((url): url is string => !!url);

      // If any files were uploaded successfully...
      if (newUrls.length > 0) {
        // ...call the parent's handler with ONLY the new URLs
        onUploadComplete(newUrls);
      }
    } catch (error) {
      console.error("An error occurred during file upload:", error);
      // You can add a user-facing error message here (e.g., using a toast library)
    } finally {
      // This will run whether the upload succeeded or failed
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      // Reset input value to allow re-uploading the same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!uploading) {
        handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (urlToRemove: string) => {
    // Calculate the new, complete list of URLs after removal
    const updatedUrls = displayedUrls.filter((u) => u !== urlToRemove);
    // Call the parent's handler with the full updated list
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
        {uploading ? "Uploading..." : "📤 Drag & drop or click to select"}
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
          <h4 className="font-semibold mb-2">📸 Current Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {displayedUrls.map((url, idx) => (
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

export default FileEditUpload;