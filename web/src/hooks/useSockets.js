import { useEffect, useRef, useState } from "react";

export function useSockets(url, handleMessage) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  useEffect(() => {
    const ws = new WebSocket(url);

    const handleOpen = () => {
      setIsConnected(true);
      console.log("Połączono z WebSocketem");
    };

    const handleClose = () => {
      setIsConnected(false);
      console.log("Rozłączono z WebSocketem");
    };

    const handleError = () => {
      setIsConnected(false);
      console.log("Błąd połączenia z WebSocketem");
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", handleError);
    ws.addEventListener("message", handleMessage);

    wsRef.current = ws;

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("close", handleClose);
      ws.removeEventListener("error", handleError);
      ws.removeEventListener("message", handleMessage);
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  return {
    ws: wsRef.current,
    isConnected,
  };
}
