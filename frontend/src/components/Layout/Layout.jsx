import { Outlet } from "react-router-dom";
import { useRef, useState } from "react";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../../utils/themes.js";
import { Navbar } from "./Navbar.jsx";
import ShadowOverlay from "../Overlay/ShadowOverlay.jsx"
import CoreWindow from "../assistant/coreWindow/CoreWindow.jsx";


function Layout() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const containerRef = useRef()

    return (
        <ThemeProvider theme={isDarkTheme ? createTheme(darkTheme) : createTheme(lightTheme)}>
            <CssBaseline>
                <div className="w-full h-full" style={{ minHeight: "100vh", height: 'auto', paddingBottom: "20px" }} ref={containerRef}>
                    <Navbar />
                    <ShadowOverlay targetComponent={containerRef} />
                    <Container className="w-full" >
                        <Outlet />
                        <CoreWindow />
                    </Container>
                </div>
            </CssBaseline>
        </ThemeProvider >
    );
}

export default Layout;
