import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import "./style.css"

function ShadowOverlay({targetComponent}) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const circleSize = 50
    const [isRightButtonDown, setIsRightButtonDown] = useState(false);

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = (event) => {
        if (event.button === 2) {
            setIsRightButtonDown(false)
        }
    };
    const handleMouseDown = (event) => {
        if (event.button === 2) {
            setMousePos({x:-100, y:-100})
            setIsRightButtonDown(true)
        }
    };
    const handleContextMenu = (event) => {
        event.preventDefault(); // prevent default context menu from appearing
    };

    useEffect(() => {

        if (targetComponent.current) {
            targetComponent.current.addEventListener('mousedown', handleMouseDown);
            targetComponent.current.addEventListener('mouseup', handleMouseUp);
            targetComponent.current.addEventListener('contextmenu', handleContextMenu);
        }

        // Cleanup when component is unmounted or targetComponent changes
        return () => {
            if (targetComponent.current) {
                targetComponent.current.removeEventListener('mousedown', handleMouseDown);
                targetComponent.current.removeEventListener('mouseup', handleMouseUp);
                targetComponent.current.removeEventListener('contextmenu', handleContextMenu);
            }
        };
    }, [targetComponent]);

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        color: 'red',
        background: `radial-gradient(
            circle ${circleSize}px at ${mousePos.x}px ${mousePos.y}px, 
            transparent, 
            transparent ${circleSize}px, 
            ${isRightButtonDown? 'rgba(0,0,0,0.5)': 'transparent'} ${circleSize}px)`,
    };
    
    return (
            isRightButtonDown && 
            <Box
                onMouseUp={handleMouseUp} 
                onMouseMove={handleMouseMove}
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1200 // Default z-index for MUI's Modal is 1300, so this is just below
                }}
                style={overlayStyle}
            />
    );
}

export default ShadowOverlay;