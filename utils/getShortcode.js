import postcodeData from '../exampleData/postcodeData.json';

export default function getShortcode(postcode) {
	return new Promise((resolve, reject) => {
		const rex = /[A-z]*(?=[0-9])/g;
    // get first two characters from postcode
		const shortcode = rex.exec(postcode)[0];

    // use first two characters from postcode to define region shortcode
		if (shortcode) {
			resolve(postcodeData[shortcode.toUpperCase()]);
		} else {
			reject('Invalid postcode');
		}
	});
}