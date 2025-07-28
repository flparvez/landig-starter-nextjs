'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { upload } from '@imagekit/next';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';

interface IImageKitUpload {
  url: string;
  fileId?: string;
  thumbnailUrl?: string;
}

interface FileWithPreview extends File {
  preview: string;
}

interface ImageUploaderProps {
  onUploadComplete: (uploadedImages: IImageKitUpload[]) => void;
  initialImages?: IImageKitUpload[];
  onRemoveImage?: (index: number) => void;
}

export function ImageUploader({
  onUploadComplete,
  initialImages = [],
  onRemoveImage,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<IImageKitUpload[]>(initialImages);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const removePreviewImage = (index: number) => {
    if (onRemoveImage) {
      onRemoveImage(index);
    }
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedImages: IImageKitUpload[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const authRes = await fetch('/api/auth/imagekit-auth');
        const auth = await authRes.json();

        const res = await upload({
          file,
          fileName: file.name,
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
          onProgress: (evt) => {
            if (evt.lengthComputable) {
              const percent = Math.round((evt.loaded / evt.total) * 100);
              setUploadProgress(percent);
            }
          },
        });

        if (res.url) {
          uploadedImages.push({ url: res.url, fileId: res.fileId, thumbnailUrl: res.thumbnailUrl });
        }
      }

      setUploadProgress(100);
      setFiles([]);
      setPreviewImages((prev) => [...prev, ...uploadedImages]);
      onUploadComplete([...previewImages, ...uploadedImages]);
    } catch (error) {
      console.error('ImageKit Upload Error:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop the files here' : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        </div>
      </div>

      {/* Files to Upload */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Files to upload</h3>
          <div className="grid grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md">
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <Button type="button" onClick={uploadFiles} disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          {isUploading && <Progress value={uploadProgress} className="h-2" />}
        </div>
      )}

      {/* Uploaded Images */}
      {previewImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Images</h3>
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-md">
                  <Image
                    src={image.url}
                    alt={`Uploaded ${index}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePreviewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
