import React, { useState, useEffect } from 'react';
import { fetchUserReservations } from '../services/api';
import { Link } from 'react-router-dom';
import './ReservationList.css';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchUserReservations(userId)
                .then((response) => {
                    setReservations(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching reservations:', error);
                });
        }
    }, [userId]);

    const filteredReservations = reservations.filter((reservation) => {
        const eventDate = new Date(reservation.event_date);
        const today = new Date();
        const oneDayAfterEvent = new Date(eventDate);
        oneDayAfterEvent.setDate(eventDate.getDate() + 1);

        return today <= oneDayAfterEvent;
    });

    return (
        <div className="reservation-list-container">
            <h1>My Reservations</h1>
            {filteredReservations.length > 0 ? (
                <div className="reservation-cards">
                    {filteredReservations.map((reservation) => (
                        <div key={reservation.id} className="reservation-card">
                            <Link to={`/reservations/${reservation.id}`}>
                                <h2>{reservation.event_name}</h2>
                            </Link>
                            <p><strong>Status:</strong> {reservation.status}</p>
                            <p><strong>Date:</strong> {new Date(reservation.event_date).toLocaleDateString()}</p>
                            <p><strong>Seats Reserved:</strong> {reservation.seats_reserved}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-reservations-message">No reservations found.</p>
            )}
        </div>
    );
};

export default ReservationList;