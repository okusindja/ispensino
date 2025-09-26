import { Layout } from '@/components';
import { SpinnerSVG, VolumeOffSVG, VolumeUpSVG } from '@/components/svg';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { User } from '@prisma/client';
import { Div, Li, Ul } from '@stylin.js/elements';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useSWR from 'swr';

type SocketUser = { id: string; name: string; muted: boolean };

let socket: Socket | null = null;

export const VoiceRoom = () => {
  const [users, setUsers] = useState<SocketUser[]>([]);
  const [muted, setMuted] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});

  const { data: userData, isLoading: userIsLoading } = useSWR<User>(
    '/api/users/me',
    fetcherWithCredentials
  );

  useEffect(() => {
    socket = io({ path: '/api/socket.io' });

    socket.on('connect', async () => {
      console.log('🔗 Connected:', socket?.id);

      socket?.emit('join-room', {
        roomId: 'test-room',
        name: userData?.name,
      });

      localStreamRef.current = await navigator.mediaDevices?.getUserMedia({
        audio: true,
      });
    });

    socket.on('room-users', (users: SocketUser[]) => {
      console.log('👥 Room users:', users);
      setUsers(users);
    });

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

  function createPeer(targetId: string, initiator: boolean) {
    const peer = new RTCPeerConnection();

    localStreamRef.current?.getTracks().forEach((track) => {
      peer.addTrack(track, localStreamRef.current!);
    });

    peer.ontrack = (event) => {
      const audio = document.createElement('audio');
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      document.body.appendChild(audio);
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('signal', {
          roomId: 'test-room',
          data: { candidate: event.candidate },
        });
      }
    };

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

  function toggleMute() {
    if (!localStreamRef.current) return;
    const track = localStreamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    const newMuted = !track.enabled;
    setMuted(newMuted);
    socket?.emit('toggle-mute', { roomId: 'test-room', muted: newMuted });
  }

  console.log('mic status', muted);

  if (userIsLoading) {
    <Layout>
      <Div
        mt="5rem"
        width="100%"
        color="text"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <SpinnerSVG width="100%" maxWidth="4rem" maxHeight="4rem" />
      </Div>
    </Layout>;
  }

  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div color="text" gridColumn="1/-1" width="100%">
          <Typography variant="large" size="medium" color="text" mt="L" mb="XL">
            Sala de voz
          </Typography>
          <Ul>
            {users.map((u) => (
              <Li
                py="M"
                key={u.id}
                display="flex"
                alignItems="center"
                borderColor="outline"
                borderBottom="1px solid"
                justifyContent="space-between"
              >
                <Typography variant="fancy" size="medium">
                  {u.name || 'testing user'}
                </Typography>
                <Typography variant="body" size="medium">
                  {userData?.name === u.name &&
                    (u.muted ? (
                      <Button
                        onClick={toggleMute}
                        isIcon
                        variant="neutral"
                        size="medium"
                      >
                        🔇
                      </Button>
                    ) : (
                      <Button
                        onClick={toggleMute}
                        isIcon
                        variant="neutral"
                        size="medium"
                      >
                        🔊
                      </Button>
                    ))}
                  {userData?.name !== u.name &&
                    (u.muted ? (
                      <Button
                        disabled
                        cursor="not-allowed"
                        isIcon
                        variant="neutral"
                        size="medium"
                      >
                        🔇
                      </Button>
                    ) : (
                      <Button
                        disabled
                        isIcon
                        cursor="not-allowed"
                        variant="neutral"
                        size="medium"
                      >
                        🔊
                      </Button>
                    ))}
                </Typography>
              </Li>
            ))}
          </Ul>
        </Div>
      </Box>
    </Layout>
  );
};

export default VoiceRoom;
