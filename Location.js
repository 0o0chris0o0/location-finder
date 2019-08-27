import React from 'react';

export default function Location({ details }) {
  console.log(details);
  return (
    <div>
      <p>{details.name}</p>
      <strong>{details.distance} miles</strong>
    </div>
  )
}