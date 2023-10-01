import { Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import GlassStack from "./GlassStack.jsx";
import "./CourseList.css";
import { IconInput } from "./IconInput.jsx";
import { CardHover } from "./CardHover.jsx";
import useAxios from "../../hooks/useAxios.js";
import { userCoursesAtom } from "../../store.js"

function randomElement(elements) {
    const index = Math.round(Math.random() * (elements.length - 1))
    return elements[index]
}

const images = [
    "https://www.freecodecamp.org/news/content/images/2022/01/image-41.png",
    "https://s3-alpha.figma.com/hub/file/3593793199/88f39328-6ad7-4348-954f-ef9a900d90de-cover.png",
    "https://www.elegantthemes.com/blog/wp-content/uploads/2023/07/WordPress-for-Beginners.jpg",
    "https://i.ytimg.com/vi/O5TdnuUhIgs/maxresdefault.jpg",
    "https://blog.getform.io/content/images/2019/05/1_c6A66OYbzcl6xCB_yap9xQ.png",
    "https://i.ytimg.com/vi/IU0ClaSoF9Y/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCbklLjxkPKqCvDqZS3HwoZsjZFpA",
    "https://i.ytimg.com/vi/Ylc-XzLYN0s/maxresdefault.jpg",
    "https://i.ytimg.com/vi/3g6irf8c8lw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAqKXdnfz896tKkFOudmlhd0iDAtg"
]

const courseAtom = atom([]);

function useCourseList(query) {
    const [data, setData] = useAtom(courseAtom);
    const axios = useAxios()

    useEffect(() => {
        if (data.length) return

        axios.get("/api/v1/courses/")
            .then(response => {
                const projects = response.data.map(({ id, name, description }) => ({
                    id,
                    name,
                    description,
                    price: Math.round(5 + Math.random() * 10),
                    rating: 4 + Math.round(Math.random() * 10) / 10,
                    reviews: Math.floor(Math.random() * 30),
                    duration: Math.floor(Math.random() * 60),
                    image: randomElement(images)
                }))
                setData(projects)
            })
            .catch(e => console.log(e))
    }, [])

    return {
        data: data.filter(item => {
            return item.name.toLowerCase().includes(query.toLowerCase())
        }).slice(10)
    }
}

export default function CourseList() {
    const userCourses = useAtomValue(userCoursesAtom);
    const [query, setQuery] = useState('');
    const { data: courseList } = useCourseList(query);

    return (
        <Container
            style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px", paddingBottom: 50 }}>

            <GlassStack>
                <Grid container alignItems="center" justifyContent="space-between">
                    <div style={{ display: "flex", columnGap: 26, width: '100%', alignItems: 'center' }}>
                        <Typography
                            className={"titleSearch"}
                            variant="h5"
                            component="h2"
                            my={2}
                            sx={{ color: 'white', margin: 0, minWidth: 180 }}
                        >
                            Wyszukaj kurs
                        </Typography>
                        <IconInput
                            position="start"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>
                </Grid>
            </GlassStack>

            {
                userCourses.length ? (
                    <GlassStack label="Twoje kursy">
                        <Grid container gap={2}>
                            {userCourses.length && userCourses.map((course) => (
                                <CardHover key={course.id} course={course} />
                            )
                            )}
                        </Grid>
                    </GlassStack>
                ) : null
            }

            <GlassStack label="Najbliższe kursy">
                <Grid container gap={2}>
                    {courseList.length !== 0 && courseList.map((course) => (
                        <CardHover key={course.id} course={course} />
                    )
                    )}
                </Grid>
            </GlassStack>
            <GlassStack label="Kursy wybrane na podstawie Twoich zainteresowań">
                <Grid container gap={2}>
                    {courseList.length !== 0 && courseList.map((course) => (
                        <CardHover key={course.id} course={course} />
                    )
                    )}
                </Grid>
            </GlassStack>
            <GlassStack label="Sugerowane przez twojego Asynstenta AI">
                <Grid container gap={2}>
                    {courseList.length !== 0 && courseList.map((course) => (
                        <CardHover key={course.id} course={course} />
                    )
                    )}
                </Grid>
            </GlassStack>
        </Container >
    );
}

export const styles = {
    card: {
        color: 'white',
        cursor: 'pointer'
    },
}
