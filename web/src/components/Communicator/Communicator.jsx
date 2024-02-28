import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import MicOffIcon from '@mui/icons-material/MicOff.js';
import MicIcon from '@mui/icons-material/Mic.js';
import { Box, Grid, IconButton, Paper, styled, Tooltip } from '@mui/material';

import { jwtDecode } from 'jwt-decode';

import { useAuth } from 'hooks/useAuth.js';
import { MyControls } from 'components/Course/MyControls.jsx';
import theme from '../../theme.js';
import { servers } from 'data/constants/webRrtcConfig.js';
import api_routes from 'data/constants/api_routes.js';

function Communicator() {
  const { uid } = useParams();
  let { current: ws } = useRef(null);
  const { current: pcs } = useRef({});
  let mainStream = useRef(null);
  let { current: sideStreams } = useRef({});
  let { current: localStream } = useRef(null);
  let { current: myVideoStream } = useRef(null);
  let { current: remoteStreams } = useRef({});
  const { tokens } = useAuth();

  const MY_ID = jwtDecode(tokens?.access).user_id;
  const COURSE_ID = uid;

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

  // TODO: wywalić tę linijkę oraz odwołanie do window.serverSetup !!!!!!
  window.serverSetup = servers;

  async function setupWebRTC(remoteUser) {
    pcs[remoteUser] = new RTCPeerConnection(window.serverSetup);
    pcs[remoteUser].onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage(remoteUser, {
          type: 'CANDIDATE',
          content: JSON.stringify(event.candidate),
        });
      }
    };
    pcs[remoteUser].ontrack = (event) => {
      remoteStreams[remoteUser][0] = event.streams[0];
    };

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const myVideoTrack = localStream.getVideoTracks()[0];
      myVideoStream = new MediaStream([myVideoTrack]);
    }

    if (
      pcs[remoteUser].getTracks &&
      pcs[remoteUser].getTracks().length < localStream.getTracks().length
    ) {
      pcs[remoteUser].getTracks().forEach((track) => track.stop());
      localStream.getTracks().forEach((track) => {
        pcs[remoteUser].addTrack(track, localStream);
      });
    }

    pcs[remoteUser].oniceconnectionstatechange = () => {
      if (pcs[remoteUser].iceConnectionState === 'disconnected') {
        remoteStreams[remoteUser]?.getTracks().forEach((track) => track.stop());
        pcs[remoteUser].close();
        delete pcs[remoteUser];
        // eslint-disable-next-line no-case-declarations,no-unused-vars
        const { [remoteUser]: _, ...rest } = remoteStreams;
        remoteStreams = rest;
      } else if (pcs[remoteUser].iceConnectionState === 'connected') {
        console.log('Connected!');
      } else if (
        pcs[remoteUser].iceConnectionState === 'failed - retrying...'
      ) {
        pcs[remoteUser].close();
        delete pcs[remoteUser];
        setupWebRTC(remoteUser);
      }
    };
    pcs[remoteUser].onnegotiationneeded = async () => {
      const offer = await pcs[remoteUser].createOffer();
      await pcs[remoteUser].setLocalDescription(offer);
      sendMessage(remoteUser, {
        type: 'OFFER',
        content: JSON.stringify(offer),
      });
    };
  }

  const createOffer = async (to_user) => {
    await setupWebRTC(to_user);
    const offer = await pcs[to_user].createOffer();
    await pcs[to_user].setLocalDescription(offer);
    sendMessage(to_user, { type: 'OFFER', content: JSON.stringify(offer) });
  };
  const handleOffer = async (from_user, offer) => {
    await setupWebRTC(from_user);
    await pcs[from_user].setRemoteDescription(
      new RTCSessionDescription(JSON.parse(offer)),
    );

    const answer = await pcs[from_user].createAnswer();
    await pcs[from_user].setLocalDescription(answer);
    sendMessage(from_user, {
      type: 'ANSWER',
      content: JSON.stringify(answer),
    });
  };
  const handleAnswer = async (from_user, answer) => {
    try {
      await pcs[from_user].setRemoteDescription(
        new RTCSessionDescription(JSON.parse(answer)),
      );
      // pcs[from_user].hasAnswered = true;
    } catch (e) {
      console.log('Error:', e);
    }
  };
  const handleCandidate = async (from_user, candidate) => {
    if (pcs[from_user]?.remoteDescription) {
      await pcs[from_user].addIceCandidate(
        new RTCIceCandidate(JSON.parse(candidate)),
      );
    } else {
      ('no remote description set yet');
    }
  };
  const handleEndCall = () => {
    if (pcs) {
      Object.values(pcs).forEach((pc) => {
        if (pc?.signalingState !== 'closed') {
          pc.close();
        }
      });
      Object.keys(pcs).forEach((remote_id) => {
        sendMessage(parseInt(remote_id, 10), {
          type: 'END_CALL',
          content: 'call ended',
        });
      });
    }
  };

  const handleWebSocketMessages = async (event) => {
    const message = JSON.parse(event.data);
    const remoteUser = message.from_user ?? message.for_user;
    console.log(
      `Received message: ${message.type} from user ${message.from_user ?? message.for_user}`,
    );

    switch (message.type) {
      case 'CREATE':
        if (message.kind === 'offer' && !(remoteUser in pcs)) {
          await createOffer(remoteUser);
        }
        break;
      case 'OFFER':
        if (message.to_user === MY_ID && !(message.from_user in pcs)) {
          await handleOffer(message.content, remoteUser);
        }
        break;
      case 'ANSWER':
        if (message.to_user === MY_ID) {
          await handleAnswer(message.content, remoteUser);
        }
        break;
      case 'CANDIDATE':
        if (message.to_user === MY_ID) {
          await handleCandidate(message.content, remoteUser);
        }
        break;
      case 'END_CALL':
        remoteStreams[remoteUser]?.getTracks().forEach((track) => track.stop());
        pcs[remoteUser]?.close();
        delete pcs.current[remoteUser];
        // eslint-disable-next-line no-case-declarations,no-unused-vars
        const { [remoteUser]: _, ...rest } = remoteStreams;
        remoteStreams = rest;
        break;
      default:
        console.error(
          `Received unknown message: ${message.type} from user ${message.from_user}`,
        );
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleEndCall);
    const token = tokens.access;
    try {
      if (token) {
        ws = new WebSocket(api_routes.courseCommunicator(COURSE_ID, token));
        ws.onmessage = handleWebSocketMessages;
      } else {
        console.error('JWT token is missing');
      }
    } catch (e) {
      console.log('Error: ', e);
    }

    return handleEndCall;
  }, []);

  // ======= RENDERING =================================================================

  const VideoPaper = styled(Paper)({
    backgroundColor: theme.palette.background.dark,
    overflowY: 'auto',
    width: '100%',
    minHeight: '81.2vh',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  });

  const Video = styled('video')({
    width: '100%',
  });

  // TODO: implement sharing screen
  const isSharingScreen = false;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <VideoPaper>
            <div
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              {/*{isSharingScreen && (*/}
              {/*  <video*/}
              {/*    ref={displayRef}*/}
              {/*    style={{ width: '100%', height: '100%' }}*/}
              {/*    controls*/}
              {/*    autoPlay*/}
              {/*    playsInline*/}
              {/*  />*/}
              {/*)}*/}
              <video
                ref={mainStream}
                style={{
                  position: isSharingScreen ? 'absolute' : 'static',
                  top: isSharingScreen ? '10px' : 'auto',
                  right: isSharingScreen ? '10px' : 'auto',
                  width: isSharingScreen ? '25%' : '100%',
                  height: isSharingScreen ? '25%' : '100%',
                  zIndex: 10,
                  borderRadius: '8px',
                }}
                controls={!isSharingScreen}
                autoPlay
                playsInline
              />
            </div>
            <Tooltip title="Local controls">
              <MyControls
                toggleMute={() => {}}
                isMuted={false}
                toggleVideo={() => {}}
                isVideoPaused={false}
                endCall={handleEndCall}
                isSharingScreen={isSharingScreen}
                setIsSharingScreen={() => {}}
              />
            </Tooltip>
          </VideoPaper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', maxHeight: '80vh' }}>
            <VideoPaper>
              {Object.entries({
                ...remoteStreams,
                [MY_ID]: [myVideoStream, true],
              })
                .filter(([sideUser]) => sideUser !== mainStream[0])
                .map(([sideUser, [sideStream, muted]]) => (
                  <Box sx={{ position: 'relative' }} key={sideUser}>
                    <Tooltip title="Ustaw jako główne wideo">
                      <Video
                        sx={{ cursor: 'pointer' }}
                        autoPlay
                        playsInline
                        muted={muted}
                        onClick={() => {
                          remoteStreams[sideUser][1] = !muted;
                        }}
                        ref={(video) =>
                          video && sideStream && (video.srcObject = sideStream)
                        }
                      />
                    </Tooltip>
                    {`${MY_ID}` !== sideUser &&
                      (muted === true ? (
                        <Tooltip title="Wycisz uczestnika">
                          <IconButton
                            onClick={() => {}}
                            size="small"
                            sx={{
                              position: 'absolute',
                              left: 0,
                              color: '#fff',
                            }}
                          >
                            <MicOffIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Włącz dźwięk od użytkownia">
                          <IconButton
                            onClick={() => {}}
                            size="small"
                            sx={{
                              position: 'absolute',
                              left: 0,
                              color: '#fff',
                            }}
                          >
                            <MicIcon />
                          </IconButton>
                        </Tooltip>
                      ))}
                  </Box>
                ))}
            </VideoPaper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Communicator;
