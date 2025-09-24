import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

interface SignalMessage {
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export function useVoiceChannel(roomId: string): void {
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // 1. connect to socket
    const socket: Socket = io('http://localhost:3000', {
      path: '/api/socket.io',
    });
    socketRef.current = socket;

    // 2. create peer connection with free STUN server
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerRef.current = pc;

    // 3. play remote audio
    pc.ontrack = (event: RTCTrackEvent) => {
      const audioElement = document.createElement('audio');
      audioElement.srcObject = event.streams[0];
      audioElement.autoplay = true;
      document.body.appendChild(audioElement);
    };

    // 4. get microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    });

    // 5. join room
    socket.emit('join', roomId);

    // 6. listen for signaling
    socket.on('signal', async (data: SignalMessage) => {
      if (data.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === 'offer') {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('signal', { roomId, data: { sdp: answer } });
        }
      }

      if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    // 7. send ICE candidates
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        socket.emit('signal', {
          roomId,
          data: { candidate: event.candidate.toJSON() },
        });
      }
    };

    return () => {
      socket.disconnect();
      pc.close();
    };
  }, [roomId]);
}
