import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import tripStorageABI from '../contracts/TripStorageABI.json'; // Import the ABI of the contract

const tripStorageAddress = '0xaF3ae0572705112aFD9eAf1ECAD3a596bcC2042B'; // Replace with the address of the deployed contract

export default function Driver({ onReturnHome }) {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, provider);

        try {
          const tripCount = await tripStorage.getTripCount();
          const fetchedTrips = [];

          for (let i = 0; i < tripCount; i++) {
            const trip = await tripStorage.trips(i);
            fetchedTrips.push({
              rider: trip.rider,
              pickupLocation: trip.pickupLocation,
              dropoffLocation: trip.dropoffLocation,
            });
          }

          setTrips(fetchedTrips);
        } catch (error) {
          console.error('Error fetching trips:', error);
        }
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h2 className="page-title">Driver</h2>
      <ul>
        {trips.length > 0 ? (
          trips.map((trip, index) => (
            <li key={index}>
              {trip.pickupLocation} - {trip.dropoffLocation}
            </li>
          ))
        ) : (
          <p>Loading trips...</p>
        )}
      </ul>
    </div>
  );
}