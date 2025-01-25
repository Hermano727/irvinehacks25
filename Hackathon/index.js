async function init() {
  await customElements.whenDefined('gmp-map');

  const map = document.querySelector('gmp-map');
  const marker = document.querySelector('gmp-advanced-marker');
  const placePicker = document.querySelector('gmpx-place-picker');
  const infowindow = new google.maps.InfoWindow();

  // Initialize the Places Service
  const service = new google.maps.places.PlacesService(map.innerMap);

  // Define your filters (multiple queries)
  const filters = [
    { 
      query: 'hospital', 
      radius: 1000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/3063/3063176.png',
      iconSize: { width: 30, height: 30 } // Size for hospital icons
    },
    { 
      query: 'food bank', 
      radius: 2000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/16819/16819304.png',
      iconSize: { width: 30, height: 30 } // Size for food bank icons
    },
    { 
      query: 'housing', 
      radius: 2000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/25/25694.png',
      iconSize: { width: 30, height: 30 } // Size for food bank icons
    },
    // You can add more queries and icon sizes here
  ];

  // Function to get current location (if no place is selected)
  const getCurrentLocation = () => new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation not supported");
    }
  });

  // Apply the place picker event listener
  placePicker.addEventListener('gmpx-placechange', async () => {
    const place = placePicker.value;
    let location;

    if (!place.location) {
      window.alert("No details available for input: '" + place.name + "'");
      infowindow.close();
      marker.position = null;
      return;
    }

    if (place.viewport) {
      map.innerMap.fitBounds(place.viewport);
    } else {
      map.center = place.location;
      map.zoom = 17;
    }

    marker.position = place.location;
    infowindow.setContent(
      `<strong>${place.displayName}</strong><br>
       <span>${place.formattedAddress || 'No address available'}</span>`
    );
    infowindow.open(map.innerMap, marker);

    // Get current location if the place doesn't have a location
    location = place.location || await getCurrentLocation();

    // Perform multiple queries for different place types
    filters.forEach(filter => {
      const request = {
        query: filter.query,  // Search query (e.g., "hospital", "food bank")
        location: location,   // The location for search (either selected place or current location)
        radius: filter.radius // Radius for the search (e.g., 1000 meters for hospitals)
      };

      // Perform the text search
      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Clear existing markers before adding new ones
          const existingMarkers = map.innerMap.markers || [];
          existingMarkers.forEach(marker => marker.setMap(null));

          // Add new markers for the filtered places
          results.forEach(place => {
            // Define icon with size adjustment based on filter
            const icon = {
              url: filter.icon, // Icon URL from filter
              size: new google.maps.Size(71, 71), // Original icon size (optional)
              scaledSize: new google.maps.Size(filter.iconSize.width, filter.iconSize.height), // Resized icon size
              origin: new google.maps.Point(0, 0),  // Origin (optional)
              anchor: new google.maps.Point(17, 34) // Anchor (optional)
            };

            const placeMarker = new google.maps.Marker({
              position: place.geometry.location,
              map: map.innerMap,
              title: place.name,
              icon: icon // Use the resized icon from the filter
            });

            const placeInfoWindow = new google.maps.InfoWindow();

            // Fetch and display detailed information for each place
            service.getDetails({ placeId: place.place_id }, (details, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                const address = details.formatted_address || 'Address not available';
                placeInfoWindow.setContent(
                  `<strong>${place.name}</strong><br><span>${address}</span>`
                );
                //placeInfoWindow.open(map.innerMap, placeMarker);
              }
            });

            // Add click listener for info window
            placeMarker.addListener('click', () => {
              placeInfoWindow.open(map.innerMap, placeMarker);
            });
          });
        } else {
          window.alert(`Search for ${filter.query} failed: ` + status);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
