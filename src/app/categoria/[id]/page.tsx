"use client";
import { use as useUnwrap, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { debugLog } from "@/lib/logger";
import { getRtcConfig } from "@/lib/rtc";
import VideoGrid from "@/components/VideoGrid";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function CategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = useUnwrap(params);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [streams, setStreams] = useState<MediaStream[]>([]);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const rtcConfig = useMemo<RTCConfiguration>(() => getRtcConfig(), []);

  useEffect(() => {
    const s = io(BACKEND_URL, { transports: ["websocket"], forceNew: true });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-category", id);
    socket.emit("viewer-ready", { category: id });
  const peersSnapshot = peersRef.current;

    const ensurePeer = (callerID: string) => {
      if (peersRef.current.has(callerID)) return peersRef.current.get(callerID)!;
  const pc = new RTCPeerConnection(rtcConfig);
      peersRef.current.set(callerID, pc);
  // Asegura una m-line de video estable
  try { pc.addTransceiver("video", { direction: "recvonly" }); } catch {}
      pc.ontrack = (ev) => {
        const stream = ev.streams[0];
        if (stream) {
          setStreams((prev) => (prev.includes(stream) ? prev : [...prev, stream]));
          // Limpia cuando el track termine
          ev.track.onended = () => {
            setStreams((prev) => prev.filter((s) => s !== stream));
          };
        }
      };
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", { targetId: callerID, candidate: e.candidate });
        }
      };
      return pc;
    };

    const handleUserJoined = async (payload: { signal: RTCSessionDescriptionInit; callerID: string }) => {
      try {
        const pc = ensurePeer(payload.callerID);
        if (pc.signalingState !== "stable") {
          debugLog("[Viewer] Ignorando oferta en estado", pc.signalingState);
          return;
        }
        await pc.setRemoteDescription(new RTCSessionDescription(payload.signal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("returning-signal", { callerID: payload.callerID, signal: answer });
      } catch (err) {
        console.error("Error creando answer:", err);
      }
    };

    const handleIce = async (payload: { from: string; candidate: RTCIceCandidateInit }) => {
      const pc = peersRef.current.get(payload.from);
      if (!pc) return;
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch (e) {
        console.error("Error añadiendo ICE:", e);
      }
    };

  socket.on("user-joined", handleUserJoined);
  socket.on("ice-candidate", handleIce);
  // Si llega un broadcaster, avisa que el viewer está listo
  const onBroadcasterReady = () => socket.emit("viewer-ready", { category: id });
  socket.on("broadcaster-ready", onBroadcasterReady);

  return () => {
  socket.off("user-joined", handleUserJoined);
  socket.off("ice-candidate", handleIce);
  socket.off("broadcaster-ready", onBroadcasterReady);
      for (const [, pc] of peersSnapshot) pc.close();
      peersSnapshot.clear();
    };
  }, [socket, id, rtcConfig]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categoría {id}</h1>
        <div className="text-sm text-black/60 dark:text-white/60">Streams: {streams.length}</div>
      </div>
      {streams.length === 0 ? (
        <div className="border rounded p-8 text-center text-black/60 dark:text-white/60">No hay transmisiones aún en esta categoría. Pide a alguien que vaya a “Transmitir”.</div>
      ) : (
        <VideoGrid streams={streams} />
      )}
    </div>
  );
}
