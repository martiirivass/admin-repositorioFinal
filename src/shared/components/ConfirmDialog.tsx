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
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#1c2025",
          border: "1px solid #3f4851",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 24px",
          padding: "28px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backgroundColor: destructive ? "rgba(255, 180, 171, 0.15)" : "rgba(148, 204, 255, 0.15)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "24px",
                color: destructive ? "#ffb4ab" : "#94ccff",
              }}
            >
              {destructive ? "delete" : "help"}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 600,
                color: "#dfe3e9",
                marginBottom: "6px",
                lineHeight: 1.4,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#bfc7d3",
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              border: "1px solid #3f4851",
              borderRadius: "8px",
              backgroundColor: "transparent",
              color: "#dfe3e9",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#31353a")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "opacity 0.15s",
              backgroundColor: destructive ? "#ffb4ab" : "#94ccff",
              color: destructive ? "#690005" : "#003352",
              boxShadow: destructive
                ? "0 4px 12px rgba(255, 180, 171, 0.3)"
                : "0 4px 12px rgba(148, 204, 255, 0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
