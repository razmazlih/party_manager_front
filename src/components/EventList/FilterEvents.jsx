import React from 'react';

const FilterEvents = ({ startDate, endDate, onStartDateChange, onEndDateChange, onApplyFilter, onResetFilter }) => {
    return (
        <div className="filter-container">
            <h2>Filter Events</h2>
            <div className="filter-inputs">
                <div className="filter-field">
                    <label htmlFor="start-date">Start Date:</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                    />
                </div>
                <div className="filter-field">
                    <label htmlFor="end-date">End Date:</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="filter-buttons">
                <button className="filter-button" onClick={onApplyFilter}>Apply Filter</button>
                <button className="reset-button" onClick={onResetFilter}>Reset</button>
            </div>
        </div>
    );
};

export default FilterEvents;