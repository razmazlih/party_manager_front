import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleRegister = () => {
        registerUser(userData).then(() => {
            alert('User registered successfully!');
        }).catch((error) => {
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