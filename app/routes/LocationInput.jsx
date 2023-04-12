import React, { useEffect, useRef } from 'react';

export default function LocationInput({ id, label, value, onChange }) {
  const inputRef = useRef();

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps JavaScript API not loaded');
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, []);

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input type="text" id={id} ref={inputRef} />
    </>
  );
}
