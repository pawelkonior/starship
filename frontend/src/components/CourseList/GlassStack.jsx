import Box from "@mui/material/Box";
import {Typography} from "@mui/material";

function GlassStack({label, children}) {
    return (
        <Box style={{borderRadius: '20px',
            border: "2px solid rgba(255, 255, 255, 0.20)",
            background: "linear-gradient(180deg, rgba(217, 217, 217, 0.25) 0%, rgba(217, 217, 217, 0.05) 100%)",
            boxShadow: "0px 4px 16px -1px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(10px)",
            padding: "11px 20px"}}
        >

            {label && (
                <Typography
                variant="h5"
                component="h2"
                my={2}
                sx={{color: 'white'}}
            >
                {label}
            </Typography>
            )}

            {children}
        </Box>
    );
}

export default GlassStack;