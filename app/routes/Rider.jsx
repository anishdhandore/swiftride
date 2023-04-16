import React, { useState } from 'react';
import { ethers } from 'ethers';
import LocationInput from './LocationInput';
import tripStorageABI from '../contracts/TripStorageABI.json'; // Import the ABI of the contract

const tripStorageAddress = '0x8072578038B32e38B8aECB524A20df0D4d47Cb97'; // Replace with the address of the deployed contract

export default function Rider({ onTripSubmitted }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

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