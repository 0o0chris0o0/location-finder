export async function getLocationDetails(postcode) {
	let userLocation, locationDetails;

	try {
		// if we're searching with a postcode
		if (postcode) {
			// get user location (lat + lng) based on postcode
			// also gets user shortcode based on postcode
			userLocation = await getPostcodeCoords(postcode);

			userLocation.shortcode = await getShortcode(postcode);
		} else {
			// get user location (lat + lng) based on browser geolocation
			userLocation = await getUserLocation();
			// get users postcode based on lat, lng
			const userPostcode = await reverseLookupLocation(userLocation);
			// set the users shortcode based on postcode
			userLocation.shortcode = await getShortcode(userPostcode);
		}

		// get all locations
		const allLocations = await getAllLocations();

		// get location distances based on user location
		try {
			locationDetails = await getLocationDistances(userLocation, allLocations);
		} catch (error) {
			// if we cant get the distances from the API, fallback to getting nearest courses based on shortcodes
			if (error.message === 'Network Error') {
				locationDetails = allLocations.filter(
					location => location.addressDetails.regionId === userLocation.shortcode
				);
			}
		}

		return {
			shortcode: userLocation.shortcode,
			locations: locationDetails
		};
	} catch (error) {
		return Promise.reject(error || new Error('There was an error, please try again later.'));
	}
}