import React, { useState, useEffect } from 'react';
import { fetchReservationDetail, cancelReservation } from '../services/api'; // ייבוא הפונקציה מה-API
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

    const handleCancel = (reservationId) => {
        cancelReservation(reservationId)
            .then(() => {
                // עדכון הסטטוס של ההזמנה ל"cancelled" ב-state של ההזמנה הנוכחית
                setReservation(prevReservation => ({
                    ...prevReservation,
                    status: 'cancelled'
                }));
            })
            .catch((error) => {
                console.error('Error cancelling reservation:', error);
            });
    };

    return (
        <div className="reservation-detail-container">
            <h1>{reservation.event_name}</h1>
            <p><strong>Status:</strong> {reservation.status}</p>
            <p><strong>Date:</strong> {new Date(reservation.event_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
            <p><strong>Seats Reserved:</strong> {reservation.seats_reserved}</p>
            <p><strong>Reservation Date:</strong> {new Date(reservation.reservation_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
            {reservation.status === 'pending' && (
                <button onClick={() => handleCancel(reservation.id)}>Cancel Reservation</button>
            )}
        </div>
    );
};

export default ReservationDetail;