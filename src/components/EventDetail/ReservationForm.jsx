import React, { useState } from 'react';

const ReservationForm = ({ availablePlaces, onReserve }) => {
    const [seats, setSeats] = useState(1);

    const handleReservation = () => {
        onReserve(seats);
    };

    return (
        <div className="reservation-container">
            <label>
                Seats:
                <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    min="1"
                    max={availablePlaces}
                />
            </label>
            <button onClick={handleReservation}>Reserve</button>
        </div>
    );
};

export default ReservationForm;