import React, {useEffect, useRef} from "react";
import Box from "@mui/material/Box";
import {TypeAnimation} from 'react-type-animation';
import {Typography} from "@mui/material";

function BotDm({text, messagesContainerRef}) {
    const dmRef = useRef(null);

    const intervalScroll = () => {

        const intervalId = setInterval(() => {
            if (dmRef.current) {
                const currentScrollTop = messagesContainerRef.current.scrollTop;

                messagesContainerRef.current.scrollTop = 100000;
                lastScrollTop = currentScrollTop;
            }
        }, 500);

        let lastScrollTop = messagesContainerRef.current.scrollTop;

        messagesContainerRef.current.addEventListener('scroll', () => {
            const currentScrollTop = messagesContainerRef.current.scrollTop;
            if (currentScrollTop < lastScrollTop) {
                clearInterval(intervalId);
            }
            lastScrollTop = currentScrollTop;
        });
    };


    useEffect(() => {
        if (dmRef.current) {
            intervalScroll();
        }
    }, []);


    return (
        <Box
            sx={{
                backgroundColor: "#e7dd74",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                margin: "0.5rem",
                marginLeft: "42px"
            }}
            ref={dmRef}
        >
            <Typography variant="h6" gutterBottom sx={{color: 'black'}}>
                StarShip AI
            </Typography>
            <TypeAnimation sequence={[text]} speed={90} cursor={false}/>
        </Box>
    );
}

export default BotDm;
