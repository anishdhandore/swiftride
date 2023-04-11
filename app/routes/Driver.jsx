import React, { useEffect, useState } from 'react';

export default function Driver() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch trips from IPFS here
  }, []);

  return (
    <div>
      <h2>Driver</h2>
      <ul>
        {trips.map((trip, index) => (
          <li key={index}>
            {trip.pickupLocation} - {trip.dropoffLocation}
          </li>
        ))}
      </ul>
    </div>
  );
}