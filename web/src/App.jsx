import './App.css';
import { Box } from '@mui/material';
import Learn from 'pages/Learn/Learn.jsx';
import { jsSnippetToJson } from "./helpers/webrtc.js";
import {servers} from "data/constants/webRrtcConfig.js";

function App() {

  return (
    <Box>
      <Learn />
    </Box>
  );
}

export default App;
