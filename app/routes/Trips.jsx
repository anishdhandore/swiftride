import { useState } from 'react';
import Directions from './Directions';

// Add a function to calculate the estimated trip cost
const calculateTripCost = (distanceInMeters) => {
  const distanceInKilometers = distanceInMeters / 1000;
  const costPerKilometer = 1.5; // Assuming a fixed cost per kilometer
  return distanceInKilometers * costPerKilometer;
};

const Trips = ({ trip, userType, onTripSelected }) => {
  const [distance, setDistance] = useState(null);
  
  return (
    <div className={`trip-card ${userType}`}>
      <div className="trip-info">
        <h3>Pick up: {trip.pickupLocation} <br></br>- <br></br>Drop off: {trip.dropoffLocation}</h3>
        <Directions
          origin={trip.pickupLocation}
          destination={trip.dropoffLocation}
          onDistanceChange={setDistance}
          userLocation={trip.pickupLocation}
          displayType="rider"/>
        <p>Rider: {trip.rider}</p>
        <div className="status-text">
            <p><strong>Estimated trip cost: ${calculateTripCost(distance).toFixed(2)}</strong></p>
        </div>
        {userType === 'driver' && trip.active && (
          <button className="select-trip" onClick={() => onTripSelected(trip.id)}>
            Select Trip
          </button>       
        )}
      </div>
    </div>
  );
};

export default Trips;
