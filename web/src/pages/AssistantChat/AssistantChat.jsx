import { useEffect, useRef, useState } from "react";

import { Box, Button, TextField, useTheme } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import ChatMessage from './ChatMessage.jsx';
import Loader from 'components/Loader/Loader.jsx';
import { useAuth } from 'hooks/useAuth.js';
import { useSockets } from 'hooks/useSockets.js';
import { useLocalStorage } from "hooks/useLocalStorage.js";
import api_routes from 'data/constants/api_routes.js';

const aiAssistantFormat = (message, user) => {
  return {
    sender: user,
    message_text: message,
  };
};

function AssistantChat() {
  const { user, tokens } = useAuth();
  const [messages, setMessages] = useLocalStorage('messages', []);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const scrollableContainerRef = useRef(null);
  const theme = useTheme();

  const handleMessage = ({ data }) => {
    setMessages((previousMessages) => [...previousMessages, JSON.parse(data)]);
    setIsWaiting(false);
  };

  const { ws, isConnected } = useSockets(
    api_routes.aiChat(tokens.access),
    handleMessage,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollTop =
          scrollableContainerRef.current.scrollHeight;
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [messages, isWaiting]);

  const handlePrompt = () => {
    if (ws && isConnected) {
      const message = aiAssistantFormat(aiPrompt, user.email);
      ws.send(JSON.stringify(message));
      setMessages((previousMessages) => [...previousMessages, message]);
      setAiPrompt('');
      setIsWaiting(true);
    } else {
      console.error('WebSocket connection is not available.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        ref={scrollableContainerRef}
        sx={{
          overflowY: 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'flex-start',
        }}
      >
        {messages.length > 0 &&
          messages.map(({ message_text, sender }, index) => (
            <ChatMessage
              key={index}
              sender={sender !== 'BOT'}
              message={message_text}
            />
          ))}

        {isWaiting && <><Loader /> <Box sx={{m: 2}}></Box></>}
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'bottom',
          bgcolor: theme.palette.background.default,
          borderTop: '2px solid',
          borderColor: 'primary.light',
          p: 2,
        }}
      >
        <TextField
          sx={{
            height: 40,
            my: 0,
            mx: 2,
          }}
          fullWidth
          type="text"
          name="ai-prompt"
          placeholder="Zadaj pytanie programistyczne, a nasz asystent odpowie!"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          disabled={isWaiting}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePrompt();
            }
          }}
        />
        <Button
          sx={{
            height: 55,
            my: 0,
            color: 'text.contrast',
          }}
          variant="contained"
          color="primary"
          onClick={handlePrompt}
          disabled={!isConnected || isWaiting}
          size="large"
        >
          Wyślij
        </Button>
      </Box>
    </Box>
  );
}

export default AssistantChat;
