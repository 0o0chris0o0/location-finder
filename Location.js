import React from 'react';

export default function Location({ details }) {
  return (
    <div className="location">
      <p className="location__name">{details.name} - {details.addressDetails.city}</p>
      <p className="location__distance">{details.distance} miles</p>
    </div>
  )
}