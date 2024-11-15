import React, { useState, useEffect } from 'react';
import { fetchReservationDetail, cancelReservation } from '../services/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './styles.css';

const ReservationDetail = () => {
    const { reservationId } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        fetchReservationDetail(reservationId)
            .then((response) => {
                setReservation(response.data);
            })
            .catch((error) => {
                console.error('Error fetching reservation detail:', error);
            });
    }, [reservationId]);

    const handleCancel = (reservationId) => {
        cancelReservation(reservationId)
            .then(() => {
                setReservation((prevReservation) => ({
                    ...prevReservation,
                    status: 'cancelled',
                }));
            })
            .catch((error) => {
                console.error('Error cancelling reservation:', error);
            });
    };

    const handleBackToReservations = () => {
        navigate('/my-reservations');
    };

    if (!reservation) {
        return <p>Loading reservation details...</p>;
    }

    return (
        <div className="reservation-detail-container">
            <h1>{reservation.event_name}</h1>
            <p><strong>Status:</strong> {reservation.status}</p>
            <p><strong>Date:</strong> {new Date(reservation.event_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
            <p><strong>Seats Reserved:</strong> {reservation.seats_reserved}</p>
            <p><strong>Reservation Date:</strong> {new Date(reservation.reservation_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
            {reservation.verification_code && (
                <div>
                    <p><strong>Verification Code:</strong></p>
                    <QRCodeCanvas value={reservation.verification_code} size={150} />
                    {reservation.is_verified && (
                        <p style={{ color: 'green' }}>Scanned</p>
                    )}
                </div>
            )}
            <div className="buttons-container">
                <button className="back-button" onClick={handleBackToReservations}>
                    Back to Reservations
                </button>
                {reservation.status === 'pending' && (
                    <button className="cancel-button" onClick={() => handleCancel(reservation.id)}>
                        Cancel Reservation
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReservationDetail;