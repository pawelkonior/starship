import {Card, CardActions, CardContent, CardMedia, Chip, Rating, Typography} from "@mui/material";

// import {styles} from "./CourseList.jsx";

export function CourseCard(props) {
    return <div className="Wrapper">
        <Card

            // sx={styles.card}
            style={{backgroundColor: "#011F26", padding: "10px"}}
        >
            <CardMedia
                component="img"
                style={{height: 140}}
                image="./src/assets/course_img.png"
                alt={props.course.name}
            />
            <CardContent>
                <Typography variant="body2">
                    {props.course.name}
                </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{gap: 1}}>
                <Chip label={`${props.course.price} PLN`}
                      style={{backgroundColor: "#023440", color: "white"}}/>
                <Chip label={`${props.course.duration} min`}
                      style={{backgroundColor: "#023440", color: "white"}}/>
            </CardActions>

        </Card>
        <div style={{position: "absolute", display: "none"}}>
            <CardMedia
                component="img"
                style={{maxWidth: "20%"}}
                image="./src/assets/course_img.png"
                alt={props.course.name}
            />
            <Typography variant="body2" sx={styles.card}>
                {props.course.name}
            </Typography>
            <Typography variant="body2" sx={styles.card}>
                {props.course.description}
            </Typography>
            <Rating
                readOnly
                name="simple-controlled"
                value={props.course.rating}
            />
            <Typography variant="body2" sx={styles.card}>
                {props.course.rating}
            </Typography>
            <Typography variant="body2" sx={styles.card}>
                {`(${props.course.reviews} ocen)`}
            </Typography>
            <Chip label={`${props.course.price} PLN`}
                  style={{backgroundColor: "#023440", color: "white"}}/>
            <Chip label={`${props.course.duration} min`}
                  style={{backgroundColor: "#023440", color: "white"}}/>
        </div>
    </div>;
}

export const styles = {
    card: {
        color: 'white',
    },
}

export default CourseCard;
