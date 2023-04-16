import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import tripStorageABI from '../contracts/TripStorageABI.json'; // Import the ABI of the contract
import Trips from './Trips';

const tripStorageAddress = '0x8072578038B32e38B8aECB524A20df0D4d47Cb97'; // Replace with the address of the deployed contract

export default function Driver({ onReturnHome }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, provider);
        const currentUserAddress = await provider.getSigner().getAddress();

        try {
          const activeTripCount = await tripStorage.getActiveTripCount();
          const fetchedTrips = [];

          for (let i = 0; i < activeTripCount; i++) {
            const tripId = await tripStorage.activeTrips(i);
            const trip = await tripStorage.trips(tripId);
            if (trip.rider !== currentUserAddress) {
              fetchedTrips.push({
                id: trip.id,
                rider: trip.rider,
                pickupLocation: trip.pickupLocation,
                dropoffLocation: trip.dropOffLocation,
                active: trip.active,
                completed: trip.completed,
              });
            }
          }

          setTrips(fetchedTrips);
        } catch (error) {
          console.error('Error fetching trips:', error);
        }
      }
    };

    fetchTrips();
  }, []);

  const handleTripSelected = async (tripId) => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, signer);
  
      try {
        const tx = await tripStorage.selectTrip(tripId);
        await tx.wait();
        console.log('Trip accepted:', tripId);
      } catch (error) {
        console.error('Error accepting trip:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="page-title">Driver</h2>
      <div className="trips-list">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <Trips key={trip.id} trip={trip} userType="driver" onTripSelected={handleTripSelected} />
          ))
        ) : (
          <p>Loading trips...</p>
        )}
      </div>
    </div>
  );
}

