import { useState, useRef, useCallback, useEffect } from "react";

export interface UseImageUploadReturn {
  /** Archivo local seleccionado (null si no hay) */
  file: File | null;
  /** Preview local (ObjectURL) o URL de Cloudinary si ya se subió */
  preview: string | null;
  /** Ref del input file */
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  /** Maneja selección de archivo (genera preview local) */
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Quita imagen seleccionada (también marca removeExisting=true) */
  handleRemove: () => void;
  /** Reset completo del hook */
  reset: () => void;

  // --- Cloudinary ---
  /** URL de Cloudinary (después de upload exitoso) */
  cloudinaryUrl: string | null;
  /** Public ID de Cloudinary */
  cloudinaryPublicId: string | null;
  /** true mientras se está subiendo */
  uploading: boolean;
  /** Mensaje de error del upload, o null */
  uploadError: string | null;
  /** true si el usuario quitó la imagen existente (en edición) */
  removeExisting: boolean;
  /** Setea el resultado de Cloudinary después del upload */
  setCloudinaryResult: (url: string, publicId: string) => void;
  /** Setea uploading state */
  setUploading: (v: boolean) => void;
  /** Setea error state */
  setUploadError: (v: string | null) => void;
  /** Setea removeExisting */
  setRemoveExisting: (v: boolean) => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cloudinary states
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removeExisting, setRemoveExisting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    // Reset Cloudinary states on new file selection
    setCloudinaryUrl(null);
    setCloudinaryPublicId(null);
    setUploadError(null);
    setRemoveExisting(false);
  }, [preview]);

  const handleRemove = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setCloudinaryUrl(null);
    setCloudinaryPublicId(null);
    setUploadError(null);
    setRemoveExisting(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [preview]);

  const reset = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setCloudinaryUrl(null);
    setCloudinaryPublicId(null);
    setUploading(false);
    setUploadError(null);
    setRemoveExisting(false);
  }, [preview]);

  const setCloudinaryResult = useCallback((url: string, publicId: string) => {
    setCloudinaryUrl(url);
    setCloudinaryPublicId(publicId);
    setPreview(url); // Mostrar URL de Cloudinary en vez del preview local
    setUploading(false);
    setUploadError(null);
  }, []);

  // Cleanup de preview URL al cambiar (previene leaks) y al desmontar
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return {
    file,
    preview,
    fileInputRef,
    handleChange,
    handleRemove,
    reset,
    // Cloudinary
    cloudinaryUrl,
    cloudinaryPublicId,
    uploading,
    uploadError,
    removeExisting,
    setCloudinaryResult,
    setUploading,
    setUploadError,
    setRemoveExisting,
  };
}
