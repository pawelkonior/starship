import Box from "@mui/material/Box";
import {TypeAnimation} from "react-type-animation";
import React, {useEffect, useRef} from "react";
import {Typography} from "@mui/material";

function UserDm({text}) {
    const dmRef = useRef(null);

    useEffect(() => {
        if (dmRef.current) {
            dmRef.current.scrollIntoView();
            dmRef.current.scrollTop = dmRef.current.scrollHeight + 100000;
        }
    });

    return (
        <Box
            sx={{
                backgroundColor: "#4d7eb7",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                margin: "0.5rem",
                marginRight: '42px',
            }}
            ref={dmRef}
        >
            <TypeAnimation sequence={[text]} speed={90} cursor={false}/>
        </Box>
    );
}

export default UserDm;
