import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';
import './styles.css';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents().then((response) => {
            setEvents(response.data);
        });
    }, []);

    return (
        <div className="container">
            <h1>Events</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <Link to={`/events/${event.id}`}>{event.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;