import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWsStore } from "../store/wsStore";
import { useAuthStore } from "../store/authStore";

function getWsBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return apiUrl.replace(/\/api\/v1\/?$/, "").replace(/^http/, "ws");
}

export function useAdminOrdersFeed() {
  const queryClient = useQueryClient();
  const isLogged = useAuthStore((s) => s.isLogged);
  const lastMessage = useWsStore((s) => s.lastMessage);
  const connect = useWsStore((s) => s.connect);
  const disconnect = useWsStore((s) => s.disconnect);

  // ── Connect to admin WS feed only while authenticated ───────────────
  useEffect(() => {
    if (!isLogged) return;

    const wsUrl = `${getWsBaseUrl()}/ws/pedidos`;
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, [isLogged, connect, disconnect]);

  // ── Invalidate queries when an order event arrives ──────────────────
  useEffect(() => {
    if (lastMessage?.event === "pedido_estado_changed") {
      // Invalidates all queries starting with ["pedidos"]:
      //   ["pedidos"], ["pedidos","list",params], ["pedidos",id]
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    }
  }, [lastMessage, queryClient]);

  return {
    connected: useWsStore((s) => s.connected),
    reconnectAttempts: useWsStore((s) => s.reconnectAttempts),
  };
}
