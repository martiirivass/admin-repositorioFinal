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
  const connected = useWsStore((s) => s.connected);
  const lastMessage = useWsStore((s) => s.lastMessage);
  const connect = useWsStore((s) => s.connect);
  const disconnect = useWsStore((s) => s.disconnect);
  const setAuthRefreshUrl = useWsStore((s) => s.setAuthRefreshUrl);

  // ── Configure auth refresh endpoint for WS token refresh ────────────
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    setAuthRefreshUrl(`${apiUrl}/api/v1/auth/refresh`);
  }, [setAuthRefreshUrl]);

  // ── Connect to admin WS feed only while authenticated and has order roles ──
  useEffect(() => {
    if (!isLogged) return;

    const user = useAuthStore.getState().user;
    const roles = user?.roles ?? [];
    const canAccessOrders = roles.some((r) => r.codigo === "ADMIN" || r.codigo === "PEDIDOS");
    if (!canAccessOrders) return;

    const token = useAuthStore.getState().accessToken;
    const wsUrl = token
      ? `${getWsBaseUrl()}/ws/pedidos?token=${token}`
      : `${getWsBaseUrl()}/ws/pedidos`;
    connect(wsUrl);

    return () => {
      disconnect();
    };
  }, [isLogged, connect, disconnect]);

  // ── Resync on reconnect: refetch when WS connection is established ──
  useEffect(() => {
    if (connected) {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    }
  }, [connected, queryClient]);

  // ── Invalidate queries when an order event arrives ──────────────────
  useEffect(() => {
    if (lastMessage?.event === "pedido_estado_changed") {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    }
  }, [lastMessage, queryClient]);

  return {
    connected,
    reconnectAttempts: useWsStore((s) => s.reconnectAttempts),
  };
}
