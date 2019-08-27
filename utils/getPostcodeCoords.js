import axios from 'axios';

// return a postcodes lat and lng

export default function getPostcodeCoords(postcode) {
	return new Promise((resolve, reject) => {
		axios
			.get(`https://api.postcodes.io/postcodes/${postcode}`)
			.then(response => {
				const { latitude, longitude } = response.data.result;

				resolve({
					lat: latitude,
					lng: longitude
				});
			})
			.catch(error => {
				reject(error.response.data.error);
			});
	});
}