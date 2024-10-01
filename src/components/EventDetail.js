import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventDetail, createReservation } from '../services/api';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState(1);
    const userId = localStorage.getItem('userId'); // קבלת userId מה-localStorage

    useEffect(() => {
        fetchEventDetail(id).then((response) => {
            setEvent(response.data);
        });
    }, [id]);

    const handleReservation = () => {
        if (!userId) {
            alert('Please log in to make a reservation.');
            return;
        }

        const reservationData = {
            user: userId,  // הוספת userId להזמנה
            event: event.id,
            seats_reserved: seats,
        };

        createReservation(reservationData).then((response) => {
            alert('Reservation created successfully!');
        }).catch((error) => {
            console.error('Error creating reservation:', error);
            alert('Failed to create reservation. Please check the input.');
        });
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div>
            <h1>{event.name}</h1>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p>Date: {event.date}</p>
            <p>Price: {event.price}</p>
            <p>Available Places: {event.available_places}</p>
            <div>
                <label>
                    Seats:
                    <input
                        type="number"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        min="1"
                        max={event.available_places}
                    />
                </label>
                <button onClick={handleReservation}>Reserve</button>
            </div>
        </div>
    );
};

export default EventDetail;