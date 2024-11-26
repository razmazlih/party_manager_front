import React from 'react';

const EventHeader = ({ name, date, description }) => {
    return (
        <div>
            <h1>{name}</h1>
            <p className="event-date">{date}</p>
            <p>{description}</p>
        </div>
    );
};

export default EventHeader;