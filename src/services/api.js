import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const fetchUserReservations = (userId) => {
    const token = localStorage.getItem('authToken');
    return axios.get(`${API_URL}reservations/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const api = axios.create({
    baseURL: API_URL,
});

// הפונקציות לאינטראקציה עם ה-API
export const registerUser = (userData) => api.post('register/', userData);
export const loginUser = (credentials) => api.post('token/', credentials);
export const fetchEvents = () => api.get('events/');
export const fetchEventDetail = (eventId) => api.get(`events/${eventId}/`);
export const createReservation = (reservationData) => {
    const token = localStorage.getItem('authToken');
    return axios.post(`${API_URL}reservations/`, reservationData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
export const fetchNotifications = (userId) => api.get(`notifications/?user=${userId}`);

export const createComment = (commentData) => {
    const token = localStorage.getItem('authToken');
    return axios.post(`${API_URL}comments/`, commentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
// פונקציה לביטול הזמנה
export const cancelReservation = (reservationId) => {
    const token = localStorage.getItem('authToken');
    return axios.post(`${API_URL}reservations/${reservationId}/cancel/`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// פונקציה חדשה לקבלת פרטי הזמנה מסוימת
export const fetchReservationDetail = (reservationId) => {
    const token = localStorage.getItem('authToken');
    return axios.get(`${API_URL}reservations/${reservationId}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// הגדרת Token למטרת אימות
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const fetchComments = (eventId) => {
    return api.get(`comments/?event=${eventId}`);
};

export default api;