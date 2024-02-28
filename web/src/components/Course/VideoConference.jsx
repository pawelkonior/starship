import { useEffect, useRef, useState } from 'react';

import { Box, Grid, IconButton, Paper, styled, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import theme from '../../theme.js';
import { MyControls } from './MyControls.jsx';

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

function SideVideo({
  remoteMutes,
  sideUser,
  sideStream,
  setMainStream,
  MY_ID,
  toggleRemoteMute,
}) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title="Ustaw jako główne wideo">
        <Video
          sx={{ cursor: 'pointer' }}
          autoPlay
          playsInline
          muted={remoteMutes[sideUser]}
          onClick={() => {
            setMainStream([sideUser, sideStream]);
          }}
          ref={(video) => {
            if (video && sideStream) {
              const tracks = sideStream
                .getTracks()
                .filter((track) => track.isDisplay || track.kind === 'audio');
              if (
                sideStream.getVideoTracks().find((track) => track.isDisplay)
              ) {
                window.stream = new MediaStream(tracks);
                video.srcObject = window.stream;
              } else {
                video.srcObject = sideStream;
              }
            }
          }}
        />
      </Tooltip>
      {`${MY_ID}` !== sideUser &&
        (remoteMutes[sideUser] === true ? (
          <Tooltip title="Wycisz uczestnika">
            <IconButton
              onClick={() => toggleRemoteMute(sideUser, false)}
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
              onClick={() => toggleRemoteMute(sideUser, true)}
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
  );
}

function MainVideo({
  mainStream,
  // isSharingScreen,
  // setIsSharingScreen,
  // trackChange,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && mainStream[1]) {
      const tracks = mainStream[1]
        .getTracks()
        .filter((track) => track.isDisplay || track.kind === 'audio');
      if (mainStream[1].getVideoTracks().find((track) => track.isDisplay)) {
        window.stream = new MediaStream(tracks);
        videoRef.current.srcObject = window.stream;
      } else {
        videoRef.current.srcObject = mainStream[1];
      }
    }
  }, [mainStream]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        style={{
          position: 'static',
          top: 'auto',
          right: 'auto',
          width: '100%',
          height: '100%',
          zIndex: 10,
          borderRadius: '8px',
        }}
        autoPlay
        playsInline
      />
    </div>
  );
}

function VideoConference({
  localStream,
  localVideoStream,
  trackChange,
  remoteStreams,
  endCall,
  isSharingScreen,
  setIsSharingScreen,
  MY_ID,
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [mainStream, setMainStream] = useState([`${MY_ID}`, localVideoStream]);
  const [isVideoPaused, setVideoPaused] = useState(false);
  const [remoteMutes, setRemoteMutes] = useState(
    Object.fromEntries(Object.keys(remoteStreams).map((key) => [key, false])),
  );

  useEffect(() => {
    setMainStream([`${MY_ID}`, localVideoStream]);
  }, [localVideoStream]);

  const toggleMute = () => {
    localStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setVideoPaused(!isVideoPaused);
  };

  const toggleRemoteMute = (remoteUser, bool) => {
    const updatedMutes = {
      ...remoteMutes,
      [remoteUser]: bool,
    };
    setRemoteMutes(updatedMutes);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <VideoPaper>
            <MainVideo
              mainStream={mainStream}
              trackChange={trackChange}
              isSharingScreen={isSharingScreen}
              setIsSharingScreen={setIsSharingScreen}
            />
            <Tooltip title="Local controls">
              <MyControls
                toggleMute={toggleMute}
                isMuted={isMuted}
                toggleVideo={toggleVideo}
                isVideoPaused={isVideoPaused}
                endCall={endCall}
                isSharingScreen={isSharingScreen}
                setIsSharingScreen={setIsSharingScreen}
              />
            </Tooltip>
          </VideoPaper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', maxHeight: '80vh' }}>
            <VideoPaper>
              {Object.entries({ ...remoteStreams, [MY_ID]: localVideoStream })
                .filter(([sideUser]) => sideUser !== mainStream[0])
                .map(([sideUser, sideStream]) => (
                  <SideVideo
                    key={sideUser}
                    remoteMutes={remoteMutes}
                    sideUser={sideUser}
                    setMainStream={setMainStream}
                    sideStream={sideStream}
                    MY_ID={MY_ID}
                    toggleRemoteMute={toggleRemoteMute}
                  />
                ))}
            </VideoPaper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VideoConference;
