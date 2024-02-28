import React, { useState } from "react";
import { Card, CardActions, CardContent, CardMedia, Chip, Rating, Typography, Modal, Grid } from "@mui/material";
import { styles } from "./CourseList.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useCoins } from "../../context/CointContext.jsx";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useAtom } from "jotai"
import { userCoursesAtom } from "../../store.js"

export function CardHover(props) {
    const [open, setOpen] = useState(false); // State to manage modal's open/close
    const [userCourses, setUserCourses] = useAtom(userCoursesAtom);
    const { removeCoin } = useCoins();

    // Handlers for opening and closing modal
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="hoverWrapper">
            <Card
                sx={styles.card}
                style={{ backgroundColor: "#011F26", padding: "10px", cursor: "pointer", height: "100%", display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
                onClick={handleOpen}  // Open modal when mouse enters the card (you can change this as per your requirements)
            >
                <CardMedia
                    component="img"
                    style={{ height: 140, width: '100%' }}
                    image={props.course.image}
                    alt={props.course.name}
                />
                <CardContent style={{width: '100%'}}>
                    <Typography variant="body2">
                        {props.course.name}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ gap: 1, alignSelf: 'flex-end' }} style={{width: '100%'}}>
                    <Chip
                        label={(
                            <span>
                                <RocketLaunchIcon sx={{ color: "gold" }} /> {props.course.price}
                            </span>
                        )}
                        style={{ backgroundColor: "#023440", color: "white" }}
                    />
                    <Chip label={`${props.course.duration} min`} style={{ backgroundColor: "#023440", color: "white" }} />
                </CardActions>
            </Card>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="hover-modal">
                    <Grid
                        justifyContent="space-around"
                        alignItems="center"
                        direction="column"
                        container
                        spacing={2}>
                        <Grid item>
                            <Typography variant="h5" sx={styles.card}>
                                {props.course.name}
                            </Typography>
                        </Grid>
                        <Grid item className="min-w-[150px]">
                            <CardMedia
                                className="my-5"
                                component="img"
                                image={props.course.image}
                                alt={props.course.name}
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="body2" sx={styles.card}>
                        {props.course.description}
                    </Typography>
                    <Grid container direction="row" alignItems="center" className="my-2">
                        <Grid item>
                            <Rating
                                className="me-2"
                                readOnly
                                name="simple-controlled"
                                value={props.course.rating}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" sx={styles.card}>
                                {props.course.rating}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" sx={styles.card}>
                                {`(${props.course.reviews} ocen)`}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Chip
                            label={(
                                <span>
                                    <RocketLaunchIcon sx={{ color: "gold" }} /> {props.course.price}
                                </span>
                            )}
                            style={{ backgroundColor: "#023440", color: "white" }}
                        />
                        <Chip label={`${props.course.duration} min`} style={{ backgroundColor: "#023440", color: "white" }} />
                        <Button
                            variant="contained"
                            disabled={userCourses.map(c => c.id).includes(props.course.id)}
                            onClick={() => {
                                removeCoin(props.course.price)
                                setUserCourses([...userCourses, props.course])
                                setOpen(false)
                            }}
                        >Zapisz się</Button>
                    </Box>
                </div>
            </Modal>
        </div>
    );
}
