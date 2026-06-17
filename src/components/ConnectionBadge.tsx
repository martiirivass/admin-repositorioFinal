import { useWsStore } from "../store/wsStore";

export function ConnectionBadge() {
  const connected = useWsStore((s) => s.connected);
  const reconnectAttempts = useWsStore((s) => s.reconnectAttempts);
  const attempted = useWsStore((s) => s.attempted);

  if (!attempted) return null;

  if (connected) {
    return (
      <span className="inline-flex items-center gap-1 text-green-400 font-label-sm text-label-sm">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        Conectado
      </span>
    );
  }

  if (reconnectAttempts > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-yellow-400 font-label-sm text-label-sm">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        Reconectando...
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-red-400 font-label-sm text-label-sm">
      <span className="w-2 h-2 rounded-full bg-red-400" />
      Desconectado
    </span>
  );
}
