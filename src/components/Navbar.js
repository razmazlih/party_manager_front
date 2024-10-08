import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserIsOrganizer, setAuthToken } from '../services/api';
import './styles.css';  // Importing the styles

const Navbar = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserIsOrganizer().then((response) => {
                if (response.data.is_organizer) { // שינוי הבדיקה לשדה is_organizer
                    setIsOrganizer(true);
                }
            }).catch((error) => {
                console.error('Error fetching user is_organizer status:', error);
            });
        }
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setAuthToken(null); // הסרת האימות
        navigate('/login'); // ניתוב לדף ההתחברות
        window.location.reload(); // רענון הדף
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {!userId && <li><Link to="/login">Login</Link></li>}
                {!userId && <li><Link to="/register">Register</Link></li>}
                {userId && <li><Link to="/my-reservations">My Reservations</Link></li>}
                {userId && isOrganizer && <li><Link to="/organizer-dashboard">Organizer Dashboard</Link></li>}
                {userId && <li><Link to="/notifications">Notifications</Link></li>}
                {userId && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
        </nav>
    );
};

export default Navbar;