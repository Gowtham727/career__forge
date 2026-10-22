"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export default function useWebRTC(roomId: string, userId: string) {
  const [peers, setPeers] = useState<{ [userId: string]: MediaStream }>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<{ [userId: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const dataChannelsRef = useRef<{ [userId: string]: RTCDataChannel }>({});

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localStreamRef.current = stream;

        socketRef.current?.emit("join-room", roomId, userId);
      } catch (err) {
        console.error("Failed to get local stream:", err);
        // Fallback: emit join-room even without local media
        socketRef.current?.emit("join-room", roomId, userId);
      }
    };

    init();

    socketRef.current.on("user-connected", (newUser: string) => {
      if (!socketRef.current) return;
      const peer = createPeer(newUser, socketRef.current.id || "", localStreamRef.current, true);
      peersRef.current[newUser] = peer;
    });

    socketRef.current.on("offer", async (payload: { caller: string; sdp: RTCSessionDescriptionInit }) => {
      if (!socketRef.current) return;
      const { caller, sdp } = payload;
      const peer = createPeer(caller, socketRef.current.id || "", localStreamRef.current, false);
      peersRef.current[caller] = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socketRef.current.emit("answer", {
        target: caller,
        caller: socketRef.current.id,
        sdp: peer.localDescription,
      });
    });

    socketRef.current.on("answer", (payload: { caller: string; sdp: RTCSessionDescriptionInit }) => {
      const { caller, sdp } = payload;
      const peer = peersRef.current[caller];
      if (peer) {
        peer.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socketRef.current.on("ice-candidate", (payload: { caller: string; candidate: RTCIceCandidateInit }) => {
      const { caller, candidate } = payload;
      const peer = peersRef.current[caller];
      if (peer) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socketRef.current.on("user-disconnected", (disconnectedUser: string) => {
      if (peersRef.current[disconnectedUser]) {
        peersRef.current[disconnectedUser].close();
        delete peersRef.current[disconnectedUser];

        setPeers((prev) => {
          const next = { ...prev };
          delete next[disconnectedUser];
          return next;
        });
      }
    });

    return () => {
      socketRef.current?.disconnect();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      Object.values(peersRef.current).forEach((peer) => peer.close());
    };
  }, [roomId, userId]);

  const createPeer = (
    userToSignal: string,
    callerID: string,
    stream: MediaStream | null,
    isInitiator: boolean = false
  ) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);

    const dataChannel = peer.createDataChannel("fileShare");
    setupDataChannel(dataChannel, userToSignal);

    peer.ondatachannel = (event) => {
      setupDataChannel(event.channel, userToSignal);
    };

    if (stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          target: userToSignal,
          caller: callerID,
          candidate: e.candidate,
        });
      }
    };

    peer.ontrack = (e) => {
      setPeers((prev) => ({
        ...prev,
        [userToSignal]: e.streams[0],
      }));
    };

    if (isInitiator) {
      peer.onnegotiationneeded = async () => {
        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          if (socketRef.current) {
            socketRef.current.emit("offer", {
              target: userToSignal,
              caller: callerID,
              sdp: peer.localDescription,
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
    }

    return peer;
  };

  const setupDataChannel = (channel: RTCDataChannel, userId: string) => {
    dataChannelsRef.current[userId] = channel;
    channel.onmessage = (event) => {
      console.log("Received data channel message from", userId, event.data);
    };
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const videoTrack = screenStream.getVideoTracks()[0];

        Object.values(peersRef.current).forEach((peer) => {
          const sender = peer.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(videoTrack);
        });

        videoTrack.onended = () => {
          stopScreenShare();
        };

        setLocalStream(screenStream);
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error sharing screen", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const videoTrack = stream.getVideoTracks()[0];

      Object.values(peersRef.current).forEach((peer) => {
        const sender = peer.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(videoTrack);
      });

      setLocalStream(stream);
      setIsScreenSharing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sendFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      if (data) {
        Object.values(dataChannelsRef.current).forEach((channel) => {
          if (channel.readyState === "open") {
            channel.send(data as ArrayBuffer);
          }
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return {
    localStream,
    peers,
    isScreenSharing,
    isAudioMuted,
    isVideoMuted,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    sendFile,
    socket: socketRef.current,
  };
}
