import Box from "@mui/material/Box";

function OptionWindow({ handleIconClick }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1,
                margin: "0.5rem",
                borderRadius: "5px",
                backgroundColor: "#efeeee",
                cursor: "pointer",
                marginRight: "5px",
            }}
        >
            {/*<MiniIcon/>*/}
        </Box>
    );
}

export default OptionWindow;
