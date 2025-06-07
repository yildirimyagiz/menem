import type { FC } from "react";
import React from "react";

export enum MarkerType {
  ForSale = "For Sale",
  ForRent = "For Rent",
  Booking = "Booking",
  Car = "Car",
  Hotel = "Hotel",
  Experience = "Experience",
  Ticket = "Ticket",
}

interface LocationMarkerProps {
  lat: number;
  lng: number;
  type: MarkerType;
}

const getColorByType = (type: MarkerType) => {
  switch (type) {
    case MarkerType.ForSale:
      return "text-red-500";
    case MarkerType.ForRent:
      return "text-blue-500";
    case MarkerType.Booking:
      return "text-green-500";
    case MarkerType.Car:
      return "text-yellow-500";
    case MarkerType.Hotel:
      return "text-purple-500";
    case MarkerType.Experience:
      return "text-orange-500";
    case MarkerType.Ticket:
      return "text-teal-500";
    default:
      return "text-gray-500";
  }
};

const LocationMarker: FC<LocationMarkerProps> = ({ type }) => {
  const colorClass = getColorByType(type);

  return (
    <div className={colorClass}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-11 w-11"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default LocationMarker;
