"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import StreamPlayer from "./StreamPlayer";
import { debugLog } from "@/lib/logger";
import { getRtcConfig } from "@/lib/rtc";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function StreamBroadcaster({ category: initialCategory }: { category: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [category, setCategory] = useState<string>(initialCategory);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const answeredRef = useRef<Set<string>>(new Set());

  // STUN básico de Google; en producción puedes usar tu propio TURN si es necesario
  const rtcConfig = useMemo<RTCConfiguration>(() => getRtcConfig(), []);

  useEffect(() => {
    const s = io(BACKEND_URL, { transports: ["websocket"], forceNew: true });
    setSocket(s);
    const peersSnapshot = peersRef.current;
    const streamSnapshot = localStream;
    return () => {
      // Cierra PCs y detiene tracks si se desmonta el componente con socket abierto
      try {
        for (const [, pc] of peersSnapshot) pc.close();
        peersSnapshot.clear();
      } catch {}
      try {
        streamSnapshot?.getTracks().forEach((t) => t.stop());
      } catch {}
      s.disconnect();
    };
  }, [localStream]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-category", category);
    return () => {
      socket.emit("leave-category", category);
    };
  }, [socket, category]);

  // Si cambia el query param (?cat=2) en la URL, sincroniza el estado inicial
  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const startShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setLocalStream(stream);

      // Cuando un viewer esté listo, crear una conexión dedicada y enviarle una oferta
      const ensurePeerForViewer = async (viewerId: string) => {
        if (!socket) return;
        if (peersRef.current.has(viewerId)) return;
        const pc = new RTCPeerConnection(rtcConfig);
        peersRef.current.set(viewerId, pc);
  // Usa addTrack con orden consistente para evitar desalineaciones de m-lines
  stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("ice-candidate", { targetId: viewerId, candidate: e.candidate });
          }
        };

        if (pc.signalingState !== "stable") return;
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          debugLog("[Broadcaster] Enviando oferta a viewer", viewerId);
          socket.emit("sending-signal", { category, targetId: viewerId, callerID: socket.id, signal: offer });
        } catch (e) {
          debugLog("[Broadcaster] Error creando oferta; reiniciando PC para", viewerId, e);
          try { pc.close(); } catch {}
          peersRef.current.delete(viewerId);
          answeredRef.current.delete(viewerId);
          // Reintentar con una PC limpia
          await ensurePeerForViewer(viewerId);
        }
      };

  const onViewerReady = (payload: { viewerId: string }) => {
        ensurePeerForViewer(payload.viewerId).catch(console.error);
      };
      socket?.on("viewer-ready", onViewerReady);

      const onReturned = async (payload: { signal: RTCSessionDescriptionInit; id: string }) => {
        const pc = peersRef.current.get(payload.id);
        if (!pc) return;
        if (answeredRef.current.has(payload.id)) {
          // Duplicado; ignora
          return;
        }
        try {
  debugLog("[Broadcaster] Recibida answer de viewer", payload.id);
          await pc.setRemoteDescription(new RTCSessionDescription(payload.signal));
          answeredRef.current.add(payload.id);
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      };
      socket?.on("receiving-returned-signal", onReturned);

    const onIceFromViewer = async (payload: { from: string; candidate: RTCIceCandidateInit }) => {
        const pc = peersRef.current.get(payload.from);
        if (!pc) return;
        try {
  debugLog("[Broadcaster] ICE del viewer", payload.from);
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (e) {
          console.error("Error adding ICE candidate:", e);
        }
      };
      socket?.on("ice-candidate", onIceFromViewer);

  // Anuncia que estás listo a la sala (para que los viewers manden su ready al broadcaster)
  socket?.emit("broadcaster-ready", { category });

  return () => {
        socket?.off("viewer-ready", onViewerReady);
        socket?.off("receiving-returned-signal", onReturned);
        socket?.off("ice-candidate", onIceFromViewer);
      };
    } catch (e) {
      console.error(e);
      alert("No se pudo iniciar el compartir pantalla");
    }
  }, [category, rtcConfig, socket]);

  const stopShare = useCallback(() => {
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    for (const [, pc] of peersRef.current) {
      pc.close();
    }
    peersRef.current.clear();
  answeredRef.current.clear();
  }, [localStream]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end flex-wrap">
        <label className="text-sm">Categoría
          <select className="ml-2 border rounded px-2 py-1" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
        <button className="px-4 py-2 bg-black text-white rounded" onClick={startShare}>Compartir pantalla</button>
        <button className="px-4 py-2 border rounded" onClick={stopShare}>Detener</button>
        <a className="px-3 py-2 border rounded" href={`/categoria/${category}`} target="_blank" rel="noreferrer">Ver categoría</a>
      </div>
      <div className="text-sm text-black/60 dark:text-white/60">Transmitiendo en categoría: {category}</div>
      <div className="aspect-video w-full max-w-4xl">
        <StreamPlayer stream={localStream} muted />
      </div>
    </div>
  );
}
