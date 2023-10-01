import React, { useState } from 'react';
import { AppBar, Toolbar, Button, FormGroup, FormControlLabel, Switch, Grid, Typography } from '@mui/material';
import { TwitterPicker } from "react-color"
import PaletteIcon from './PaletteIcon';
import ClearIcon from './ClearIcon';
import UndoIcon from './UndoIcon';
import RedoIcon from './RedoIcon';
import CloseIcon from './CloseIcon';

function DrawingOverlayControls({
    canvasRef,
    drawingEnabled,
    setDrawingEnabled,
    strokeColor,
    setStrokeColor
}) {
    const [enableColorPicker, setEnableColorPicker] = useState(false);

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: 'rgba(255,255,255,0.5)',
                bottom: 'auto',
                top: 0,
                zIndex: 1301 // This ensures the AppBar is above the overlay
            }}
        >
            <Toolbar>
                    <Grid container justifyContent="space-between">
                    <Grid item>
                        {drawingEnabled &&
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                    startIcon={<ClearIcon />}
                                    onClick={() => canvasRef.current.clearCanvas()}>
                                    Czyść
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                    startIcon={<UndoIcon />}
                                    onClick={() => canvasRef.current.undo()}>
                                    Cofnij
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                    startIcon={<RedoIcon />}
                                    onClick={() => canvasRef.current.redo()}>
                                    Ponów
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className="color-picker-button"
                                    sx={{
                                        mr: 1,
                                        px: 0,
                                        py: 1,
                                        backgroundColor: `${strokeColor} !important`
                                    }}
                                    onClick={() => setEnableColorPicker(!enableColorPicker)}>
                                    {enableColorPicker &&
                                        <TwitterPicker
                                            className="color-picker"
                                            triangle="hide"
                                            color={strokeColor}
                                            onChange={(color) => {
                                                setStrokeColor(color.hex)
                                            }} />
                                    }
                                    <PaletteIcon />
                                </Button>
                            </>
                        }
                    </Grid>
                    <Grid item>
                        <Button
                        onClick={()=>setDrawingEnabled(false)}
                        color="error"
                        >
                            <CloseIcon/>
                        </Button>
                    </Grid>
                    </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default DrawingOverlayControls;
