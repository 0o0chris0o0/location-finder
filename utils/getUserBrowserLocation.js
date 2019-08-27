// get users current location from browser
export default function getUserBrowserLocation() {
	return new Promise((resolve, reject) => {
		const getUserPosition = position => {
			const { latitude, longitude } = position.coords;

			const userPosition = {
				lat: latitude,
				lng: longitude
			};

			resolve(userPosition);
		};

		const locationError = error => {
      // For demonstration purposes we'll return an example 
      // location if we can't get the users browser location
      getUserPosition({ coords: { latitude: 51.527272, longitude: -0.118269 }})
			// reject(error);
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getUserPosition, locationError, { timeout: 30000 });
		} else {
			reject();
		}
	})
}