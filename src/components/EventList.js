import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';
import './styles.css';
import './EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchEvents().then((response) => {
            const currentDate = new Date();
            const futureEvents = response.data
                .filter(event => new Date(event.date) > currentDate)
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // מיון האירועים מהקרוב לרחוק
            setEvents(futureEvents);
            setFilteredEvents(futureEvents);
        });
    }, []);

    const handleFilter = () => {
        const filtered = events.filter(event => {
            const eventDate = new Date(event.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || eventDate >= start) && (!end || eventDate <= end);
        });
        setFilteredEvents(filtered);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setFilteredEvents(events);
    };

    return (
        <div className="event-list-container">
            <h1>Upcoming Events</h1>
            <div className="filter-container">
                <h2>Filter Events</h2>
                <div className="filter-inputs">
                    <div className="filter-field">
                        <label htmlFor="start-date">Start Date:</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="filter-field">
                        <label htmlFor="end-date">End Date:</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="filter-buttons">
                    <button className="filter-button" onClick={handleFilter}>Apply Filter</button>
                    <button className="reset-button" onClick={handleReset}>Reset</button>
                </div>
            </div>
            {filteredEvents.length === 0 ? (
                <p>No events found for the selected date range.</p>
            ) : (
                filteredEvents.map((event) => (
                    <Link to={`/events/${event.id}`} key={event.id} className="event-card">
                        <h2 className="event-title">{event.name}</h2>
                        <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
                    </Link>
                ))
            )}
        </div>
    );
};

export default EventList;