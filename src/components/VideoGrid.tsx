"use client";
import StreamPlayer from "./StreamPlayer";

export default function VideoGrid({ streams }: { streams: MediaStream[] }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      {streams.map((s, i) => (
        <div className="aspect-video" key={i}>
          <StreamPlayer stream={s} />
        </div>
      ))}
    </div>
  );
}
