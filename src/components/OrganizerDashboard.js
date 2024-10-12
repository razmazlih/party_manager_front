import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserIsOrganizer, createEvent, fetchOrganizerEvents } from '../services/api';
import './OrganizerDashboard.css';
import './styles.css';

const OrganizerDashboard = () => {
    const navigate = useNavigate();
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventPrice, setEventPrice] = useState('');
    const [eventPlaces, setEventPlaces] = useState('');
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchUserIsOrganizer().then((response) => {
            if (!response.data.is_organizer) {
                navigate('/');
            } else {
                fetchOrganizerEvents().then((response) => {
                    setEvents(response.data);
                });
            }
        }).catch((error) => {
            console.error('Error fetching user is_organizer status:', error);
            navigate('/');
        });
    }, [navigate]);

    const handleCreateEvent = (e) => {
        e.preventDefault();
        const eventDateLocal = new Date(eventDate).toISOString();
        const eventData = {
            name: eventName,
            date: eventDateLocal,
            description: eventDescription,
            location: eventLocation,
            price: eventPrice,
            available_places: eventPlaces,
        };

        createEvent(eventData).then((response) => {
            setEvents([...events, response.data]);
            setEventName('');
            setEventDate('');
            setEventDescription('');
            setEventLocation('');
            setEventPrice('');
            setEventPlaces('');
        }).catch((error) => {
            console.error('Error creating event:', error);
            alert('Failed to create event.');
        });
    };

    return (
        <div className="organizer-dashboard-container">
            <h1>Organizer Dashboard</h1>
            
            <div className="create-event-form">
                <h2>Create New Event</h2>
                <form onSubmit={handleCreateEvent}>
                    <div>
                        <label>Event Name:</label>
                        <input 
                            type="text" 
                            value={eventName} 
                            onChange={(e) => setEventName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Event Date and Time:</label>
                        <input 
                            type="datetime-local" 
                            value={eventDate} 
                            onChange={(e) => setEventDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Event Description:</label>
                        <textarea 
                            value={eventDescription} 
                            onChange={(e) => setEventDescription(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Event Location:</label>
                        <input 
                            type="text" 
                            value={eventLocation} 
                            onChange={(e) => setEventLocation(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Event Price:</label>
                        <input 
                            type="number" 
                            value={eventPrice} 
                            onChange={(e) => setEventPrice(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Available Places:</label>
                        <input 
                            type="number" 
                            value={eventPlaces} 
                            onChange={(e) => setEventPlaces(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Create Event</button>
                </form>
            </div>

            <div className="organizer-events-list">
                <h2>Your Events</h2>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>
                                {event.name} - {new Date(event.date).toLocaleDateString()}
                                <button 
                                    onClick={() => navigate(`/event-management/${event.id}`)}
                                    className="manage-event-button"
                                >
                                    Manage Event
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
};

export default OrganizerDashboard;