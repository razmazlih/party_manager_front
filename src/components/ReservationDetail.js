import React, { useState, useEffect } from 'react';
import { fetchReservationDetail } from '../services/api'; // ייבוא הפונקציה מה-API
import { useParams } from 'react-router-dom';

const ReservationDetail = () => {
    const { reservationId } = useParams(); // קבלת ה-ID של ההזמנה מה-URL
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        fetchReservationDetail(reservationId)
            .then((response) => {
                setReservation(response.data); // שמירת פרטי ההזמנה ב-state
            })
            .catch((error) => {
                console.error('Error fetching reservation detail:', error);
            });
    }, [reservationId]);

    if (!reservation) {
        return <p>Loading reservation details...</p>;
    }

    return (
        <div className="reservation-detail-container">
            <h1>{reservation.event_name}</h1>
            <p><strong>Status:</strong> {reservation.status}</p>
            <p><strong>Date:</strong> {reservation.event_date}</p>
            <p><strong>Seats Reserved:</strong> {reservation.seats_reserved}</p>
            <p><strong>Reservation Date:</strong> {reservation.reservation_date}</p>
        </div>
    );
};

export default ReservationDetail;