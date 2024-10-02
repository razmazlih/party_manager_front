import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ייבוא של jwtDecode
import { loginUser, setAuthToken } from '../services/api';
import './styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        loginUser({ username, password })
            .then((response) => {
                const { access } = response.data; // קבלת ה-access token
                
                // פענוח ה-access token כדי לקבל את ה-user_id
                const decodedToken = jwtDecode(access);
                const user_id = decodedToken.user_id;
                
                setAuthToken(access);
                localStorage.setItem('userId', user_id);
                
                navigate('/'); // חזרה לדף הבית
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