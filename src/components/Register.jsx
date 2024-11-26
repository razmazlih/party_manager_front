import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode'; 
import { registerUser, loginUser, setAuthToken } from '../services/api'; 
import './styles.css';

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
                loginUser({ username: userData.username, password: userData.password })
                    .then((response) => {
                        const { access, refresh } = response.data;
                        setAuthToken(access);

                        const decodedToken = jwtDecode(access);
                        const user_id = decodedToken.user_id;

                        localStorage.setItem('authToken', access);
                        localStorage.setItem('refreshToken', refresh);
                        localStorage.setItem('userId', user_id);

                        navigate('/');
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRegister();
        }
    };

    return (
        <div className="auth-container">
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                onKeyPress={handleKeyPress}
            />
            <input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                onKeyPress={handleKeyPress}
            />
            <input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                onKeyPress={handleKeyPress}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;