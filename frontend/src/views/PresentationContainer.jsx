import { Box, Card, Grid, Typography, CardMedia, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router";

function PresentationContainer(props) {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                width: "1056px",
                height: "850px",
                justifyContent: "center",
                flexShrink: "0",
                borderRadius: '20px',
                margin: '5% auto',
                maxWidth: '600px',
                border: "2px solid rgba(255, 255, 255, 0.20)",
                background: "linear-gradient(180deg, rgba(217, 217, 217, 0.25) 0%, rgba(217, 217, 217, 0.05) 100%)",
                boxShadow: "0px 4px 16px -1px rgba(0, 0, 0, 0.25)",
                backdropFilter: "blur(10px)",
                padding: "20px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: '20px'
            }}
        >
            <Card elevation={0} sx={{ width: '100%', bgcolor: 'transparent', padding: '2rem' }}>
                <CardMedia
                    component="img"
                    height="360"
                />
                <img
                    src={"https://www.ilovefreesoftware.com/wp-content/uploads/2022/10/Featured-10.jpg"}
                >
                </img>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Python Course
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Mój kurs "Naucz się programować w Pythonie!" jest idealnym punktem startowym dla osób, które chcą nauczyć się programowania, niezależnie od ich poziomu doświadczenia. Python to jedno z najbardziej przyjaznych dla początkujących języków programowania, idealne do nauki podstaw programowania i tworzenia aplikacji webowych, analizy danych, oraz wiele innych zastosowań. Ten kurs skupia się na przekazywaniu niezbędnych umiejętności programistycznych w sposób zrozumiały i dostępny.
                    </Typography>
                </CardContent>
            </Card>
            <Button
                onClick={
                () => {
                        navigate("" +
                            "/course/1")
                }
                }
                type={"submit"}
                variant="contained"
            > Rozpocznij </Button>
        </Box>
    );
}

export default PresentationContainer;
