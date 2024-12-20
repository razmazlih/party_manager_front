import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import EventCard from './EventList/EventCard';
import FilterEvents from './EventList/FilterEvents';
import LoadingSpinner from './EventList/LoadingSpinner';
import './styles/EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvents().then((response) => {
            const currentDate = new Date();
            const futureEvents = response.data
                .filter((event) => new Date(event.date) > currentDate)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            setEvents(futureEvents);
            setFilteredEvents(futureEvents);
            setIsLoading(false);
        });
    }, []);

    const handleFilter = () => {
        const filtered = events.filter((event) => {
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
            <FilterEvents
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApplyFilter={handleFilter}
                onResetFilter={handleReset}
            />
            {isLoading ? (
                <LoadingSpinner />
            ) : filteredEvents.length === 0 ? (
                <p>No events found for the selected date range.</p>
            ) : (
                filteredEvents.map((event) => (
                    <EventCard event={event} key={event.id} />
                ))
            )}
        </div>
    );
};

export default EventList;
