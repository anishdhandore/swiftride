import React from 'react';

const Trips = ({ trip, userType, onTripSelected }) => {
  return (
    <div className={`trip-card ${userType}`}>
      <div className="trip-info">
        <h3>{trip.pickupLocation} - {trip.dropoffLocation}</h3>
        <p>Rider: {trip.rider}</p>
      </div>
      {userType === 'driver' && trip.active && (
        <button className="select-trip" onClick={() => onTripSelected(trip.id)}>
          <span>Select Trip</span>
        </button>
      )}
    </div>
  );
};

export default Trips;
