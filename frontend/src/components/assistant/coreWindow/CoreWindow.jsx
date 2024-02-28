import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import DmIcon from "./dmIcon.jsx";
import OpenWindow from "../openWindow/openWindow.jsx";
import WebSocket from "../ws/ws.jsx";

function CoreWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            "owner": "bot",
            "message": "Witaj programuj_z_pasja! Miło Cię widzieć z powrotem. Minęło 5 dni od Twojego ostatniego logowania. Zauważyłem, że ukończyłeś już dwa kursy: 'Portal zdrowia i fitness' oraz 'Aplikacja do projektowania wnętrz'. Z naszej bazy danych, polecam Ci skupić się na kursach 'Wprowadzenie do Palety Kolorów w Figma' oraz 'Tworzenie Microsoft Power Apps bez linijki kodu'. Mam nadzieję, że będziesz kontynuować swoją naukę z pasją! Powodzenia!"

        }
    ]);
    const [inputClosed, setInputClosed] = useState(false);



    useEffect(() => {
        if(localStorage.getItem("isOpen") === 'true'){
            setIsOpen(true);
        }

        WebSocket.onmessage = (e) => {
            setMessages((prev) => [...prev, {
                message: e.data,
                owner: "bot"
            }]);
            setInputClosed(false);
        }
    }, []);


    function handleIconClick() {
        setIsOpen(!isOpen);
        localStorage.setItem("isOpen", !isOpen);
    }

    return (
        <Box>
            <DmIcon

                w={50}
                h={50}
                handleIconClick={handleIconClick}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            ></DmIcon>

            {

                    <OpenWindow
                        handleIconClick={handleIconClick}
                        messages={messages}
                        setMessages={setMessages}
                        inputClosed={inputClosed}
                        setInputClosed={setInputClosed}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />

            }

        </Box>
    );
}

export default CoreWindow;
