import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


const api = axios.create({
    baseURL: API_URL,
});

// הוספת Interceptor ל-Axios לבדיקת תוקף ה-token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // אם הטוקן לא תקף, נמחוק את הטוקן 
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
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
export const registerUser = (userData) => {
    const lowercaseUserData = { ...userData, username: userData.username.toLowerCase() };
    return api.post('register/', lowercaseUserData);
};

export const loginUser = (credentials) => {
    const lowercaseCredentials = { ...credentials, username: credentials.username.toLowerCase() };
    return api.post('token/', lowercaseCredentials);
};

export const fetchEvents = () => api.get('events/name-date/');
export const fetchEventDetail = (eventId) => api.get(`events/${eventId}/`);

export const fetchUserReservations = (userId) => {
    return api.get(`reservations/?user=${userId}`);
};

export const createReservation = (reservationData) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post('reservations/', reservationData);
};

export const fetchNotifications = () => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.get('notifications/');
};

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

export const fetchUserIsOrganizer = () => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.get('user/is_organizer/');
};

export const createEvent = (eventData) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post('events/', eventData);
};

export const fetchOrganizerEvents = () => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.get('events/organizer/');
};

export const fetchPendingReservations = (eventId) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.get(`events/${eventId}/pending_reservations/`);
};

export const approveReservation = (reservationId) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post(`reservations/${reservationId}/approve/`);
};

export const rejectReservation = (reservationId) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post(`reservations/${reservationId}/reject/`);
};

export const verifyEventCode = (eventId, verificationCode) => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    return api.post(`reservations/${eventId}/verify_event_code/`, { verification_code: verificationCode });
};

export default api;