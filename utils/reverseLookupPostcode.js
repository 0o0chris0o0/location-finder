import axios from 'axios';

// get nearest postcodes to a given lat and lng
export default function reverseLookupLocation({ lng, lat }) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`)
      .then(response => {
        // use the first result as this should be close enough
        const postcode = response.data.result[0].postcode;
        resolve(postcode);
      }).catch((error) => {
        reject(error);
      });
  });
}