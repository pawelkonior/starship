import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";

import CourseCommunicatorContainer from "./CourseCommunicatorContainer.jsx";
import { getData } from "../../helpers/api.js";
import API from "../../data/constants/api_routes.js";

function Course() {
  const { courseId } = useParams();
  const { data, isPending } = useQuery({
    queryKey: [courseId],
    queryFn: getData(API.courses.course(courseId)),
  });
  const isOnline = true;

  return isPending ? null : (
    <>
      <section>
        <h2>Tytuł kursu: {data.title}</h2>
        <ul>
          <li>ID kursu: {data.id}</li>
          <li>Utworzony: {dayjs(data.created_at).format("DD.MM.YYYY")}</li>
          <li>Twórca: {data.owner.full_name}</li>
          <p>Opis: {data.description}</p>
          <li>Czas trwania: {data.duration}</li>
          <li>Data kursu: {dayjs(data.course_date).format("DD.MM.YYYY")}</li>
          <li>
            <ul>
              Zapisane osoby:
              {!data?.students ? (
                <div>nikt się jeszcze nie zapisał</div>
              ) : (
                data.students.map((student) => {
                  if (student.full_name !== "")
                    return <li key={student.id}>{student.full_name}</li>;
                })
              )}
            </ul>
          </li>
        </ul>
      </section>
      <section>{isOnline && <CourseCommunicatorContainer />}</section>
    </>
  )
}

export default Course;
