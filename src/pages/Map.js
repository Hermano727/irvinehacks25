import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import '../styles/map.css';

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDu9pSUf2b7SMeDJHFNKsI0_SmdBIcUiKo', // Replace with your actual API key
  });

  const filters = [
    { query: 'hospital', icon: 'https://cdn-icons-png.flaticon.com/128/3063/3063176.png' },
    { query: 'food bank', icon: 'https://cdn-icons-png.flaticon.com/128/16819/16819304.png' },
    { query: 'housing', icon: 'https://cdn-icons-png.flaticon.com/128/25/25694.png' },
  ];

  const handleFilterToggle = async (query) => {
    // Fetch and update markers based on the selected filter
  };

  const handleMarkerClick = (marker) => setSelectedMarker(marker);

  const handleCloseInfoWindow = () => setSelectedMarker(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="map-page">
      <div className="sidebar">
        <h2>Filters</h2>
        {filters.map((filter, index) => (
          <button
            key={index}
            className="filter-btn"
            onClick={() => handleFilterToggle(filter.query)}
          >
            <img src={filter.icon} alt={filter.query} />
            {filter.query}
          </button>
        ))}
      </div>
      <div className="map-container">
        <GoogleMap
          mapContainerClassName="map-container"
          center={{ lat: 40.749933, lng: -73.98633 }}
          zoom={13}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={{ url: marker.icon, scaledSize: new window.google.maps.Size(30, 30) }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={handleCloseInfoWindow}
            >
              <div>
                <strong>{selectedMarker.name}</strong>
                <p>{selectedMarker.address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
