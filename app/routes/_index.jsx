import React, { useEffect, useState } from 'react';

export default function Index() {
  const [latitude, setLatitude] = useState('-');
  const [longitude, setLongitude] = useState('-');

  useEffect(() => {
    const success = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      // Send the location data to your server or process it as needed
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

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Hello</h1>
      <div id="location">
        Latitude: <span>{latitude}</span>
        <br />
        Longitude: <span>{longitude}</span>
      </div>
    </div>
  );
}

