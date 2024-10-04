import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL: API_URL,
});

// הוספת Interceptor ל-Axios לבדיקת תוקף ה-token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // אם הטוקן לא תקף, נמחוק את הטוקן ונפנה לדף ההתחברות
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            
            // ניתוב לדף ההתחברות
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// הגדרת Token למטרת אימות
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// הפונקציות לאינטראקציה עם ה-API
export const registerUser = (userData) => api.post('register/', userData);
export const loginUser = (credentials) => api.post('token/', credentials);
export const fetchEvents = () => api.get('events/');
export const fetchEventDetail = (eventId) => api.get(`events/${eventId}/`);
export const fetchUserReservations = (userId) => {
    return api.get(`reservations/?user=${userId}`);
};
export const createReservation = (reservationData) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post('reservations/', reservationData);
};
export const fetchNotifications = (userId) => api.get(`notifications/?user=${userId}`);
export const createComment = (commentData) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post('comments/', commentData);
};
export const deleteComment = (commentId) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.delete(`comments/${commentId}/`);
};
export const cancelReservation = (reservationId) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post(`reservations/${reservationId}/cancel/`);
};
export const fetchReservationDetail = (reservationId) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.get(`reservations/${reservationId}/`);
};
export const fetchComments = (eventId) => {
    return api.get(`comments/?event=${eventId}`);
};

export default api;