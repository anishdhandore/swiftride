export default function TripStatus({ userType, selectedTrip, connectedAccount }) {
  const { rider, driver, riderLatitude, riderLongitude, driverLatitude, driverLongitude } = selectedTrip;

  const isRider = connectedAccount === rider;
  const isDriver = connectedAccount === driver;

  return (
    <div>
      <h2 className="page-title">{userType === 'rider' ? 'Rider' : 'Driver'} Trip Status</h2>
      <p>Running total and trip status will be displayed here.</p>
      {isRider && (
        <div id="location">
          <h4>Your location:</h4>
          Latitude: <span>{riderLatitude}</span>
          <br />
          Longitude: <span>{riderLongitude}</span>
          <br />
        </div>
      )}
      {isDriver && (
        <div id="location">
          <h4>Your location:</h4>
          Latitude: <span>{driverLatitude}</span>
          <br />
          Longitude: <span>{driverLongitude}</span>
          <br />
        </div>
      )}
    </div>
  );
}


