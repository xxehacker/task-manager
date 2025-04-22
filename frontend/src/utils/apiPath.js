export const BASE_URL = "http://localhost:9000";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GET_PROFILE: "/api/v1/auth/profile",
    UPLOAD_IMAGE:"/api/v1/auth/upload-image"
  },
  USERS: {
    GET_ALL_USERS: "/api/v1/user/",
    GET_USER_BY_ID: (userId) => `/api/v1/user/${userId}`,
    CREATE_USER: "/api/v1/user/create",
    UPDATE_USER_BY_ID: (userId) => `/api/v1/user/${userId}`,
    DELETE_USER: (userId) => `/api/v1/user/${userId}`,
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/v1/task/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/v1/task/user-dashboard-data",
    GET_ALL_TASK: "/api/v1/task/tasks",
    GET_TASK_BY_ID: (taskId) => `/api/v1/task/${taskId}`,
    CREATE_TASK: "/api/v1/task/create",
    UPDATE_TASK_BY_ID: (taskId) => `/api/v1/task/${taskId}`,
    DELETE_TASK_BY_ID: (taskId) => `/api/v1/task/${taskId}`,
  },
};
