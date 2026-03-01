/**
 * WebRTC voice (mic) and screenshare for study room. Uses WebSocket for signaling.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export function useRoomMedia(
  wsRef: React.MutableRefObject<WebSocket | null>,
  roomId: string,
  myNickname: string,
  isMuted: boolean
) {
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [remoteScreens, setRemoteScreens] = useState<Record<string, MediaStream>>({});
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingMembersRef = useRef<string[]>([]);

  const sendSignal = useCallback(
    (target: string, payload: { type: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit }) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(JSON.stringify({ type: 'webrtc', target, payload }));
    },
    []
  );

  const addTracksToPc = useCallback(
    (pc: RTCPeerConnection) => {
      const local = localStreamRef.current;
      if (local)
        local.getTracks().forEach((track) => {
          if (track.kind === 'audio') pc.addTrack(track, local);
        });
      const screen = screenStreamRef.current;
      if (screen)
        screen.getTracks().forEach((track) => {
          pc.addTrack(track, screen);
        });
    },
    []
  );

  const createOfferFor = useCallback(
    async (nickname: string) => {
      if (peersRef.current.has(nickname)) return;
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      peersRef.current.set(nickname, pc);

      pc.ontrack = (e) => {
        const stream = e.streams[0];
        if (e.track.kind === 'video') {
          setRemoteScreens((prev) => ({ ...prev, [nickname]: stream }));
        } else {
          setRemoteStreams((prev) => ({ ...prev, [nickname]: stream }));
        }
      };
      pc.onicecandidate = (e) => {
        if (e.candidate) sendSignal(nickname, { type: 'ice', candidate: e.candidate.toJSON() });
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          peersRef.current.delete(nickname);
          setRemoteStreams((prev => {
            const next = { ...prev };
            delete next[nickname];
            return next;
          }));
          setRemoteScreens((prev => {
            const next = { ...prev };
            delete next[nickname];
            return next;
          }));
        }
      };

      addTracksToPc(pc);
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal(nickname, { type: 'offer', sdp: offer });
      } catch (err) {
        console.error('createOffer error', err);
      }
    },
    [sendSignal, addTracksToPc]
  );

  const handleOffer = useCallback(
    async (from: string, sdp: RTCSessionDescriptionInit) => {
      let pc = peersRef.current.get(from);
      if (!pc) {
        pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        peersRef.current.set(from, pc);
        pc.ontrack = (e) => {
          const stream = e.streams[0];
          if (e.track.kind === 'video') {
            setRemoteScreens((prev) => ({ ...prev, [from]: stream }));
          } else {
            setRemoteStreams((prev) => ({ ...prev, [from]: stream }));
          }
        };
        pc.onicecandidate = (e) => {
          if (e.candidate) sendSignal(from, { type: 'ice', candidate: e.candidate.toJSON() });
        };
        addTracksToPc(pc);
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal(from, { type: 'answer', sdp: answer });
      } catch (err) {
        console.error('handleOffer error', err);
      }
    },
    [sendSignal, addTracksToPc]
  );

  const handleAnswer = useCallback(async (from: string, sdp: RTCSessionDescriptionInit) => {
    const pc = peersRef.current.get(from);
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (err) {
        console.error('handleAnswer error', err);
      }
    }
  }, []);

  const handleIce = useCallback((from: string, candidate: RTCIceCandidateInit) => {
    const pc = peersRef.current.get(from);
    if (pc)
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
  }, []);

  // Get microphone stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((s) => {
        stream = s;
        localStreamRef.current = s;
        setMicError(null);
        pendingMembersRef.current.forEach((nick) => createOfferFor(nick));
        pendingMembersRef.current = [];
      })
      .catch((err) => {
        setMicError(err.message || 'Microphone access denied');
      });
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (localStreamRef.current === stream) localStreamRef.current = null;
    };
  }, [roomId, createOfferFor]);

  // Mute/unmute
  useEffect(() => {
    const s = localStreamRef.current;
    if (s) {
      s.getTracks().forEach((t) => {
        if (t.kind === 'audio') t.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  // Expose message handler so StudyRoom can pass ws messages
  const handleWsMessage = useCallback(
    (msg: { type: string; from?: string; nickname?: string; members?: string[]; target?: string; payload?: { type: string; sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit } }) => {
      if (msg.type === 'members' && Array.isArray(msg.members)) {
        if (localStreamRef.current) {
          msg.members.forEach((nick) => createOfferFor(nick));
        } else {
          pendingMembersRef.current = msg.members;
        }
      } else if (msg.type === 'member_joined' && msg.nickname) {
        createOfferFor(msg.nickname);
      } else if (msg.type === 'webrtc' && msg.target === myNickname && msg.payload && msg.from) {
        const { type, sdp, candidate } = msg.payload;
        if (type === 'offer' && sdp) handleOffer(msg.from, sdp);
        else if (type === 'answer' && sdp) handleAnswer(msg.from, sdp);
        else if (type === 'ice' && candidate) handleIce(msg.from, candidate);
      }
    },
    [myNickname, createOfferFor, handleOffer, handleAnswer, handleIce]
  );

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = stream;
      setIsSharingScreen(true);
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
      for (const [nick, pc] of peersRef.current) {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendSignal(nick, { type: 'offer', sdp: offer });
        } catch (e) {
          console.error('screen share renegotiate', e);
        }
      }
    } catch (err) {
      console.error('getDisplayMedia error', err);
    }
  }, [sendSignal]);

  const stopScreenShare = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setIsSharingScreen(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId]);

  return {
    remoteStreams,
    remoteScreens,
    isSharingScreen,
    startScreenShare,
    stopScreenShare,
    handleWsMessage,
    micError,
  };
}
