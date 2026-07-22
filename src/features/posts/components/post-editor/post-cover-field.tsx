import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImageFn } from "@/features/media/api/media.api";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/features/media/media.schema";
import { MEDIA_KEYS } from "@/features/media/queries";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

interface PostCoverFieldProps {
  title: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export function PostCoverField({
  title,
  value,
  onChange,
}: PostCoverFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImageFn({ data: formData });
      if (result.error) {
        throw new Error(result.error.reason);
      }
      return result.data;
    },
    onSuccess: (media) => {
      onChange(media.url);
      toast.success(m.editor_cover_upload_success());
      void queryClient.invalidateQueries({ queryKey: MEDIA_KEYS.all });
    },
    onError: () => {
      toast.error(m.editor_cover_upload_error());
    },
  });

  const uploadFile = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(m.editor_cover_invalid_type());
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(m.editor_cover_too_large());
      return;
    }
    uploadMutation.mutate(file);
  };

  const openPicker = () => {
    if (!uploadMutation.isPending) inputRef.current?.click();
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
        <label className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
          {m.editor_meta_cover()}
        </label>
        <p className="max-w-xl text-[10px] leading-relaxed text-muted-foreground/70">
          {m.editor_meta_cover_hint()}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => {
          uploadFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          uploadFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "overflow-hidden rounded-2xl border bg-muted/20 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/60 hover:border-primary/40",
        )}
      >
        {value ? (
          <>
            <div className="relative aspect-[16/7] overflow-hidden bg-muted">
              <img
                src={value}
                alt={m.editor_cover_preview_alt({
                  title: title.trim() || m.editor_title_placeholder(),
                })}
                className="h-full w-full object-cover"
              />
              {uploadMutation.isPending && (
                <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
                    <Loader2 size={16} className="animate-spin" />
                    {m.editor_cover_uploading()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 px-4 py-3">
              <span className="min-w-0 truncate text-[10px] font-mono text-muted-foreground">
                {value}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openPicker}
                  disabled={uploadMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-[10px] font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
                >
                  <RefreshCw size={12} />
                  {m.editor_cover_replace()}
                </button>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  disabled={uploadMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  {m.editor_cover_remove()}
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            disabled={uploadMutation.isPending}
            className="group flex aspect-[16/5] min-h-44 w-full flex-col items-center justify-center gap-4 px-6 text-center transition-colors disabled:cursor-wait"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-1">
              {uploadMutation.isPending ? (
                <Loader2 size={24} className="animate-spin" />
              ) : isDragging ? (
                <UploadCloud size={24} />
              ) : (
                <ImagePlus size={24} />
              )}
            </span>
            <span className="space-y-1">
              <strong className="block text-sm font-medium text-foreground">
                {uploadMutation.isPending
                  ? m.editor_cover_uploading()
                  : m.editor_cover_drop()}
              </strong>
              <span className="block text-[10px] text-muted-foreground">
                {m.editor_cover_upload()}
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
