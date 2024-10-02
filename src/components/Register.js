import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode'; // תיקון הייבוא
import { registerUser, loginUser, setAuthToken } from '../services/api'; 

const Register = () => {
    const [userData, setUserData] = useState({
        role: 'regular',
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleRegister = () => {
        registerUser(userData)
            .then(() => {
                // לאחר רישום מוצלח, מבצעים התחברות
                loginUser({ username: userData.username, password: userData.password })
                    .then((response) => {
                        const { access, refresh } = response.data; // קבלת ה-access ו-refresh tokens
                        
                        setAuthToken(access);
                        
                        // פענוח ה-access token כדי לקבל את ה-user_id
                        const decodedToken = jwtDecode(access);
                        const user_id = decodedToken.user_id;

                        localStorage.setItem('authToken', access); // שמירת ה-access token
                        localStorage.setItem('refreshToken', refresh); // שמירת ה-refresh token
                        localStorage.setItem('userId', user_id);

                        navigate('/'); // חזרה לדף הבית
                    })
                    .catch((error) => {
                        console.error('Login error:', error);
                        alert('Registration successful, but login failed. Please log in manually.');
                    });
            })
            .catch((error) => {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            });
    };

    return (
        <div>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;