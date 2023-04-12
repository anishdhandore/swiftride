import React, { useState } from 'react';
import LocationInput from './LocationInput';

export default function Rider({ onTripSubmitted }) {
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
      <h2 className="page-title">Rider</h2>
      <form onSubmit={handleSubmit}>
        <LocationInput
          id="pickupLocation"
          label="Pick-up location:"
          value={pickupLocation}
          onChange={setPickupLocation}
        />
        <br />
        <LocationInput
          id="dropoffLocation"
          label="Drop-off location:"
          value={dropoffLocation}
          onChange={setDropoffLocation}
        />
        <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}