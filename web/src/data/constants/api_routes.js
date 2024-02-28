const ENV_URL = import.meta.env.PROD ? import.meta.env.VITE_PROD_BASE_URL : import.meta.env.VITE_LOCAL_BASE_URL;
export const BASE_URL = ENV_URL || 'starship-preview.pl';
const ENV_WS_PROTOCOL = !import.meta.env.PROD ? 'ws' : 'wss';
const WS_PROTOCOL = ENV_WS_PROTOCOL || 'wss';
const ENV_HTTP_PROTOCOL = !import.meta.env.PROD ? 'http' : 'https';
export const HTTP_PROTOCOL = ENV_HTTP_PROTOCOL || 'https';

export const API = {
  users: {
    all: '/users/',
    resetPassword: '/users/reset_password/',
    resetPasswordConfirmation: (uid, resetToken) =>
      `/reset_password_confirm/${uid}/${resetToken}`,
    changePassword: '/users/change_password/',
    user: (uid) => `/users/${uid}/`,
    courses: (uid) => `/users/${uid}/courses/`,
    projects: (uid) => `/users/${uid}/projects/`,
    enrollments: (uid) => `/users/${uid}/enrollments/`,
  },
  courses: {
    all: '/courses/',
    course: (courseId) => `/courses/${courseId}/`,
    enrollments: (courseId) => `/courses/${courseId}/enrollments/`,
  },
  jobs: {
    all: '/jobs/',
    detail: (jobId) => `/jobs/${jobId}/`,
  },
  auth: {
    token: '/token/',
  },
  projects: {
    all: '/projects/',
    project: (projectId) => `/projects/${projectId}/`,
  },
  aiChat: (token) => `${WS_PROTOCOL}://${BASE_URL}/ws/chat/?token=${token}`,
  courseCommunicator: (courseId, token) => `${WS_PROTOCOL}://${BASE_URL}/ws/courses/${courseId}/?token=${token}`,
};

export default API;
