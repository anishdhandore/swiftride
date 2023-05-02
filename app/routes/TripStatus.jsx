import Directions from './Directions';
import { useState, useEffect } from 'react';
// Add a function to calculate the estimated trip cost
const calculateTripCost = (distanceInMeters) => {
  const distanceInKilometers = distanceInMeters / 1000;
  const costPerKilometer = 1.5; // Assuming a fixed cost per kilometer
  return distanceInKilometers * costPerKilometer;
};

export default function TripStatus({ userType, selectedTrip, connectedAccount, latitude, longitude }) {
  console.log('Selected Trip:', selectedTrip); // Add this line to log the selected trip's details
  const { rider, driver, riderLatitude, riderLongitude, driverLatitude, driverLongitude } = selectedTrip;
  const [distance, setDistance] = useState(null);
  const [userLocation, setUserLocation] = useState({lat:latitude,lng:longitude});
  
  const isRider = connectedAccount === rider;
  const isDriver = connectedAccount === driver;

  useEffect(() => {
    setUserLocation({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  return (
    <div className="trip-info">
      <h2 className="page-header">{userType === 'rider' ? 'Rider' : 'Driver'} Trip Status</h2>
      <div>
        <Directions
          origin={selectedTrip.pickupLocation}
          destination={userLocation}
          onDistanceChange={setDistance}
          userLocation={userLocation}
        />
        {distance && ( // Display estimated trip cost when distance is available
          <p>
            Estimated trip cost: ${calculateTripCost(distance).toFixed(2)}
          </p>
        )}
      </div>
      <div>
        <p>Origin: {selectedTrip.pickupLocation}</p>
        <p>Destination: {selectedTrip.dropoffLocation}</p>
        <p>User Location: {userLocation.lat}, {userLocation.lng}</p>
      </div>
      <hr />
    </div>
  );
}


