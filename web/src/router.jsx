import {createBrowserRouter, Navigate} from 'react-router-dom';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import App from './App.jsx';
import Layout from './components/Layout/Layout.jsx';
import Portfolio from './pages/Portfolio/Portfolio.jsx';
import Learn from './pages/Learn/Learn.jsx';
import AddCourse from './pages/AddCourse/AddCourse.jsx';
import Draw from './pages/Draw.jsx';
import JobOffers from "./pages/JobOffers.jsx";
import Login from './pages/Login.jsx';
import Projects from './pages/Projects.jsx';
import User from './pages/User/User.jsx';
import {useAuth} from './hooks/useAuth';
import {AuthProvider} from './components/Providers/AuthProvider.jsx';
import Register from './pages/Register.jsx';
import Course from './components/Course/Course.jsx';
import Error404 from './components/Errors/Error404.jsx';
import ErrorBoundary from './components/Errors/ErrorBoundary.jsx';
import ErrorFallback from './components/Errors/ErrorFallback.jsx';
import JobOfferDetail from "./pages/JobOfferDetail.jsx";
import AddProject from 'pages/Portfolio/AddProject.jsx';
import CourseCommunicatorContainer from "./components/Course/CourseCommunicatorContainer.jsx";
import AssistantChat from "./pages/AssistantChat/AssistantChat.jsx";

// eslint-disable-next-line react/prop-types,react-refresh/only-export-components
const ProtectedRoute = ({children}) => {
    const {user, isLoading} = useAuth();

    if (!isLoading) {
        if (user) {
            return children;
        } else {
            return <Navigate to="/zaloguj-sie"/>;
        }
    }
};
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary fallback={<ErrorFallback />}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    ),
    children: [
      {
        path: '*',
        element: <Error404 />,
      },
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/projekty',
        element: (
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        ),
      },
      {
        path: '/portfolio/:userId',
        element: (
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        ),
      },
      {
        path: '/ucz-sie',
        element: <Learn />,
      },
      {
        path: '/ucz-sie/:courseId',
        element: <Course />,
      },
      {
        path: '/kurs/:uid',
        element: <CourseCommunicatorContainer />,
      },
      {
        path: '/dodaj-kurs',
        element: (
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dodaj-projekt',
        element: (
          <ProtectedRoute>
            <AddProject />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rysuj',
        element: <Draw />,
      },
      {
        path: '/zaloguj-sie',
        element: <Login />,
      },
      {
        path: '/zarejestruj-sie',
        element: <Register />,
      },
      {
        path: '/uzytkownik',
        element: (
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        ),
      },
      {
        path: '/asystent',
        element: (
          <ProtectedRoute>
            <AssistantChat />
          </ProtectedRoute>
        ),
      },
    ],
  },
    {
        path: '/',
        element: (
            <ErrorBoundary fallback={<ErrorFallback/>}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Layout/>
                    </AuthProvider>
                </QueryClientProvider>
            </ErrorBoundary>
        ),
        children: [
            {
                path: '*',
                element: <Error404/>,
            },
            {
                path: '/',
                element: <App/>,
            },
            {
                path: '/projekty',
                element: (
                    <ProtectedRoute>
                        <Projects/>
                    </ProtectedRoute>
                ),
            },
            {
                path: '/portfolio',
                element: (
                    <ProtectedRoute>
                        <Portfolio/>
                    </ProtectedRoute>
                ),
            },
            {
                path: '/ucz-sie',
                element: <Learn/>,
            },
            {
                path: '/ucz-sie/:courseId',
                element: <Course/>,
            },
            {
                path: '/dodaj-kurs',
                element: (
                    <ProtectedRoute>
                        <AddCourse/>
                    </ProtectedRoute>
                ),
            },
            {
                path: '/rysuj',
                element: <Draw/>,
            },
            {
                path: '/zaloguj-sie',
                element: <Login/>,
            },
            {
                path: '/zarejestruj-sie',
                element: <Register/>,
            },
            {
                path: '/uzytkownik',
                element: (
                    <ProtectedRoute>
                        <User/>
                    </ProtectedRoute>
                ),
            },
            {
                path: '/oferty',
                element: (
                    <ProtectedRoute>
                        <JobOffers/>
                    </ProtectedRoute>
                )
            },
            {
                path: '/oferty/:offerId',
                element: (
                    <ProtectedRoute>
                        <JobOfferDetail/>
                    </ProtectedRoute>
                )
            }
        ],
    },
]);

export default router;
