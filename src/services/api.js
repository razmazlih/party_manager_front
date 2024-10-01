import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_URL,
});

// הפונקציות לאינטראקציה עם ה-API
export const registerUser = (userData) => api.post('register/', userData);
export const loginUser = (credentials) => api.post('token/', credentials);
export const fetchEvents = () => api.get('events/');
export const fetchEventDetail = (eventId) => api.get(`events/${eventId}/`);
export const createReservation = (reservationData) => api.post('reservations/', reservationData);
export const fetchUserReservations = (userId) => api.get(`reservations/?user=${userId}`);
export const fetchNotifications = (userId) => api.get(`notifications/?user=${userId}`);
export const createComment = (commentData) => api.post('comments/', commentData);

// הגדרת Token למטרת אימות
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;