import { useState, useEffect } from 'react';
import Directions from './Directions';
import { ethers } from 'ethers';
import tripStorageABI from '../contracts/TripStorageABI.json';

const tripStorageAddress = '0x841731c808cD5689F1f8e09a60259B8fa31EE3b2';

export default function TripStatus({ userType, selectedTrip, connectedAccount, latitude, longitude, onTripUpdated, onTripCompleted}) {
  console.log('Selected Trip:', selectedTrip); // Add this line to log the selected trip's details
  const { rider, driver, tripStarted, completed } = selectedTrip;
  const [distance, setDistance] = useState(null);
  const [userLocation, setUserLocation] = useState({lat:latitude,lng:longitude});
  const isRider = connectedAccount.toLowerCase() === rider.toLowerCase();
  const isDriver = connectedAccount.toLowerCase() === driver.toLowerCase();

  const handlePickedUp = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, signer);
  
    try {
      const tx = await tripStorage.startTrip(selectedTrip.id);
      await tx.wait();
      console.log('Trip started');
      onTripUpdated();
    } catch (error) {
      console.error('Error starting the trip:', error);
    }
  };
  
  const handleCompleteTrip = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tripStorage = new ethers.Contract(tripStorageAddress, tripStorageABI, signer);
    const tripCostInSepoliaEther = calculateTripCost(distance) * 0.001;
    const costInWei = ethers.utils.parseEther(tripCostInSepoliaEther.toFixed(2));
    

    // Send payment directly to the driver
    try {
      const paymentTx = await signer.sendTransaction({
        to: selectedTrip.driver,
        value: costInWei,
      });
      await paymentTx.wait();
      console.log("Payment sent to driver");
    } catch (error) {
      console.error("Error sending payment to driver:", error);
    }    
    
    // Mark trip as complete
    try {
      const tx = await tripStorage.completeTrip(selectedTrip.id);
      await tx.wait();
      console.log('Trip completed');
      onTripUpdated();
      onTripCompleted();
    } catch (error) {
      console.error('Error completing the trip:', error);
    }
  };
  
  // Add a function to calculate the estimated trip cost
  const calculateTripCost = (distanceInMeters) => {
    const distanceInKilometers = distanceInMeters / 1000;
    const costPerKilometer = 1.5; // Assuming a fixed cost per kilometer
    return distanceInKilometers * costPerKilometer;
  };

  useEffect(() => {
    setUserLocation({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);
  console.log('isRider: ', {isRider});
  console.log('isDriver: ', {isDriver});
  console.log('Started: ', {tripStarted});
  console.log('Completed: ', {completed});
  return (
    <div>
      <hr />
      <div className="trip-status">
        <h2 className="page-header">Trip Status {userType === 'rider' ? 'Rider' : 'Driver'} </h2>
          {isDriver && !selectedTrip.tripStarted ? (
            <div className="directions-container">
              <Directions
              origin={selectedTrip.pickupLocation}
              destination={selectedTrip.dropoffLocation}
              onDistanceChange={setDistance}
              userLocation={userLocation}
              displayType="notStarted"/>
            </div>
          ) : (
            <div className="directions-container">
              <Directions
              origin={selectedTrip.pickupLocation}
              destination={selectedTrip.dropoffLocation}
              onDistanceChange={setDistance}
              userLocation={userLocation}
              displayType="started"/>
            </div>
          )}          
          {!selectedTrip.tripStarted && isRider && selectedTrip.driver !== '0x0000000000000000000000000000000000000000' &&(
            <div className="status-text">
              <span><strong>Your driver is en route. Be ready and press the "Picked up" button when they arrive.</strong></span>
              {isRider && !selectedTrip.tripStarted && (
                <button type="button" className="submit-button" onClick={handlePickedUp}>Picked up</button>
              )}
            </div>
          )}
          {isRider && selectedTrip.driver === '0x0000000000000000000000000000000000000000' && (
            <div className="status-text">
              <p><strong>Please wait while we find a driver for you.</strong></p>
            </div>
          )}      
          {(isRider || isDriver) && selectedTrip.tripStarted && distance && (
            <div className="running-total">
              <span>Running Total: ${calculateTripCost(distance).toFixed(2)}</span>
              {isRider && selectedTrip.tripStarted && !selectedTrip.completed && (
                <button type="button" className="submit-button" onClick={handleCompleteTrip}>End trip</button>
              )}           
            </div>
          )}
        </div>
        <hr />
        <h2 className="page-header">Trip Details</h2>
        <div className = "location-text">
          <p><strong>Origin: </strong>{selectedTrip.pickupLocation}</p>
          <p><strong>Destination: </strong>{selectedTrip.dropoffLocation}</p>
          <p><strong>User Location: </strong>{userLocation.lat}, {userLocation.lng}</p>
        </div> 
      <hr />
    </div>
  );
}


