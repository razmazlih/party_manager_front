import React from 'react';

const EventInfo = ({ location, price, availablePlaces }) => {
    return (
        <div>
            <p>Location: {location}</p>
            <p>Price: {price}₪</p>
            <div className="available-places-container">
                <p className="available-places">Available Places: {availablePlaces}</p>
            </div>
        </div>
    );
};

export default EventInfo;