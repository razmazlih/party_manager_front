import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventDetail, fetchPendingReservations, approveReservation, rejectReservation, verifyEventCode } from '../services/api';
import QrScanner from 'react-qr-scanner';
import './EventManagement.css';

const EventManagement = () => {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [pendingReservations, setPendingReservations] = useState([]);
    const [showQrScanner, setShowQrScanner] = useState(false);
    const [setScannedCode] = useState('');
    const [cameraAvailable, setCameraAvailable] = useState(true); // משתנה לבדיקה אם המצלמה זמינה

    useEffect(() => {
        // בדיקה אם הדפדפן תומך ב- getUserMedia
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(() => {
                    setCameraAvailable(true);
                })
                .catch((err) => {
                    console.error('Camera not accessible:', err);
                    setCameraAvailable(false);
                });
        } else {
            setCameraAvailable(false);
        }

        fetchEventDetail(eventId).then((response) => {
            setEventDetails(response.data);
        }).catch((error) => {
            console.error('Error fetching event details:', error);
        });

        fetchPendingReservations(eventId).then((response) => {
            setPendingReservations(response.data);
        }).catch((error) => {
            console.error('Error fetching pending reservations:', error);
        });
    }, [eventId]);

    const handleApprove = (reservationId) => {
        approveReservation(reservationId).then(() => {
            const updatedReservations = pendingReservations.filter(reservation => reservation.id !== reservationId);
            setPendingReservations(updatedReservations);
        }).catch((error) => {
            console.error('Error approving reservation:', error);
        });
    };

    const handleReject = (reservationId) => {
        rejectReservation(reservationId).then(() => {
            const updatedReservations = pendingReservations.filter(reservation => reservation.id !== reservationId);
            setPendingReservations(updatedReservations);
        }).catch((error) => {
            console.error('Error rejecting reservation:', error);
        });
    };

    const handleScan = (data) => {
        if (data) {
            setScannedCode(data.text);
            verifyCode(data.text);
        }
    };

    const handleError = (err) => {
        console.error('Error scanning QR code:', err);
    };

    const verifyCode = async (verificationCode) => {
        try {
            const response = await verifyEventCode(eventId, verificationCode);
            if (response.data.status === 'Already scanned') {
                alert(`Code has already been scanned by: ${response.data.user_name}`);
            } else {
                alert(`Verification successful for: ${response.data.user_name}`);
            }
        } catch (error) {
            console.error('Verification failed:', error);
            alert('Invalid verification code.');
        }
    };

    if (!eventDetails) {
        return <div>Loading event details...</div>;
    }

    return (
        <div className="event-management-container">
            <h1>{eventDetails.name}</h1>
            <p><strong>Date:</strong> {new Date(eventDetails.date).toLocaleString()}</p>
            <p><strong>Description:</strong> {eventDetails.description}</p>
            <p><strong>Location:</strong> {eventDetails.location}</p>
            <p><strong>Price:</strong> ${eventDetails.price}</p>
            <p><strong>Available Places:</strong> {eventDetails.available_places}</p>

            <button onClick={() => setShowQrScanner(!showQrScanner)}>
                {showQrScanner ? 'Hide QR Scanner' : 'Open QR Scanner'}
            </button>

            {showQrScanner && cameraAvailable ? (
                <div className="qr-scanner">
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%' }}
                    />
                </div>
            ) : (
                !cameraAvailable && <p>Camera is not available on this device or browser. Please enable camera permissions or use a supported device.</p>
            )}

            <div className="pending-reservations-section">
                <h2>Pending Reservations</h2>
                <ul>
                    {pendingReservations.length > 0 ? (
                        pendingReservations.map((reservation) => (
                            <li key={reservation.id}>
                                {reservation.user_name}
                                <button onClick={() => handleApprove(reservation.id)}>Approve</button>
                                <button onClick={() => handleReject(reservation.id)}>Reject</button>
                            </li>
                        ))
                    ) : (
                        <p>No pending reservations.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default EventManagement;