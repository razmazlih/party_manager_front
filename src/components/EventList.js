import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';
import './styles.css';
import './EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents().then((response) => {
            const currentDate = new Date();
            const futureEvents = response.data
                .filter(event => new Date(event.date) > currentDate)
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // מיון האירועים מהקרוב לרחוק
            setEvents(futureEvents);
        });
    }, []);

    return (
        <div className="event-list-container">
            <h1>Upcoming Events</h1>
            {events.length === 0 ? (
                <p>No upcoming events.</p> // הודעה במידה ואין אירועים עתידיים
            ) : (
                events.map((event) => (
                    <div key={event.id} className="event-card">
                        <h2 className="event-title">{event.name}</h2>
                        <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
                        <Link to={`/events/${event.id}`} className="event-link">View Details</Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default EventList;