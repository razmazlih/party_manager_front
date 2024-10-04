import React, { useState, useEffect } from 'react';
import { fetchNotifications } from '../services/api';
import './NotificationList.css';
import './styles.css';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            alert('Please log in to view notifications.');
            return;
        }

        fetchNotifications().then((response) => {
            setNotifications(response.data);
        }).catch((error) => {
            console.error('Error fetching notifications:', error);
            alert('Failed to fetch notifications.');
        });
    }, [userId]);

    return (
        <div className="notification-list-container">
            <h1>Notifications</h1>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        <h3 className="notification-title">{notification.title}</h3>
                        <p className="notification-content">{notification.content}</p>
                        <p className="notification-date">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No notifications found.</p>
            )}
        </div>
    );
};

export default NotificationList;