import React, { useEffect, useRef } from 'react';

const Directions = ({ origin, destination, onDistanceChange, userLocation, displayType }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      console.log('displayType: ', displayType);
      console.log('userLocation: ', userLocation);
      console.log('origin: ', origin);
      console.log('destination: ', destination);
      if (displayType === 'started' && userLocation && destination) {
        const request = {
          origin: userLocation,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        renderDirections(request);
      } else if (displayType === 'rider' && origin && destination) {
        const request = {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        renderDirections(request);
      } else if (displayType === 'notStarted' && userLocation && origin) {
        const request = {
          origin: userLocation,
          destination: origin,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        renderDirections(request);
      } else if (userLocation) {
        map.setCenter(userLocation);

        const marker = new window.google.maps.Marker({
          position: userLocation,
          map: map,
        });
      }

      if (userLocation && origin) {
        updateTripDistance(origin, destination, userLocation, displayType);
      }      

      function renderDirections(request) {
        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        });
      }

      function updateTripDistance(origin, destination, userLocation, displayType) {
        const distanceMatrixService = new window.google.maps.DistanceMatrixService();
        if(displayType === 'rider') {
          distanceMatrixService.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [destination],
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === window.google.maps.DistanceMatrixStatus.OK) {
                const distance = response.rows[0].elements[0].distance.value;
                onDistanceChange(distance);
              } else {
                console.error('Distance Matrix request failed due to ' + status);
              }
            }
          );
        } else {
          distanceMatrixService.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [userLocation],
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === window.google.maps.DistanceMatrixStatus.OK) {
                const distance = response.rows[0].elements[0].distance.value;
                onDistanceChange(distance);
              } else {
                console.error('Distance Matrix request failed due to ' + status);
              }
            }
          );
        }
      }      
    }
  }, [origin, destination, onDistanceChange, userLocation, displayType]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default Directions;
