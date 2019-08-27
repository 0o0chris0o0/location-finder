import React from 'react';

export default function Location({ details }) {
  console.log(details);
  return (
    <div className="location">
      <p className="location__name">{details.name}</p>
      <p className="location__distance">{details.distance} miles</p>
    </div>
  )
}