import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

import { useAuth } from 'hooks/useAuth.js';
import api_routes from 'data/constants/api_routes.js';
import { jwtDecode } from 'jwt-decode';
import VideoConference from './VideoConference.jsx';
import Loader from 'components/Loader/Loader.jsx';

const response = await fetch(
  `https://starship_stargard.metered.live/api/v1/turn/credentials?apiKey=${import.meta.env.VITE_TURN_SERVERS_API_KEY}`,
);
const iceServers = await response.json();

const CourseCommunicatorContainer = () => {
  const ws = useRef(null);
  const { uid } = useParams();
  const peerConnection = useRef({});
  const [isConnected, setIsConnected] = useState('before_meeting');
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState({});
  const remoteStreamsRef = useRef(remoteStreams);
  useEffect(() => {
    remoteStreamsRef.current = remoteStreams;
    window.remote = remoteStreams;
  }, [remoteStreams]);

  const [localStream, setLocalStream] = useState(null);
  const [localVideoStream, setLocalVideoStream] = useState(null);
  const localScreenStream = useRef(null);
  const [trackChange, setTrackChange] = useState(0);

  const { tokens } = useAuth();

  const MY_ID = jwtDecode(tokens?.access).user_id;
  const COURSE_ID = uid;

  const setIsSharingScreenCallback = useCallback(
    (arg) => setIsSharingScreen(arg),
    [],
  );

  const setupWebRTC = useCallback(
    async (remoteUser) => {
      if (!peerConnection.current[remoteUser]) {
        // peerConnection.current[remoteUser].close();

        const pc = new RTCPeerConnection({ iceServers });
        peerConnection.current[remoteUser] = pc;
        pc.addEventListener('connectionstatechange', () => {
          if (pc.connectionState === 'failed') {
            location.reload();
          }
        });
        if (!localStream) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setLocalStream(stream);
          const myVideoTrack = stream.getVideoTracks()[0];
          setLocalVideoStream(new MediaStream([myVideoTrack]));
          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
        }

        pc.onnegotiationneeded = async () => {
          console.log('sending offer');
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendMessage(remoteUser, {
            type: 'OFFER',
            content: JSON.stringify(offer),
          });
        };

        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            sendMessage(remoteUser, {
              type: 'CANDIDATE',
              content: JSON.stringify(event.candidate),
            });
          }
        };

        pc.ontrack = async (event) => {
          console.log('ontrack event:', event);
          console.log(remoteUser);
          window.evento = event;
          if (event.streams[0]) {
            setRemoteStreams((previousStreams) => ({
              ...previousStreams,
              [remoteUser]: event.streams[0],
            }));
          } else if (event?.track) {
            if (remoteStreamsRef.current[remoteUser]) {
              event.track.isDisplay = true;
              const stream = new MediaStream([
                ...remoteStreamsRef.current[remoteUser].getTracks(),
                event.track,
              ]);
              setRemoteStreams((previousStreams) => ({
                ...previousStreams,
                [remoteUser]: stream,
              }));
            } else {
              console.log(`remoteStreams[${remoteUser}] is not defined yet.`);
            }
          }
        };
      }
    },
    [localStream],
  );

  const sendMessage = (to_user, message) => {
    if (tokens?.access) {
      const msg = {
        to_user,
        from_user: MY_ID,
        type: message.type,
        content: message.content,
      };
      try {
        if (ws.current?.readyState === 1) {
          ws.current.send(JSON.stringify(msg));
        }
      } catch (e) {
        console.error('Failed to send WS message', e);
      }
    }
  };

  const handleWebSocketMessages = (event) => {
    const message = JSON.parse(event.data);
    // console.log(
    //   `Received message: ${message.type} from user ${message.from_user ?? message.for_user}`,
    // );

    switch (message.type) {
      case 'CREATE':
        if (
          message.kind === 'offer' &&
          !(message.for_user in peerConnection.current)
        ) {
          createOffer(message.for_user);
        }
        break;
      case 'OFFER':
        if (
          message.to_user === MY_ID
          // &&
          // !(message.from_user in peerConnection.current)
        ) {
          handleOffer(message.content, message.from_user);
        }
        break;
      case 'ANSWER':
        if (message.to_user === MY_ID) {
          handleAnswer(message.from_user, message.content);
        }
        break;
      case 'CANDIDATE':
        if (message.to_user === MY_ID) {
          handleCandidate(message.from_user, message.content);
        }
        break;
      case 'END_CALL':
        // console.log(`user ${message.from_user} ended the call`);
        remoteStreams[message.from_user]
          ?.getTracks()
          .forEach((track) => track.stop());
        peerConnection.current[message.from_user]?.close();
        delete peerConnection.current[message.from_user];
        setRemoteStreams((previousStreams) => {
          // eslint-disable-next-line no-unused-vars
          const { [message.from_user]: _, ...rest } = previousStreams;
          return rest;
        });
        break;
      default:
        console.error(
          `Received unknown message: ${message.type} from user ${message.from_user}`,
        );
        break;
    }
  };
  const createOffer = async (to_user) => {
    await setupWebRTC(to_user);
    const offer = await peerConnection.current[to_user].createOffer();
    await peerConnection.current[to_user].setLocalDescription(offer);
    // console.log(`Sending offer to user ${to_user}`);
    sendMessage(to_user, { type: 'OFFER', content: JSON.stringify(offer) });
    setIsConnected('in_meeting');
  };

  const handleOffer = async (offer, from_user) => {
    await setupWebRTC(from_user);
    console.log('Handling offer from user', from_user);
    await peerConnection.current[from_user].setRemoteDescription(
      new RTCSessionDescription(JSON.parse(offer)),
    );
    if (
      peerConnection.current[from_user].signalingState === 'have-remote-offer'
    ) {
      const answer = await peerConnection.current[from_user].createAnswer();
      await peerConnection.current[from_user].setLocalDescription(answer);
      sendMessage(from_user, {
        type: 'ANSWER',
        content: JSON.stringify(answer),
      });
    }
    setIsConnected('in_meeting');
  };

  const handleAnswer = async (remoteUser, answer) => {
    // console.log(`Handling answer from user ${remoteUser}`);
    if (!peerConnection.current[remoteUser]?.hasAnswered) {
      try {
        await peerConnection.current[remoteUser].setRemoteDescription(
          new RTCSessionDescription(JSON.parse(answer)),
        );
        peerConnection.current[remoteUser].hasAnswered = true;
      } catch (e) {
        console.log('Error:', e);
      }
    }
  };

  const handleCandidate = async (remoteUser, candidate) => {
    if (peerConnection.current[remoteUser]?.remoteDescription) {
      // console.log('Adding ICE candidate');
      await peerConnection.current[remoteUser].addIceCandidate(
        new RTCIceCandidate(JSON.parse(candidate)),
      );
    } else {
      ('no remote description set yet');
    }
  };

  useEffect(() => {
    const startScreenSharing = async () => {
      try {
        localScreenStream.current =
          await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
        Object.entries(peerConnection.current).forEach(([userId, pc]) => {
          localScreenStream.current.getTracks().forEach((track) => {
            track.isDisplay = true;
            window.added = pc.addTrack(track);
            if (localStream?.addTrack) {
              setLocalStream((prev) => {
                return new MediaStream([...prev.getTracks(), track]);
              });
              setTrackChange((prev) => prev + 1);
            }
            if (localVideoStream?.addTrack) {
              console.log('adding track to localVideoStream');
              setLocalVideoStream((prev) => {
                return new MediaStream([...prev.getTracks(), track]);
              });
              setTrackChange((prev) => prev + 1);
            }
          });
        });
      } catch (error) {
        console.error('Error sharing screen', error);
      }
    };

    window.pc = peerConnection.current;

    const stopScreenSharing = () => {
      if (localScreenStream.current) {
        localScreenStream.current.getTracks().forEach((track) => track.stop());
        localScreenStream.current = null;
        Object.values(peerConnection.current).forEach((pc) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.isDisplay) {
              pc.removeTrack(sender);
            }
          });
          localStream.getTracks().forEach((track) => {
            if (track?.isDisplay) {
              localStream.removeTrack(track);
            }
          });
          localVideoStream.getTracks().forEach((track) => {
            if (track?.isDisplay) {
              localVideoStream.removeTrack(track);
            }
          });
        });
      }
    };

    if (isSharingScreen && !localScreenStream.current) {
      startScreenSharing();
    } else if (!isSharingScreen && localScreenStream.current) {
      stopScreenSharing();
    }

    // Cleanup on unmount
    return () => {
      if (isSharingScreen) {
        stopScreenSharing();
      }
    };
  }, [isSharingScreen]);

  useEffect(() => {
    window.addEventListener('beforeunload', endCall);
    const token = tokens.access;
    try {
      if (token) {
        ws.current = new WebSocket(
          api_routes.courseCommunicator(COURSE_ID, token),
        );
        ws.current.onmessage = handleWebSocketMessages;
        window.ws = ws.current;
      } else {
        console.error('JWT token is missing');
      }
    } catch (e) {
      console.log('Error: ', e);
    }

    return endCall;
  }, []);

  const endCall = useCallback(() => {
    if (peerConnection.current) {
      Object.values(peerConnection.current).forEach((pc) => {
        if (pc?.signalingState !== 'closed') {
          pc.close();
        }
      });
      Object.keys(peerConnection.current).forEach((remote_id) => {
        sendMessage(parseInt(remote_id, 10), {
          type: 'END_CALL',
          content: 'call ended',
        });
      });
    }

    console.log('Ending call');
    if (localStream) localStream.getTracks().forEach((track) => track.stop());
    if (Object.values(peerConnection.current)?.length > 0)
      Object.values(peerConnection.current).forEach((pc) => pc.close());
    setLocalStream(null);
    setRemoteStreams({});
    setIsConnected('after_meeting');
    if (ws.current.readyState === 1) ws.current.close();
  }, [localStream]);

  return isConnected === 'in_meeting' ? (
    <VideoConference
      localStream={localStream}
      trackChange={trackChange}
      localVideoStream={localVideoStream}
      remoteStreams={remoteStreams}
      endCall={endCall}
      isSharingScreen={isSharingScreen}
      setIsSharingScreen={setIsSharingScreenCallback}
      MY_ID={MY_ID}
    />
  ) : isConnected === 'before_meeting' ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // or any other value depending on your needs
      }}
    >
      <Typography variant="h6">
        Oczekiwanie na dalszych uczestników...
      </Typography>
      <Loader />
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // or any other value depending on your needs
      }}
    >
      <Typography variant="h6">Rozłączono</Typography>
    </Box>
  );
};

export default CourseCommunicatorContainer;
