import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // תיקון הייבוא
import { loginUser, setAuthToken } from '../services/api';
import './styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        loginUser({ username, password })
            .then((response) => {
                const { access, refresh } = response.data; // קבלת ה-access ו-refresh tokens
    
                // פענוח ה-access token כדי לקבל את ה-user_id
                const decodedToken = jwtDecode(access);
                const user_id = decodedToken.user_id;
    
                if (user_id) { // בדיקה אם user_id קיים
                    setAuthToken(access);
                    localStorage.setItem('authToken', access); // שמירת ה-access token
                    localStorage.setItem('refreshToken', refresh); // שמירת ה-refresh token
                    localStorage.setItem('userId', user_id);
    
                    navigate('/'); // חזרה לדף הבית
                } else {
                    alert('Login failed. Invalid token.');
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert('Login failed. Please check your credentials.');
            });
    };

    return (
        <div className="container">
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;