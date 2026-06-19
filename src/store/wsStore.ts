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
let authRefreshUrl: string | null = null;

interface WSState {
  connected: boolean;
  reconnectAttempts: number;
  lastMessage: Record<string, unknown> | null;
  attempted: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  send: (data: string) => void;
  setAuthRefreshUrl: (url: string) => void;
}

async function tryRefreshToken(): Promise<boolean> {
  if (!authRefreshUrl) return false;
  try {
    const resp = await fetch(authRefreshUrl, {
      method: "POST",
      credentials: "include",
    });
    return resp.ok;
  } catch {
    return false;
  }
}

export const useWsStore = create<WSState>((set) => ({
  connected: false,
  reconnectAttempts: 0,
  lastMessage: null,
  attempted: false,

  setAuthRefreshUrl: (url: string) => {
    authRefreshUrl = url;
  },

  connect: (url: string) => {
    // Skip if already connected to the same URL
    if (ws && currentUrl === url && ws.readyState === WebSocket.OPEN) {
      set({ attempted: true });
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
    set({ connected: false, reconnectAttempts: 0, attempted: true });

    const connectWs = () => {
      if (intentionalClose) return;

      // Don't create duplicate connections
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        return;
      }

      try {
        ws = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }

      ws.onopen = () => {
        reconnectCount = 0;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
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

      ws.onclose = async (event: CloseEvent) => {
        set({ connected: false });
        if (intentionalClose) return;

        // Auth error (4001 = no auth, 4003 = forbidden) → try refresh
        if (event.code === 4001 || event.code === 4003) {
          const refreshed = await tryRefreshToken();
          if (refreshed) {
            scheduleReconnect();
          }
          return;
        }

        scheduleReconnect();
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
    set({ connected: false, reconnectAttempts: 0, lastMessage: null, attempted: false });
  },

  send: (data: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  },
}));
