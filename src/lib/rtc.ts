// Lee la config de ICE servers desde NEXT_PUBLIC_ICE_SERVERS (JSON) o usa STUN por defecto
export function getRtcConfig(): RTCConfiguration {
  try {
    const raw = process.env.NEXT_PUBLIC_ICE_SERVERS;
    if (raw) {
      const iceServers = JSON.parse(raw);
      if (Array.isArray(iceServers)) {
        return { iceServers };
      }
    }
  } catch {
    // Si falla el parseo, continuamos con el valor por defecto
  }
  return { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] };
}
