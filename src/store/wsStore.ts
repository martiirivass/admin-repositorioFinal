import { create } from "zustand";

const BASE_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const MAX_RECONNECT_ATTEMPTS = 10;

/* ── Internal module-level references (persist across renders) ── */
let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let currentUrl = "";
let reconnectCount = 0;
let intentionalClose = false;

interface WSState {
  connected: boolean;
  reconnectAttempts: number;
  lastMessage: Record<string, unknown> | null;
  connect: (url: string) => void;
  disconnect: () => void;
  send: (data: string) => void;
}

export const useWsStore = create<WSState>((set) => ({
  connected: false,
  reconnectAttempts: 0,
  lastMessage: null,

  connect: (url: string) => {
    // Skip if already connected to the same URL
    if (ws && currentUrl === url && ws.readyState === WebSocket.OPEN) {
      return;
    }

    // Clean up previous connection
    if (ws) {
      intentionalClose = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
      ws = null;
    }

    currentUrl = url;
    reconnectCount = 0;
    intentionalClose = false;
    set({ connected: false, reconnectAttempts: 0 });

    const connectWs = () => {
      if (intentionalClose) return;

      try {
        ws = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }

      ws.onopen = () => {
        reconnectCount = 0;
        set({ connected: true, reconnectAttempts: 0 });
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as Record<string, unknown>;
          set({ lastMessage: data });
        } catch {
          // Ignore non-JSON messages (heartbeats, etc.)
        }
      };

      ws.onclose = (event: CloseEvent) => {
        set({ connected: false });
        // Don't reconnect on auth errors (4001=no auth, 4003=forbidden)
        const isAuthError = event.code === 4001 || event.code === 4003;
        if (!intentionalClose && !isAuthError) {
          scheduleReconnect();
        }
      };

      ws.onerror = () => {
        // onclose fires after onerror — close triggers the reconnect
        ws?.close();
      };
    };

    const scheduleReconnect = () => {
      if (intentionalClose || reconnectCount >= MAX_RECONNECT_ATTEMPTS) return;

      const delay = Math.min(
        BASE_RECONNECT_DELAY * 2 ** reconnectCount,
        MAX_RECONNECT_DELAY,
      );

      reconnectCount++;
      set({ reconnectAttempts: reconnectCount });

      reconnectTimer = setTimeout(() => {
        if (!intentionalClose) {
          connectWs();
        }
      }, delay);
    };

    connectWs();
  },

  disconnect: () => {
    intentionalClose = true;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
      ws = null;
    }

    currentUrl = "";
    reconnectCount = 0;
    set({ connected: false, reconnectAttempts: 0, lastMessage: null });
  },

  send: (data: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  },
}));
