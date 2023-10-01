import Box from "@mui/material/Box";
import {Input} from "@mui/material";
// import {inputStyles} from "./styles/InputWindow.styles.jsx";
import {useEffect, useRef, useState} from "react";
import WebSocket from "../ws/ws.jsx";

function InputWindow({setMessages, setInputClosed, inputClosed}) {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        // setMessages((prev) => [...prev, {
        //     owner: "bot",
        //     "massage":  "Witaj programuj_z_pasja! Miło Cię widzieć z powrotem. Minęło 5 dni od Twojego ostatniego logowania. Zauważyłem, że ukończyłeś już dwa kursy: 'Portal zdrowia i fitness' oraz 'Aplikacja do projektowania wnętrz'. Z naszej bazy danych, polecam Ci skupić się na kursach 'Wprowadzenie do Palety Kolorów w Figma' oraz 'Tworzenie Microsoft Power Apps bez linijki kodu'. Mam nadzieję, że będziesz kontynuować swoją naukę z pasją! Powodzenia!"
        // }]);
    }, []);

    function handleSendMessage(e) {
        if (e.key === "Enter") {
            setMessages((prev) => [...prev, {
                message: e.target.value,
                owner: "user"
            }]);
            setMsg("");
            setInputClosed(true);
            WebSocket.send(e.target.value);
        }
    }


    return (
        <Box
            sx={{
                "flex": "1",
                margin: "0.5rem",
                position: "relative",
            }}
        >
            {inputClosed && (
                <div className="lds-ring" style={{ position: "absolute", left: "50%", top: -90, transform: 'translateX(-50%)'}}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )
            }

            <Input
                sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "5px",
                    border: "none",
                    borderBottom: "none",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    backgroundColor: "rgba(230, 234, 234, 1)",
                    color: "rgba(0, 53, 67, 0.57)",
                    fontWeight: 400,
                    fontSize: "1rem",
                    fontFamily: "'Source Sans Pro', sans-serif",
                    boxShadow: "none",

                    "&:focus": {
                        boxShadow: "none",
                        outline: "none",
                        borderBottom: "none",
                    },
                }}
                disableUnderline
                // css={inputStyles}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={handleSendMessage}
                autoFocus={true}
            ></Input>
        </Box>
    );
}

export default InputWindow;
