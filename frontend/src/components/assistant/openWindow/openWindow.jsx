import Box from "@mui/material/Box";
import OptionWindow from "../optionWindow/optionWindow.jsx";
import MessagesWindow from "../messagesWindow/MessagesWindow.jsx";
import InputWindow from "../inputWindow/inputWindow.jsx";

function OpenWindow({handleIconClick, messages, setMessages, setInputClosed, inputClosed, isOpen, setIsOpen}) {

    return (
        <Box
            // css={openChatStyle}
            sx={{
                width: "20rem",
                height: "25rem",
                backgroundColor: "rgb(250, 249, 249, 0.3)",
                borderRadius: "4px",
                position: "fixed",
                bottom: '12rem',
                right: "2rem",
                display: isOpen ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)"}}
        >

            <MessagesWindow messages={messages} setInputClosed={setInputClosed}/>
            <InputWindow setMessages={setMessages} setInputClosed={setInputClosed} inputClosed={inputClosed}/>
        </Box>
    );
}

export default OpenWindow;
