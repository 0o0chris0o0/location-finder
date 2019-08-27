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

  // to reduce API usage, attempt to use locations from nearby regions as opposed to all locations.
  // build array of locations by filtering for matching nearest regions.
  const nearestLocations = allLocations.filter(
    location => nearestRegions.indexOf(location.addressDetails.regionId) !== -1,
  );

  let locationCords;

  // if we have atleast 3 nearby regions then use these to determine 
  // nearest locations, if not we'll use all locations
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

  const apiKey = 'pA6A8uQRmjSEsRrYl4DvWhNGkrMb5CRe';

  return new Promise((resolve, reject) => {
    axios
      .post(`https://www.mapquestapi.com/directions/v2/routematrix?key=${apiKey}`, {
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
          // format distance to remove decimal place.
          const formattedDistance = distances[i].toFixed();
          locationData[i].distance = parseFloat(formattedDistance);
        }

        // sort locations by closest distances
        const sortedLocations = sortBy(locationData, 'distance');

        // reduce locations to just show closest 3
        sortedLocations.splice(3)

        resolve(sortedLocations);
      })
      .catch(error => {
        reject(error);
      });
  });
}