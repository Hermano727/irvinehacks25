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
      iconSize: { width: 30, height: 30 },
      button: document.getElementById('hospitalToggle')
    },
    { 
      query: 'food bank', 
      radius: 2000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/16819/16819304.png',
      iconSize: { width: 30, height: 30 },
      button: document.getElementById('foodBankToggle')
    },
    { 
      query: 'housing', 
      radius: 2000, 
      icon: 'https://cdn-icons-png.flaticon.com/128/25/25694.png',
      iconSize: { width: 30, height: 30 },
      button: document.getElementById('housingToggle')
    }
  ];

  let currentMarkers = [];

  // Function to get current location (if no place is selected)
  const getCurrentLocation = () => new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation not supported");
    }
  });

  // Function to clear existing markers
  const clearMarkers = () => {
    currentMarkers.forEach(marker => marker.setMap(null));
    currentMarkers = [];
  };

  // Add toggle functionality to filter buttons
  filters.forEach(filter => {
    filter.button.addEventListener('click', () => {
      filter.button.classList.toggle('inactive');
      performSearch(placePicker.value);
    });
  });

  // Function to perform search based on active filters
  const performSearch = async (place) => {
    clearMarkers();
    let location;

    if (!place.location) {
      try {
        const position = await getCurrentLocation();
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (error) {
        window.alert("Could not get location: " + error);
        return;
      }
    } else {
      location = place.location;
    }

    // Perform search for active filters
    filters.forEach(filter => {
      if (!filter.button.classList.contains('inactive')) {
        const request = {
          query: filter.query,
          location: location,
          radius: filter.radius
        };

        service.textSearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
              const icon = {
                url: filter.icon,
                size: new google.maps.Size(71, 71),
                scaledSize: new google.maps.Size(filter.iconSize.width, filter.iconSize.height),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34)
              };

              const placeMarker = new google.maps.Marker({
                position: place.geometry.location,
                map: map.innerMap,
                title: place.name,
                icon: icon
              });

              const placeInfoWindow = new google.maps.InfoWindow();

              service.getDetails({ placeId: place.place_id }, (details, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  const address = details.formatted_address || 'Address not available';
                  placeInfoWindow.setContent(
                    `<strong>${place.name}</strong><br><span>${address}</span>`
                  );
                }
              });

              placeMarker.addListener('click', () => {
                placeInfoWindow.open(map.innerMap, placeMarker);
              });

              currentMarkers.push(placeMarker);
            });
          }
        });
      }
    });
  };

  // Apply the place picker event listener
  placePicker.addEventListener('gmpx-placechange', async () => {
    const place = placePicker.value;

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

    performSearch(place);
  });
}

document.addEventListener('DOMContentLoaded', init);