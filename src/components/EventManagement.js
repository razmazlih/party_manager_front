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
    const [scannedCode, setScannedCode] = useState('');  // Store scanned QR code
    const [cameraAvailable] = useState(true);
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

    useEffect(() => {
        const updateVideoDevices = () => {
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    setVideoDevices(videoDevices);
                    // If no device is selected yet, set the first available camera
                    if (videoDevices.length > 0 && !selectedDeviceId) {
                        setSelectedDeviceId(videoDevices[0].deviceId);
                    }
                }).catch((err) => {
                    console.error('Error accessing media devices:', err);
                });
            }
        };
    
        // Initial call to set available video devices
        updateVideoDevices();
    
        // Fetch event details and pending reservations
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
    
        // Check if 'ondevicechange' is supported
        if (navigator.mediaDevices && 'ondevicechange' in navigator.mediaDevices) {
            navigator.mediaDevices.ondevicechange = updateVideoDevices;
        } else {
            // Fallback: Periodically check for device changes
            const intervalId = setInterval(updateVideoDevices, 5000); // Check every 5 seconds
    
            // Cleanup the interval on component unmount
            return () => {
                clearInterval(intervalId);
            };
        }
    
        // Cleanup the event listener on component unmount if supported
        return () => {
            if (navigator.mediaDevices && 'ondevicechange' in navigator.mediaDevices) {
                navigator.mediaDevices.ondevicechange = null;
            }
        };
    }, [eventId, selectedDeviceId]);

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
            setScannedCode(data.text);  // Automatically fill input with the scanned code
            setShowQrScanner(false);    // Close the QR scanner popup
        }
    };

    const handleError = (err) => {
        console.error('Error scanning QR code:', err);
    };

    const verifyCode = async () => {
        try {
            const response = await verifyEventCode(eventId, scannedCode);
            if (response.data.status === 'Already scanned') {
                alert(`Code has already been scanned by: ${response.data.user_name}`);
            } else {
                alert(`Verification successful for: ${response.data.user_name}`);
            }
            setScannedCode('');  // Clear the input field after verification
        } catch (error) {
            console.error('Verification failed:', error);
            alert('Invalid verification code.');
        }
    };

    const handleCameraChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    const closeModal = () => {
        setShowQrScanner(false);
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
            <p><strong>Price:</strong> {eventDetails.price}₪</p>
            <p><strong>Available Places:</strong> {eventDetails.available_places}</p>

            {/* QR Scanner Button */}
            <button onClick={() => setShowQrScanner(true)}>
                {showQrScanner ? 'Hide QR Scanner' : 'Open QR Scanner'}
            </button>

            {/* Input Field and Verify Button */}
            <div className="input-section">
                <label htmlFor="scannedCode">Scanned Code:</label>
                <input
                    readOnly
                    type="text"
                    id="scannedCode"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="The scanned QR code will appear here"
                />
                <button onClick={verifyCode} disabled={!scannedCode}>
                    Verify
                </button>
            </div>

            {/* QR Scanner Popup Modal */}
            {showQrScanner && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <label>Select Camera:</label>
                        <select value={selectedDeviceId} onChange={handleCameraChange}>
                            {videoDevices.map((device, index) => (
                                <option key={index} value={device.deviceId}>
                                    {device.label || `Camera ${index + 1}`}
                                </option>
                            ))}
                        </select>

                        {cameraAvailable ? (
                            <div className="qr-scanner">
                                <QrScanner
                                    delay={300}
                                    onError={handleError}
                                    onScan={handleScan}
                                    style={{ width: '100%' }}
                                    constraints={{ video: { deviceId: selectedDeviceId } }}
                                />
                            </div>
                        ) : (
                            <p>Camera is not available on this device or browser. Please enable camera permissions or use a supported device.</p>
                        )}
                    </div>
                </div>
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