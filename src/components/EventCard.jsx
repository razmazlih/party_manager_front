import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event.id}`} key={event.id} className="event-card">
            <h2 className="event-title">{event.name}</h2>
            <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
        </Link>
    );
};

export default EventCard;