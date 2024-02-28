import MuiMarkdown from "mui-markdown";
import { Paper, useTheme } from "@mui/material";

function ChatMessage({ sender, message }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={4}
      sx={{
        background: `${sender ? theme.palette.background.main : theme.palette.background.default}`,
        padding: "10px",
        borderRadius: "10px",
        color: `${sender ? theme.palette.text.primary : theme.palette.text.secondary}`,
        border: `1px solid ${sender ? theme.palette.background.main : theme.palette.background.light}`,
        margin: "10px",
        maxWidth: "90%",
        width: "fit-content",
        alignSelf: `${sender ? "flex-start" : "flex-end"}`,
      }}
    >
      <MuiMarkdown>{message}</MuiMarkdown>
    </Paper>
  );
}

export default ChatMessage;
