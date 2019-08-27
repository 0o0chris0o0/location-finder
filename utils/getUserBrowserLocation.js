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
			reject(error);
		};

		if (navigator.geolocation) {
			// navigator.geolocation.getCurrentPosition(getUserPosition, locationError, { timeout: 30000 });
      // THIS CODE WONT WORK WITHIN STACKBLITZ, SO FAKING IT...
      getUserPosition({ coords: { latitude: 51.527272, longitude: -0.118269 }})
		} else {
			reject();
		}
	})
}