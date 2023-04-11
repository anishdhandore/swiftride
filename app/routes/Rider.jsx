import React, { useState } from 'react';

export default function Rider({ onTripSubmitted, onReturnHome }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pickupLocation || !dropoffLocation) {
        alert('Please enter a valid pickup and dropoff location');
        return;
      }

    // Upload trip to IPFS here

    onTripSubmitted();
  };

  return (
    <div>
      <h2>Rider</h2>
      <button onClick={onReturnHome} className="return-home">Home</button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="pickupLocation">Pick-up location:</label>
        <input
          type="text"
          id="pickupLocation"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />
        <br />
        <label htmlFor="dropoffLocation">Drop-off location:</label>
        <input
          type="text"
          id="dropoffLocation"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}