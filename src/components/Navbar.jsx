import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserIsOrganizer, setAuthToken } from '../services/api';
import './styles/styles.css';
import './styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(true); // Default state to open for larger screens
    const [isMobileView, setIsMobileView] = useState(false); // State to detect mobile view

    useEffect(() => {
        if (userId) {
            fetchUserIsOrganizer().then((response) => {
                if (response.data.is_organizer) {
                    setIsOrganizer(true);
                }
            }).catch((error) => {
                console.error('Error fetching user is_organizer status:', error);
            });
        }

        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsMobileView(true);
                setIsMenuOpen(false); // Default closed for mobile view
            } else {
                setIsMobileView(false);
                setIsMenuOpen(true); // Always open for larger screens
            }
        };

        window.addEventListener('resize', handleResize);

        // Call it initially to set the correct view based on the current width
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        setAuthToken(null);
        navigate('/login');
        window.location.reload();
    };

    const toggleMenu = () => {
        if (isMobileView) {
            setIsMenuOpen(!isMenuOpen); // Toggle menu only in mobile view
        }
    };

    return (
        <nav>
            {isMobileView && (
                <button className="menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? 'Close Menu' : 'Open Menu'}
                </button>
            )}
            <ul className={isMenuOpen ? 'open' : 'collapsed'}>
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