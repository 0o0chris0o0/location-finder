import axios from 'axios';
import sortBy from 'lodash/sortBy';
import regionData from '../exampleData/regionData.json';

// get distances from the users location to each course location
export default function getLocationDistances(userLocation, locations) {
   // get shortcodes of nearest regions
  const nearestRegions = regionData[userLocation.shortcode];

  // add the users own region
  nearestRegions.push(userLocation.shortcode);

  // clone original array
  const allLocations = locations.slice(0);

  // build array of locations from nearest regions with matching regionId
  const nearestLocations = allLocations.filter(
    location => nearestRegions.indexOf(location.addressDetails.regionId) !== -1,
  );

  let locationCords;

  // if we have atleast 3 regions then use these to determine nearest courses.
  // if not we'll use all locations
  if (nearestLocations.length >= 3) {
    locationCords = nearestLocations.map(
      location =>
        `${location.addressDetails.coordinates.lat}, ${location.addressDetails.coordinates.lng}`,
    );
  } else {
    locationCords = allLocations.map(
      location =>
        `${location.addressDetails.coordinates.lat}, ${location.addressDetails.coordinates.lng}`,
    );
  }

  // begin creating object that will be used as final response.
  // we'll add the distances in the next function
  const locationData =
    nearestLocations.length >= 3 ? nearestLocations.slice(0) : allLocations.slice(0);

  const key = 'pA6A8uQRmjSEsRrYl4DvWhNGkrMb5CRe';

  return new Promise((resolve, reject) => {
    axios
      .post(`https://www.mapquestapi.com/directions/v2/routematrix?key=${key}`, {
        locations: [`${userLocation.lat}, ${userLocation.lng}`, ...locationCords],
        options: {
          manyToOne: true
        }
      })
      .then(response => {
        const distances = response.data.distance;
        // first item will always be 0 distance as it's the starting location
        // so remove first item from array
        distances.shift();

        for (let i = 0; i < distances.length; i++) {
          // format distance to 1 decimal place
          const formattedDistance = distances[i].toFixed();
          locationData[i].distance = parseFloat(formattedDistance);
        }

        locationData.splice(3)

        // sort locations by closest distance
        const sortedLocations = sortBy(locationData, 'distance');

        resolve(sortedLocations);
      })
      .catch(error => {
        reject(error);
      });
  });
}