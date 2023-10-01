import {useEffect, useRef} from "react";
import Box from "@mui/material/Box";
import BotDm from "./botDM.jsx";
import UserDm from "./userDM.jsx";

function MessagesWindow({messages, setInputClosed}) {
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (messages[messages.length - 1]?.owner !== "user") {
            setInputClosed(false);
        }
        console.log(messages);
    }, [messages]);

    return (
        <Box
            sx={{
                flex: "8", scrollBehavior: "smooth", overflowY: "scroll",
            }}
            ref={messagesContainerRef}
        >
            {messages.map((msg, index) => {
                if (msg.owner === "bot") {
                    return <BotDm key={index} text={msg.message} messagesContainerRef={messagesContainerRef}/>;
                } else {
                    return <UserDm key={index} text={msg.message}/>;
                }
            })}
        </Box>);
}

export default MessagesWindow;
