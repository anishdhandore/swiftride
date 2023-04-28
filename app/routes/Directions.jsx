import React, { useEffect, useRef } from 'react';

const Directions = ({ origin, destination, onDistanceChange, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
      });

      if (origin && destination) {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();

        directionsRenderer.setMap(map);

        const request = {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // Calculate trip distance
            const route = result.routes[0].legs[0];
            const distance = route.distance.value;

            // Update parent component with the calculated distance
            onDistanceChange(distance);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        });
      } else if (userLocation) {
        map.setCenter(userLocation);

        const marker = new window.google.maps.Marker({
          position: userLocation,
          map: map,
        });
      }
    }
  }, [origin, destination, onDistanceChange, userLocation]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default Directions;
