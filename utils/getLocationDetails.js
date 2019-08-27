import getPostcodeCoords from './getPostcodeCoords';
import getShortcode from './getShortcode';
import getUserBrowserLocation from './getUserBrowserLocation';
import reverseLookupPostcode from './reverseLookupPostcode';
import allLocations from '../exampleData/locations.json';
import getLocationDistances from './getLocationDistances';

export default async function getLocationDetails(postcode) {
	let userLocation, locationDetails;

	try {
		// if we're searching with a postcode
		if (postcode) {
			// get user location (lat + lng) based on postcode
			userLocation = await getPostcodeCoords(postcode);

      // get user shortcode based on postcode
			userLocation.shortcode = await getShortcode(postcode);
		} else {
			// get user location (lat + lng) based on browser geolocation
			userLocation = await getUserBrowserLocation();

			// get users postcode based on lat, lng
			const userPostcode = await reverseLookupPostcode(userLocation);

			// set the users shortcode based on postcode
			userLocation.shortcode = await getShortcode(userPostcode);
		}

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