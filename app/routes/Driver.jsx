import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import tripStorageABI from '../contracts/TripStorageABI.json'; // ABI of the contract
import Trips from './Trips';

const tripStorageAddress = '0x841731c808cD5689F1f8e09a60259B8fa31EE3b2'; // Address of the deployed contract

export default function Driver({ onTripSelected }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

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
            // Don't print trips submitted by yourself
            if (trip.rider !== currentUserAddress && trip.active) {
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
      setLoading(false);
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
        onTripSelected(tripId); // Pass the driver's connected account
      } catch (error) {
        console.error('Error accepting trip:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="page-title">Driver</h2>
      <div className="trips-list">
        {loading ? (
          <p>Loading trips...</p>
        ) : trips.length > 0 ? (
          trips.map((trip) => (
            <Trips key={trip.id} trip={trip} userType="driver" onTripSelected={handleTripSelected} />
          ))
        ) : (
          <p>No trips available</p>
        )}
      </div>
    </div>
  );
}

