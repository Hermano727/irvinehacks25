import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import '../styles/map.css';

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 40.749933, lng: -73.98633 });
  const [dropdownPlaces, setDropdownPlaces] = useState([]); // State for dropdown list
  const [activeFilters, setActiveFilters] = useState([]); // Track active filters

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDu9pSUf2b7SMeDJHFNKsI0_SmdBIcUiKo', // Replace with your actual API key
    libraries: ['places'], // Include Places library for search functionality
  });

  const filters = [
    { 
      query: 'hospital', 
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/3063/3063176.png',
      iconSize: { width: 30, height: 30 },
    },
    { 
      query: 'food bank', 
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/16819/16819304.png',
      iconSize: { width: 30, height: 30 },
    },
    { 
      query: 'housing and shelter', 
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/25/25694.png',
      iconSize: { width: 30, height: 30 },
    }
  ];

  const clearMarkersAndResults = () => {
    setMarkers([]);
    setDropdownPlaces([]);
    setSelectedMarker(null);
  };

  const handleFilterToggle = async (filter) => {
    const isActive = activeFilters.includes(filter.query);
    const updatedFilters = isActive
      ? activeFilters.filter((query) => query !== filter.query) // Deselect the filter if it's active
      : [...activeFilters, filter.query]; // Add the filter if it's not active

    setActiveFilters(updatedFilters);
    clearMarkersAndResults();

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    updatedFilters.forEach((query) => {
      const request = {
        query,
        location: center,
        radius: filter.radius
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const newMarkers = results.map(place => ({
            position: place.geometry.location,
            name: place.name,
            address: place.formatted_address || 'Address not available',
            icon: filters.find((f) => f.query === query)?.icon,
          }));

          setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
          setDropdownPlaces((prevPlaces) => [...prevPlaces, ...results.map(place => ({ name: place.name, address: place.formatted_address }))]);
        }
      });
    });
  };

  const handleSearchPlaces = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();

      if (places && places.length > 0) {
        const location = places[0].geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="map-page">
      <div className="sidebar">
        <h2>Filters</h2>
        {filters.map((filter, index) => (
          <button
            key={index}
            className={`filter-btn ${activeFilters.includes(filter.query) ? 'active' : ''}`}
            onClick={() => handleFilterToggle(filter)}
          >
            <img src={filter.icon} alt={filter.query} />
            {filter.query}
          </button>
        ))}
        <div className="search-box">
          <StandaloneSearchBox
            onLoad={(ref) => setSearchBox(ref)}
            onPlacesChanged={handleSearchPlaces}
          >
            <input
              type="text"
              placeholder="Search for a location"
              className="search-input"
            />
          </StandaloneSearchBox>
        </div>
        <div className="dropdown">
          <h3>Nearby Places</h3>
          <ul>
            {dropdownPlaces.map((place, index) => (
              <li key={index}>{place.name} - {place.address}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="map-container">
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={13}
          onLoad={(map) => setCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() })}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={{ url: marker.icon, scaledSize: new window.google.maps.Size(30, 30) }}
              onClick={() => setSelectedMarker(marker)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
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
