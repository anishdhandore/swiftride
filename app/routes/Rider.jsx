import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import LocationInput from './LocationInput';
import tripStorageABI from '../contracts/TripStorageABI.json'; // ABI of the contract
import Directions from './Directions';

const tripStorageAddress = '0x50B8c6ACc233e57D7139b6ae0223B452Cfc15883'; // Address of the deployed contract

// Add a function to calculate the estimated trip cost
const calculateTripCost = (distanceInMeters) => {
  const distanceInKilometers = distanceInMeters / 1000;
  const costPerKilometer = 1.5; // Assuming a fixed cost per kilometer
  return distanceInKilometers * costPerKilometer;
};

export default function Rider({ onTripSubmitted, latitude, longitude }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [distance, setDistance] = useState(null);

  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState({lat:latitude,lng:longitude});

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pickupLocation || !dropoffLocation) {
      alert('Please enter a valid pickup and dropoff location');
      return;
    }

    // Interact with the smart contract to store the trip data
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, signer);

      try {
        const tx = await tripStorage.createTrip(pickupLocation, dropoffLocation);
        await tx.wait();
        onTripSubmitted();
      } catch (error) {
        console.error('Error storing trip:', error);
      }
    }
  };
console.log('COORDS: ', {latitude}, {longitude});


console.log('POSITION: ', userLocation);
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
      <div>
        <Directions
          origin={pickupLocation}
          destination={dropoffLocation}
          onDistanceChange={setDistance}
          userLocation={userLocation}
        />
        {distance && ( // Display estimated trip cost when distance is available
          <p>
            Estimated trip cost: ${calculateTripCost(distance).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}