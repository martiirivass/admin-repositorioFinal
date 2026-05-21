import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  destructive = true,
}: ConfirmDialogProps) {
  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant rounded-xl shadow-2xl w-full max-w-sm mx-lg p-xl animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-lg mb-lg">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${destructive ? "bg-error/20" : "bg-primary/10"}`}>
            <span className={`material-symbols-outlined ${destructive ? "text-error" : "text-primary"}`}>
              {destructive ? "delete" : "help"}
            </span>
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface mb-xs">{title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-md">
          <button
            onClick={onCancel}
            className="px-lg py-md border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-colors active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-lg py-md font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg ${
              destructive
                ? "bg-error text-on-error hover:brightness-110 shadow-error/20"
                : "bg-primary text-on-primary hover:brightness-110 shadow-primary/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
