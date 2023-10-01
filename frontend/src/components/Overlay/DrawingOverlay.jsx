import React, { useState, useRef } from 'react';
import DrawingOverlayControls from './DrawingOverlayControls';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import "./style.css"
import PencilIcon from './PencilIcon';
import Fab from '@mui/material/Fab';

function DrawingOverlay({
    drawingEnabled, 
    setDrawingEnabled
}) {
    const [strokeColor, setStrokeColor] = useState('red')
    const canvasRef = useRef()
    
    return drawingEnabled && 
                <>
                <ReactSketchCanvas
                    ref={canvasRef}
                    backgroundImage='transparent'
                    width="100%"
                    height="100%"
                    style={{
                        border: 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        cursor: 'url(brush.svg) 8 8, pointer',
                        zIndex: 1199
                    }}
                    strokeWidth={5}
                    strokeColor={strokeColor}  
                />
                <DrawingOverlayControls
                    canvasRef={canvasRef}
                    drawingEnabled={drawingEnabled}
                    setDrawingEnabled={setDrawingEnabled}
                    strokeColor={strokeColor}
                    setStrokeColor={setStrokeColor}
                />
                </>
            
}

export default DrawingOverlay;