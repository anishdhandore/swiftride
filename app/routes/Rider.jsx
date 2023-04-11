import React, { useState } from 'react';

export default function Rider({ onTripSubmitted }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload trip to IPFS here

    onTripSubmitted();
  };

  return (
    <div>
      <h2>Rider</h2>
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