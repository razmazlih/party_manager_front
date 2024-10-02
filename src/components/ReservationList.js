import React, { useState, useEffect } from 'react';
import { fetchUserReservations, cancelReservation } from '../services/api'; // ייבוא הפונקציות מה-API
import { Link } from 'react-router-dom'; // ייבוא Link מ-React Router
import './ReservationList.css'; // ייבוא קובץ ה-CSS

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const userId = localStorage.getItem('userId'); // קבלת userId מ-localStorage

    useEffect(() => {
        // בדיקה אם יש userId
        if (userId) {
            fetchUserReservations(userId)
                .then((response) => {
                    setReservations(response.data); // שמירת ההזמנות ב-state
                })
                .catch((error) => {
                    console.error('Error fetching reservations:', error);
                });
        }
    }, [userId]); // קריאה מחדש כש-userId משתנה

    const handleCancel = (reservationId) => {
        cancelReservation(reservationId)
            .then(() => {
                // עדכון הסטטוס של ההזמנה ל"בטל" ב-state
                setReservations(prevReservations =>
                    prevReservations.map(reservation =>
                        reservation.id === reservationId
                            ? { ...reservation, status: 'cancelled' }
                            : reservation
                    )
                );
            })
            .catch((error) => {
                console.error('Error cancelling reservation:', error);
            });
    };

    return (
        <div className="reservation-list-container">
            <h1>My Reservations</h1>
            {reservations.length > 0 ? (
                <div className="reservation-cards">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="reservation-card">
                            <Link to={`/reservations/${reservation.id}`}>
                                <h2>{reservation.event_name}</h2>
                            </Link>
                            <p><strong>Status:</strong> {reservation.status}</p>
                            <p><strong>Date:</strong> {reservation.event_date}</p>
                            <p><strong>Seats Reserved:</strong> {reservation.seats_reserved}</p>
                            {reservation.status !== 'cancelled' && (
                                <button onClick={() => handleCancel(reservation.id)}>Cancel Reservation</button>
                            )}
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