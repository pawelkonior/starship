import { createBrowserRouter, useNavigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./views/Login.jsx";
import Learn from "./views/Learn.jsx";
import Teach from "./views/Teach.jsx"
import CourseList from "./components/CourseList/CourseList.jsx";
import Portfolio from "./views/Portfolio.jsx";
import PortfolioDetail from "./views/PortfolioDetail.jsx";
import PortfolioAdd from "./views/PortfolioAdd.jsx";
import Projects from "./views/Projects.jsx"
import VideoRoom from "./components/VideoRoom/VideoRoom.jsx";
import PresentationContainer from "./views/PresentationContainer.jsx";
import useAuth from "./hooks/useAuth.js";
import { useEffect } from "react";

function RequireLogin({ children }) {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) navigate("/logowanie/")
    }, [isAuthenticated, navigate])

    return children
}

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/logowanie/",
                    element: <Login />
                },
                {
                    path: "/kurs/",
                    element: <RequireLogin><Teach /></RequireLogin>
                },
                {
                    path: "/learn/",
                    element: <RequireLogin><Learn /></RequireLogin>
                },
                {
                    path: "/",
                    element: <RequireLogin><CourseList /></RequireLogin>
                },
                {
                    path: "/portfolio/",
                    element: <RequireLogin><Portfolio /></RequireLogin>
                },
                {
                    path: "/projekty/",
                    element: <RequireLogin><Projects /></RequireLogin>
                },
                {
                    path: "/portfolio/:portfolioId/",
                    element: <RequireLogin><PortfolioDetail /></RequireLogin>
                },
                {
                    path: "/portfolio/dodaj/",
                    element: <RequireLogin><PortfolioAdd /></RequireLogin>
                },
                {
                    path: "/course/:id",
                    element: <VideoRoom />
                },
                {
                    path: "/prezentacja",
                    element: <PresentationContainer />
                },
            ]
        }
    ]
);
