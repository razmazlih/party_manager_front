import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { loginUser, setAuthToken } from '../services/api';
import './styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        loginUser({ username, password })
            .then((response) => {
                const { access, refresh } = response.data;
                const decodedToken = jwtDecode(access);
                const user_id = decodedToken.user_id;

                if (user_id) {
                    setAuthToken(access);
                    localStorage.setItem('authToken', access);
                    localStorage.setItem('refreshToken', refresh);
                    localStorage.setItem('userId', user_id);

                    navigate('/');
                } else {
                    alert('Login failed. Invalid token.');
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                alert('Login failed. Please check your credentials.');
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;