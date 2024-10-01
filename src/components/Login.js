import React, { useState } from 'react';
import { loginUser, setAuthToken } from '../services/api';
import './styles.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        loginUser({ username, password }).then((response) => {
            const { access, user_id } = response.data;  // נניח שה-API מחזיר גם את ה-user_id
            setAuthToken(access);
            localStorage.setItem('userId', user_id);  // שמירת userId ב-localStorage
            alert('Logged in successfully!');
        }).catch((error) => {
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