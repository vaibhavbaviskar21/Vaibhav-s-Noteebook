import React, { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, FileImage } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface ImageUploaderProps {
  postId: string;
  type: "cover" | "content";
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ postId, type, currentUrl, onUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startUpload = async (file: File) => {
    if (!postId) {
      setError("Please save the draft or title first to generate a valid post ID.");
      return;
    }

    setIsUploading(true);
    setProgress(10);
    setError(null);

    const folder = type === "cover" ? "covers" : "content";
    const safeFilename = encodeURIComponent(file.name.replace(/\s+/g, "_"));
    const storagePath = `${folder}/${postId}/${Date.now()}_${safeFilename}`;

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 150);

    try {
      const { data, error: uploadErr } = await supabase.storage
        .from("portfolio")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      clearInterval(progressInterval);

      if (uploadErr) {
        throw uploadErr;
      }

      setProgress(100);

      const { data: urlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(storagePath);
      
      onUploaded(urlData.publicUrl);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error("Storage upload failure details:", err);
      setError(`Upload Failed: ${err.message || err}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  // Drag and Drop triggers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
          dragActive
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
            : "border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-500 font-bold">
              <span>Uploading image...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 select-none">
            <Upload className="h-6 w-6 text-zinc-400 dark:text-zinc-500 mx-auto" />
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Drag file here or <span className="text-indigo-500 hover:underline">browse</span>
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">PNG, Jpeg, GIF, WebP (Max 5MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-500 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {currentUrl && !isUploading && (
        <div className="flex items-center justify-between gap-3 p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 font-mono text-xs">
          <div className="flex items-center gap-1.5 truncate text-zinc-600 dark:text-zinc-400">
            <FileImage className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="truncate">{currentUrl.split("?")[0].split("/").pop()}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUploaded(""); // resets image
            }}
            className="text-[10px] bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-500 px-1.5 py-0.5 rounded transition"
          >
            Clear image
          </button>
        </div>
      )}
    </div>
  );
};
