import { forwardRef } from 'react';

import { Box, IconButton } from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff.js';
import MicIcon from '@mui/icons-material/Mic.js';
import VideocamOffIcon from '@mui/icons-material/VideocamOff.js';
import VideocamIcon from '@mui/icons-material/Videocam.js';
import CallEndIcon from '@mui/icons-material/CallEnd.js';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import Tooltip from '@mui/material/Tooltip';

export const MyControls = forwardRef(function MyControls(
  {
    toggleMute,
    isMuted,
    toggleVideo,
    isVideoPaused,
    endCall,
    setIsSharingScreen,
    isSharingScreen,
  },
  // eslint-disable-next-line no-unused-vars
  ref,
) {
  return (
    <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
      <Tooltip title="Wyłącz/włącz mikrofon">
        <IconButton onClick={toggleMute} sx={{ color: '#fff' }}>
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip title="Wyłącz/Włącz kamerkę">
        <IconButton onClick={toggleVideo} color="primary">
          {isVideoPaused ? <VideocamOffIcon /> : <VideocamIcon />}
        </IconButton>
      </Tooltip>
      {!isSharingScreen ? (
        <Tooltip title="Udostępnij ekran">
          <IconButton onClick={() => setIsSharingScreen(true)} color="primary">
            <ScreenShareIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Zatrzymaj udostępnianie ekranu">
          <IconButton onClick={() => setIsSharingScreen(false)} color="error">
            <StopScreenShareIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Rozłącz się">
        <IconButton onClick={endCall} color="error">
          <CallEndIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
});
