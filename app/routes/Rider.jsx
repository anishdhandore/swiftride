import React, { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import LocationInput from './LocationInput';
import tripStorageABI from '../contracts/TripStorageABI.json'; // ABI of the contract

const tripStorageAddress = '0x50B8c6ACc233e57D7139b6ae0223B452Cfc15883'; // Address of the deployed contract

export default function Rider({ onTripSubmitted, latitude, longitude }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');

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
// Initialize the map
useEffect(() => {
  if (userLocation) {
    const googleScript = document.createElement('script');
    googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAQX5mgD3zPot1LnEnaHCChljJzdUf6ziQ&libraries=&callback=initMap`;
    window.document.body.appendChild(googleScript);

    console.log('Adding Google Maps API load event listener');
    googleScript.addEventListener('load', () => {
      console.log('Google Maps API loaded:', typeof window.google.maps !== 'undefined');

      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 14,
      });

      const marker = new window.google.maps.Marker({
        position: userLocation,
        map: map,
      });
    });
  }
}, [userLocation]);

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
        <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      </form>
    </div>
  );
}