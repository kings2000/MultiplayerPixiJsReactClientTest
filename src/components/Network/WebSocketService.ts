export type WebSocketStatus = "idle" | "connecting" | "connected" | "error" | "disconnected";
type MessageCallback = (data: any) => void;
type StatusCallback = (status: WebSocketStatus) => void;


class WebSocketService {
  private ws: WebSocket | null = null;
  private messageCallback: MessageCallback | null = null;
  private statusCallback: StatusCallback | null = null;
  private url: string = "";
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectDelay: number = 1000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manualDisconnect: boolean = false; 
  public networkStatus : WebSocketStatus = "idle";

  constructor() {
  window.addEventListener("beforeunload", () => {
    this.manualDisconnect = true;
    this.ws?.close();
  });
}

  connect(url: string) {
    this.url = url;
    this.manualDisconnect = false;
    this.createConnection();
  }

  private createConnection() {
    this.updateStatus("connecting");
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.updateStatus("connected");
    };

    this.ws.onclose = () => {
      if (this.manualDisconnect) {
        this.updateStatus("idle");
        return;
      }
      this.updateStatus("disconnected");
      this.tryReconnect();
    };

    this.ws.onerror = () => {
      this.updateStatus("error");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageCallback?.(data);
      } catch {
        console.error("Failed to parse message:", event.data);
      }
    };
  }

  private tryReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      this.updateStatus("error");
      return;
    }

    if(document.visibilityState == "hidden")
    {
        console.log("Page hidden, pausing reconnect");
        document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            this.tryReconnect();
        }
        }, { once: true });
        return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      this.createConnection();
    }, this.reconnectDelay * this.reconnectAttempts); // back-off delay
  }

  disconnect() {
    this.manualDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
        const dataToSend = JSON.stringify(data);
        this.ws.send(dataToSend);
    }
  }

  onMessage(callback: MessageCallback) {
    this.messageCallback = callback;
  }

  onStatusChange(callback: StatusCallback) {
    this.statusCallback = callback;
  }

  private updateStatus(status: WebSocketStatus) {
    this.networkStatus = status;
    this.statusCallback?.(status);
  }
}

export const wsService = new WebSocketService();