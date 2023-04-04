import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Web3 } from 'web3';

export default function Index() {
  const [latitude, setLatitude] = useState('-');
  const [longitude, setLongitude] = useState('-');
  const [uniqueUserId, setUniqueUserId] = useState(null);

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

  //Cookie
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const setCookie = (name, value, days) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    };

    let userId = getCookie('uniqueUserId');

    if (!userId) {
      userId = uuidv4();
      setCookie('uniqueUserId', userId, 365);
    }

    setUniqueUserId(userId);
  }, []);

  MetaMask
  const checkMetaMaskAndConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
  
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        // Set connected account
        const connectedAccount = accounts[0];
        console.log('Connected account:', connectedAccount);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      console.log('MetaMask is not installed');
    }
  };
  
  useEffect(() => {
    checkMetaMaskAndConnect();
  }, []);
  

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Hello</h1>
      <div id="location">
        Latitude: <span>{latitude}</span>
        <br />
        Longitude: <span>{longitude}</span>
        <br />
        
        <p>
          Your unique user ID is: <strong>{uniqueUserId}</strong>
        </p>
      
      </div>
    </div>
  );
}

