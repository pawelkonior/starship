import axios from "axios";

export async function getCourseList(type) {
    // TODO: API for selected courses
    const response = await axios.get('/api/v1/courseList/');

    return response.data;
}