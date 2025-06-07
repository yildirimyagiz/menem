import React, { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface PlacePickerProps {
  onPlaceChange: (place: google.maps.places.PlaceResult | null) => void;
}

const PlacePicker: React.FC<PlacePickerProps> = ({ onPlaceChange }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceSelected = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      onPlaceChange(place);
    }
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceSelected}
    >
      <input
        type="text"
        placeholder="Search for a place"
        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
      />
    </Autocomplete>
  );
};

export default PlacePicker;