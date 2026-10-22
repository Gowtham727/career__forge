"use client";

import React, { useEffect, useRef } from "react";

interface VideoStreamProps {
  stream: MediaStream;
  isLocal: boolean;
  label?: string;
}

const VideoStream: React.FC<VideoStreamProps> = ({ stream, isLocal, label }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-video shadow-xl group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-zinc-200 border border-white/10 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isLocal ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
        {label || (isLocal ? "You (Local)" : "Participant")}
      </div>
    </div>
  );
};

interface VideoGridProps {
  localStream: MediaStream | null;
  peers: { [userId: string]: MediaStream };
}

export default function VideoGrid({ localStream, peers }: VideoGridProps) {
  const peerEntries = Object.entries(peers);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {localStream ? (
        <VideoStream stream={localStream} isLocal={true} label="You" />
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-video flex flex-col items-center justify-center text-zinc-500 gap-2">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
            📹
          </div>
          <p className="text-sm font-medium">Camera Loading / Disabled</p>
        </div>
      )}

      {peerEntries.map(([peerId, stream]) => (
        <VideoStream key={peerId} stream={stream} isLocal={false} label={`Interview Partner (${peerId.slice(0, 6)})`} />
      ))}
    </div>
  );
}
