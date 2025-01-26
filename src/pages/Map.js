import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import '../styles/map.css';
import 'font-awesome/css/font-awesome.min.css';

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [center, setCenter] = useState({ lat: 40.749933, lng: -73.98633 });
  const [dropdownPlaces, setDropdownPlaces] = useState([]); // State for dropdown list
  const [activeFilters, setActiveFilters] = useState({}); // Track active filters

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API, // Use correct env variable
    libraries: ['places'], // Include Places library for search functionality
  });
  
  // Filters with custom labels
  const filters = [
    { 
      query: 'Hospital', 
      label: 'Hospitals', // Custom label for the button
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/3063/3063176.png',
      iconSize: { width: 30, height: 30 },
    },
    { 
      query: 'Food Bank', 
      label: 'Food Banks', // Custom label for the button
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/16819/16819304.png',
      iconSize: { width: 30, height: 30 },
    },
    { 
      query: 'Housing and Shelter', 
      label: 'Shelters', // Custom label for the button
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/2550/2550430.png',
      iconSize: { width: 30, height: 30 },
    }
  ];

  const clearMarkersAndResults = () => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.isSearchMarker)); // Keep the search marker
    setDropdownPlaces([]); // Reset nearby places
    setSelectedMarker(null);
  };

  const handleFilterToggle = (filter) => {
    const updatedFilters = { ...activeFilters };
    
    // Toggle the filter active state
    if (updatedFilters[filter.query]) {
      delete updatedFilters[filter.query]; // Remove filter if it's already active
    } else {
      updatedFilters[filter.query] = true; // Add filter if not active
    }
    
    setActiveFilters(updatedFilters); // Update active filters state

    // Clear markers and results and fetch again for active filters
    clearMarkersAndResults();
    
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    const allPlaces = [];
    // Loop through active filters and perform searches
    Object.keys(updatedFilters).forEach((filterQuery) => {
      const activeFilter = filters.find(f => f.query === filterQuery);
      if (activeFilter) {
        const request = {
          query: activeFilter.query,
          location: center,
          radius: activeFilter.radius,
        };

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const newPlaces = results.map((place) => ({
              name: place.name,
              address: place.formatted_address || 'Address not available',
              type: activeFilter.query, // Add the filter type (Hospital, Food Bank, etc.)
              position: place.geometry.location,
              icon: activeFilter.icon,
            }));

            allPlaces.push(...newPlaces); // Add fetched places to the unified list

            // After fetching all places from all filters, sort them by distance
            sortPlacesByDistance(allPlaces);

            const newMarkers = results.map((place) => ({
              position: place.geometry.location,
              name: place.name,
              address: place.formatted_address || 'Address not available',
              icon: activeFilter.icon,
              isSearchMarker: false, // These are filter-based markers
            }));

            setMarkers((prev) => [...prev, ...newMarkers]);
          }
        });
      }
    });
  };

  const sortPlacesByDistance = (places) => {
    const distanceService = new window.google.maps.DistanceMatrixService();

    const origins = [new window.google.maps.LatLng(center.lat, center.lng)];
    const destinations = places.map(place => place.position);

    distanceService.getDistanceMatrix(
      {
        origins,
        destinations,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK) {
          const distances = response.rows[0].elements;

          // Add distance to each place object
          places.forEach((place, index) => {
            // Ensure the distance exists before adding it
            if (distances[index] && distances[index].distance) {
              place.distance = distances[index].distance.value; // Distance in meters
              place.distanceText = distances[index].distance.text; // Distance in human-readable format
            } else {
              place.distance = Infinity; // If no distance, set to infinity (so it'll be last in the sorted list)
              place.distanceText = 'Distance unavailable';
            }
          });

          // Sort places by distance (ascending order)
          places.sort((a, b) => a.distance - b.distance);

          // Update the dropdownPlaces with the sorted places
          setDropdownPlaces(places);
        } else {
          console.error("Error fetching distance matrix:", status);
        }
      }
    );
  };

  const handleSearchPlaces = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();

      if (places && places.length > 0) {
        const place = places[0];
        const location = place.geometry.location;

        // Reset filters when a new location is entered
        setActiveFilters({}); // Reset all filters
        setDropdownPlaces([]); // Clear previous places from dropdown
        setMarkers([]); // Clear existing markers

        setCenter({ lat: location.lat(), lng: location.lng() });

        const newMarker = {
          position: location,
          name: place.name,
          address: place.formatted_address || 'Address not available',
          icon: null,
          isSearchMarker: true, // Flag this as a search marker
        };

        setMarkers([newMarker]);
      }
    }
  };

  const handleListItemClick = (place) => {
    // Update map center and zoom when a list item is clicked
    setCenter({ lat: place.position.lat(), lng: place.position.lng() });

    // Find the marker that matches the selected place
    const marker = markers.find(marker => marker.name === place.name);
    if (marker) {
      setSelectedMarker(marker); // Show the info window for the selected marker
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
            className={`filter-btn ${activeFilters[filter.query] ? 'active' : 'inactive'}`}
            onClick={() => handleFilterToggle(filter)}
          >
            <img src={filter.icon} alt={filter.query} />
            {filter.label} {/* Display the custom label */}
          </button>
        ))}
        
        {/* Search Box */}
        <div className="search-box">
          <StandaloneSearchBox
            onLoad={(ref) => setSearchBox(ref)}
            onPlacesChanged={handleSearchPlaces}
          >
            <div className="input-container">
              <div className="search-icon">
                <i className="fa fa-search"></i>
              </div>
              <input
                type="text"
                placeholder="Search for a location"
                className="search-input"
              />
            </div>
          </StandaloneSearchBox>
        </div>
        
        {/* Nearby Places List */}
        <div className="dropdown">
          <h3>Nearby Places</h3>
          <ul>
            {dropdownPlaces.map((place, index) => (
              <li key={index} onClick={() => handleListItemClick(place)}>
                <strong>{place.name}</strong>
                <br />
                <span>{place.address}</span>
                <br />
                <span className="category">{place.type}</span> {/* Display the type (hospital, food bank, etc.) */}
                <br />
                <span className="distance">Distance: {place.distanceText}</span> {/* Display the distance */}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Google Map */}
      <div className="map-container">
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={13}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={{
                url: marker.icon || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
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
