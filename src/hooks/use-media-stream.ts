import { useEffect, useRef, useState } from 'react';

interface MediaStreamState {
  audioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
  stream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

interface UseMediaStreamOptions {
  audio?: boolean;
  video?: boolean;
}

/**
 * Hook to manage local media stream (camera and microphone)
 */
export function useMediaStream(options: UseMediaStreamOptions = { audio: true, video: true }) {
  const [mediaState, setMediaState] = useState<MediaStreamState>({
    audioTrack: null,
    videoTrack: null,
    stream: null,
    isAudioEnabled: options.audio ?? true,
    isVideoEnabled: options.video ?? true,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize media stream
  useEffect(() => {
    let isMounted = true;

    const initializeMediaStream = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: options.audio !== false,
          video: options.video !== false ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const audioTrack = stream.getAudioTracks()[0] || null;
        const videoTrack = stream.getVideoTracks()[0] || null;

        setMediaState({
          audioTrack,
          videoTrack,
          stream,
          isAudioEnabled: audioTrack ? audioTrack.enabled : false,
          isVideoEnabled: videoTrack ? videoTrack.enabled : false,
        });

        setIsLoading(false);
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to access media devices';
          setError(errorMessage);
          setIsLoading(false);
          console.error('Media stream error:', err);
        }
      }
    };

    initializeMediaStream();

    return () => {
      isMounted = false;
      if (mediaState.stream) {
        mediaState.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleAudio = (enabled?: boolean) => {
    if (mediaState.audioTrack) {
      const newState = enabled ?? !mediaState.isAudioEnabled;
      mediaState.audioTrack.enabled = newState;
      setMediaState((prev) => ({ ...prev, isAudioEnabled: newState }));
    }
  };

  const toggleVideo = (enabled?: boolean) => {
    if (mediaState.videoTrack) {
      const newState = enabled ?? !mediaState.isVideoEnabled;
      mediaState.videoTrack.enabled = newState;
      setMediaState((prev) => ({ ...prev, isVideoEnabled: newState }));
    }
  };

  const stopStream = () => {
    if (mediaState.stream) {
      mediaState.stream.getTracks().forEach((track) => track.stop());
      setMediaState({
        audioTrack: null,
        videoTrack: null,
        stream: null,
        isAudioEnabled: false,
        isVideoEnabled: false,
      });
    }
  };

  return {
    ...mediaState,
    toggleAudio,
    toggleVideo,
    stopStream,
    error,
    isLoading,
  };
}

/**
 * Hook to attach media stream to video element
 */
export function useVideoStream(videoRef: React.RefObject<HTMLVideoElement>, stream: MediaStream | null) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [videoRef, stream]);
}

/**
 * Hook to manage participant streams
 */
export function useParticipantStreams() {
  const [participantStreams, setParticipantStreams] = useState<Map<string, MediaStream>>(new Map());

  const addParticipantStream = (participantId: string, stream: MediaStream) => {
    setParticipantStreams((prev) => new Map(prev).set(participantId, stream));
  };

  const removeParticipantStream = (participantId: string) => {
    setParticipantStreams((prev) => {
      const newMap = new Map(prev);
      const stream = newMap.get(participantId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      newMap.delete(participantId);
      return newMap;
    });
  };

  const getParticipantStream = (participantId: string) => {
    return participantStreams.get(participantId) || null;
  };

  return {
    participantStreams,
    addParticipantStream,
    removeParticipantStream,
    getParticipantStream,
  };
}
