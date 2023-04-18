export default function TripStatus({ userType, selectedTrip, connectedAccount }) {
  console.log('Selected Trip:', selectedTrip); // Add this line to log the selected trip's details
  const { rider, driver, riderLatitude, riderLongitude, driverLatitude, driverLongitude } = selectedTrip;

  const isRider = connectedAccount === rider;
  const isDriver = connectedAccount === driver;

  return (
    <div>
      <h2 className="page-title">{userType === 'rider' ? 'Rider' : 'Driver'} Trip Status</h2>
      <p>Running total and trip status will be displayed here.</p>
      <hr />
    </div>
  );
}


