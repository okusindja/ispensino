// pages/index.tsx
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type User = { id: string; name: string; muted: boolean };

let socket: Socket | null = null;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [muted, setMuted] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    // 1. Init socket
    socket = io({ path: '/api/socket.io' });

    socket.on('connect', async () => {
      console.log('🔗 Connected:', socket?.id);

      // 2. Join room
      socket?.emit('join-room', {
        roomId: 'test-room',
        name: `User-${socket.id}`,
      });

      // 3. Setup local mic
      localStreamRef.current = await navigator.mediaDevices?.getUserMedia({
        audio: true,
      });
    });

    // 4. Receive room users
    socket.on('room-users', (users: User[]) => {
      console.log('👥 Room users:', users);
      setUsers(users);
    });

    // 5. Handle WebRTC signaling
    socket.on('signal', async ({ senderId, data }) => {
      let peer = peersRef.current[senderId];
      if (!peer) {
        peer = createPeer(senderId, false);
        peersRef.current[senderId] = peer;
      }
      if (data.sdp) {
        await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === 'offer') {
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          socket?.emit('signal', {
            roomId: 'test-room',
            data: { sdp: peer.localDescription },
          });
        }
      } else if (data.candidate) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('ICE candidate error', err);
        }
      }
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    const initMic = async () => {
      if (
        typeof navigator !== 'undefined' &&
        navigator.mediaDevices?.getUserMedia
      ) {
        try {
          localStreamRef.current = await navigator.mediaDevices?.getUserMedia({
            audio: true,
          });
          console.log('🎤 Microphone ready');
        } catch (err) {
          console.error('Microphone access denied:', err);
        }
      } else {
        console.warn('❌ MediaDevices API not available in this browser');
      }
    };

    initMic();
  }, []);

  // Create peer connection
  function createPeer(targetId: string, initiator: boolean) {
    const peer = new RTCPeerConnection();

    // Add local audio
    localStreamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current!);
    });

    // Handle remote audio
    peer.ontrack = (event) => {
      const audio = document.createElement('audio');
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      document.body.appendChild(audio);
    };

    // ICE
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('signal', {
          roomId: 'test-room',
          data: { candidate: event.candidate },
        });
      }
    };

    // If initiator, make offer
    if (initiator) {
      peer
        .createOffer()
        .then((offer) => peer.setLocalDescription(offer))
        .then(() => {
          socket?.emit('signal', {
            roomId: 'test-room',
            data: { sdp: peer.localDescription },
          });
        });
    }

    return peer;
  }

  // Toggle mute
  function toggleMute() {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    const newMuted = !track.enabled;
    setMuted(newMuted);
    socket?.emit('toggle-mute', { roomId: 'test-room', muted: newMuted });
  }

  return (
    <main>
      <h1>🎙️ Voice Channel</h1>
      <button onClick={toggleMute}>{muted ? 'Unmute' : 'Mute'}</button>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} {u.muted ? '🔇' : '🔊'}
          </li>
        ))}
      </ul>
    </main>
  );
}
