import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserRole } from '../services/api';

const OrganizerDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserRole().then((response) => {
            if (response.data.role !== 'organizer') {
                // אם המשתמש אינו מארגן, ננתב אותו לדף הבית
                navigate('/');
            }
        }).catch((error) => {
            console.error('Error fetching user role:', error);
            // במקרה של שגיאה, ננתב את המשתמש לדף הבית
            navigate('/');
        });
    }, [navigate]);

    return (
        <div>
            <h1>Organizer Dashboard</h1>
            <p>This is where the organizer can manage events.</p>
        </div>
    );
};

export default OrganizerDashboard;