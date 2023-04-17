import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Rider from './Rider';
import Driver from './Driver';
import TripStatus from './TripStatus';
import tripStorageABI from '../contracts/TripStorageABI.json'; // ABI of the contract

const tripStorageAddress = '0x52455f9ea950F9A7cDA7d76E314Bb06D7f57abA2'; // Address of the deployed contract

export default function Index() {
  const [latitude, setLatitude] = useState('-');
  const [longitude, setLongitude] = useState('-');
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [userType, setUserType] = useState(null);
  const [tripStatus, setTripStatus] = useState(null);
  const [activeTrips, setActiveTrips] = useState([]);

  //Geolocation
  useEffect(() => {
    const success = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    const error = (err) => {
      console.warn(`Error(${err.code}): ${err.message}`);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(success, error, options);
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.warn('Geolocation is not supported by your browser');
    }
  }, []);

  //MetaMask
  const checkMetaMaskAndConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
  
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        // Set connected account
        const account = accounts[0];
        console.log('Connected account:', account);
        setConnectedAccount(account);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.log('MetaMask is not installed');
    }
  };
  
  useEffect(() => {
    const isBrowser = () => typeof window !== 'undefined';
    if (isBrowser() && typeof window.ethereum === 'undefined') {
      setShowWalletPrompt(true);
    }
  }, []);  
  
  //  User type
  const handleUserTypeSelection = (type) => {
    setUserType(type);
  };

  const handleReturnHome = () => {
    setUserType(null);
  };

  const handleTripSubmitted = () => {
    setUserType(null);
    setTripStatus('rider');
  };

  const handleTripSelected = (tripId) => {
    const trip = activeTrips.find((trip) => trip.id === tripId);
    if (trip.rider === connectedAccount || trip.driver === connectedAccount) {
      setTripStatus('driver');
    }
  };

  const fetchActiveTrips = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, provider);
  
      try {
        const activeTripCount = await tripStorage.getActiveTripCount();
        const fetchedTrips = [];
  
        for (let i = 0; i < activeTripCount; i++) {
          const tripId = await tripStorage.activeTrips(i);
          const trip = await tripStorage.trips(tripId);
  
          fetchedTrips.push({
            id: trip.id,
            rider: trip.rider,
            driver: trip.driver,
            pickupLocation: trip.pickupLocation,
            dropoffLocation: trip.dropOffLocation,
            active: trip.active,
            completed: trip.completed,
          });
        }
  
        setActiveTrips(fetchedTrips);
      } catch (error) {
        console.error('Error fetching active trips:', error);
      }
    }
  };

  useEffect(() => {
    fetchActiveTrips();
  }, [connectedAccount]);

  console.log('Active Trips:', activeTrips);
  return (
    <div className="app">
      <head>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCpOazIX4wx6P2FtGFbPlmA1y5GvNsl8UA&libraries=places"></script>
        <link rel="stylesheet" href="/styles/styles.css" />
      </head>
      {connectedAccount && (
        <nav className="navbar">
          <button onClick={handleReturnHome}>Home</button>
          <button onClick={() => handleUserTypeSelection('rider')}>Rider</button>
          <button onClick={() => handleUserTypeSelection('driver')}>Driver</button>
        </nav>
      )}
      {connectedAccount && !userType && (
        <header>
          <h1 className="app-title">Swiftride</h1>
          <p className="app-description">
            A decentralized ridesharing platform powered by the Ethereum blockchain.
          </p>
        </header>
      )}
      <div className="main-content">
        {connectedAccount ? (
          userType ? (
            userType === 'rider' ? (
              <Rider onTripSubmitted={handleTripSubmitted} onReturnHome={handleReturnHome} userType={userType} />
            ) : (
              <Driver onTripSelected={handleTripSelected} onReturnHome={handleReturnHome} userType={userType} />
            )
          ) : (
            <div>
              {!userType && activeTrips.length > 0 && (
                <div>
                  {activeTrips.map((trip) => {
                    // Add a console log to check if the TripStatus component is being rendered
                    console.log('Rendering TripStatus for trip ID:', trip.id);

                    return (
                      <TripStatus key={trip.id} userType={tripStatus} selectedTrip={trip} connectedAccount={connectedAccount} />
                    );
                  })}
                </div>
              )}
              <div id="location">
                Latitude: <span>{latitude}</span>
                <br />
                Longitude: <span>{longitude}</span>
                <br />
                <p>
                  Your connected account is: <strong>{connectedAccount}</strong>
                </p>
              </div>
            </div>
          )
        ) : showWalletPrompt ? (
          <div>
            <p>
              No wallet detected. Please install a wallet like{' '}
              <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                MetaMask
              </a>{' '}
              to interact with this application.
            </p>
          </div>
        ) : (
          <div>
            <p>Please connect your wallet to use this app</p>
            <button className="connect-wallet" onClick={checkMetaMaskAndConnect}>Connect Wallet</button>
          </div>
        )}
      </div>
    </div>
  );  
}

