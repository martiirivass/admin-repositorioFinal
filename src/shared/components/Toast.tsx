import { useState, useCallback, createContext, useContext } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const colors: Record<ToastType, string> = {
    success: "bg-green-800 border-green-600 text-green-100",
    error: "bg-red-800 border-red-600 text-red-100",
    info: "bg-blue-800 border-blue-600 text-blue-100",
  };

  const icons: Record<ToastType, string> = {
    success: "check_circle",
    error: "error",
    info: "info",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${colors[t.type]} border rounded-lg px-4 py-3 shadow-xl flex items-center gap-2 min-w-[280px] animate-slide-up`}
          >
            <span className="material-symbols-outlined text-[18px]">{icons[t.type]}</span>
            <span className="font-body-md text-body-md">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
