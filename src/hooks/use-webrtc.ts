import { useEffect, useRef, useState } from "react";

type SignalType = "offer" | "answer" | "ice-candidate";

type SignalMessage = {
  id: number;
  meeting_id: string;
  from_email: string;
  to_email: string;
  type: SignalType;
  sdp?: string;
  candidate?: string;
  sdp_mid?: string;
  sdp_mline_index?: number;
};

type Participant = {
  email: string;
  displayName: string;
};

type UseWebRTCOptions = {
  meetingId: string;
  localEmail: string;
  localStream: MediaStream | null;
  participants: Participant[];
  token: string | null;
  apiUrl: string;
};

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useWebRTC({
  meetingId,
  localEmail,
  localStream,
  participants,
  token,
  apiUrl,
}: UseWebRTCOptions) {
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const lastSignalIdRef = useRef<number>(0);

  const syncLocalTracksToPeer = (pc: RTCPeerConnection, stream: MediaStream | null) => {
    if (!stream) {
      return;
    }

    for (const track of stream.getTracks()) {
      const sender = pc
        .getSenders()
        .find((existingSender) => existingSender.track?.kind === track.kind);

      if (!sender) {
        pc.addTrack(track, stream);
        continue;
      }

      if (!sender.track || sender.track.id !== track.id) {
        void sender.replaceTrack(track);
      }
    }
  };

  const setRemoteStream = (email: string, stream: MediaStream) => {
    setRemoteStreams((prev) => {
      const next = new Map(prev);
      next.set(email.toLowerCase(), stream);
      return next;
    });
  };

  const removeRemoteStream = (email: string) => {
    setRemoteStreams((prev) => {
      const next = new Map(prev);
      const stream = next.get(email.toLowerCase());
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      next.delete(email.toLowerCase());
      return next;
    });
  };

  const sendSignal = async (
    toEmail: string,
    type: SignalType,
    payload: { sdp?: string; candidate?: string; sdp_mid?: string; sdp_mline_index?: number }
  ) => {
    if (!token || !apiUrl) return;

    await fetch(`${apiUrl}/api/webrtc/signal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meeting_id: meetingId,
        from_email: localEmail,
        to_email: toEmail,
        type,
        ...payload,
      }),
    });
  };

  const ensurePeer = (peerEmail: string) => {
    const normalized = peerEmail.toLowerCase();
    const existing = pcsRef.current.get(normalized);
    if (existing) {
      syncLocalTracksToPeer(existing, localStream);
      return existing;
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);

    syncLocalTracksToPeer(pc, localStream);

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) {
        setRemoteStream(normalized, stream);
      }
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate) return;
      void sendSignal(normalized, "ice-candidate", {
        candidate: event.candidate.candidate,
        sdp_mid: event.candidate.sdpMid ?? undefined,
        sdp_mline_index: event.candidate.sdpMLineIndex ?? undefined,
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "closed" || pc.connectionState === "disconnected") {
        removeRemoteStream(normalized);
      }
    };

    pcsRef.current.set(normalized, pc);
    return pc;
  };

  useEffect(() => {
    if (!meetingId || !localEmail || !token || !apiUrl || !localStream) {
      return;
    }

    const others = participants
      .map((participant) => participant.email.toLowerCase())
      .filter((email) => email && email !== localEmail.toLowerCase());

    const localLower = localEmail.toLowerCase();

    const startOffers = async () => {
      for (const peerEmail of others) {
        // Deterministic offerer to avoid glare.
        if (localLower > peerEmail) {
          continue;
        }

        const pc = ensurePeer(peerEmail);
        if (pc.signalingState !== "stable") {
          continue;
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await sendSignal(peerEmail, "offer", { sdp: offer.sdp ?? "" });
      }
    };

    void startOffers();
  }, [participants, localStream, meetingId, localEmail, token, apiUrl]);

  useEffect(() => {
    if (!localStream) {
      return;
    }

    pcsRef.current.forEach((pc) => {
      syncLocalTracksToPeer(pc, localStream);
    });
  }, [localStream]);

  useEffect(() => {
    if (!meetingId || !localEmail || !token || !apiUrl) {
      return;
    }

    let cancelled = false;

    const pollSignals = async () => {
      if (cancelled) return;
      try {
        const response = await fetch(
          `${apiUrl}/api/webrtc/signals?meeting_id=${encodeURIComponent(meetingId)}&email=${encodeURIComponent(localEmail)}&since=${lastSignalIdRef.current}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = (await response.json()) as { signals?: SignalMessage[] };
        const signals = Array.isArray(data.signals) ? data.signals : [];

        for (const signal of signals) {
          if (signal.id > lastSignalIdRef.current) {
            lastSignalIdRef.current = signal.id;
          }

          const peerEmail = signal.from_email.toLowerCase();
          const pc = ensurePeer(peerEmail);

          if (signal.type === "offer" && signal.sdp) {
            await pc.setRemoteDescription({ type: "offer", sdp: signal.sdp });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await sendSignal(peerEmail, "answer", { sdp: answer.sdp ?? "" });
          }

          if (signal.type === "answer" && signal.sdp) {
            await pc.setRemoteDescription({ type: "answer", sdp: signal.sdp });
          }

          if (signal.type === "ice-candidate" && signal.candidate) {
            await pc.addIceCandidate(
              new RTCIceCandidate({
                candidate: signal.candidate,
                sdpMid: signal.sdp_mid,
                sdpMLineIndex: signal.sdp_mline_index,
              })
            );
          }
        }
      } catch {
        // Continue polling even if one request fails.
      }
    };

    void pollSignals();
    const interval = setInterval(() => {
      void pollSignals();
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [meetingId, localEmail, token, apiUrl]);

  useEffect(() => {
    return () => {
      pcsRef.current.forEach((pc) => pc.close());
      pcsRef.current.clear();
      setRemoteStreams((prev) => {
        prev.forEach((stream) => stream.getTracks().forEach((track) => track.stop()));
        return new Map();
      });
    };
  }, []);

  return {
    remoteStreams,
  };
}
