// Variable declaration
var pos = [];
var lon;
var lat;
var busMarkers = [];
var stopMarkers = [];

// Initialize the map implementing Mapbox
mapboxgl.accessToken = 'MAPBOX TOKEN GOES HERE';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.104081, 42.365554],
  zoom: 14,
});

// Fetch bus data fro mthe MBTA API
function fetchBusData() {
    const apiUrl = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';

    return fetch(apiUrl)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching bus data:', error);
            return null;
        });
}

// Extract bus marker coords from API response
function extractCoordinatesFromApi(apiData) {
    if (!apiData) {
        console.log('No bus data available.');
        return;
    }
    const vehicles = apiData.data;
    pos = [];

    vehicles.forEach(vehicle => {
        const lon = vehicle.attributes.longitude;
        const lat =  vehicle.attributes.latitude;
        pos.push({ longitude: lon, latitude: lat });  
    });
    return pos;
}

// Add bus markers function
function addBusMarkers() {
    pos.forEach((position, index) => {
        var busMarker = new mapboxgl.Marker({
             color: '#FFA500' 
            }).setLngLat([position.longitude, position.latitude])
            .addTo(map);
            busMarkers.push(busMarker);
    });
}
// Remove bus markers function
function removeBusMarkers() {
    busMarkers.forEach(function(busMarker) {
        busMarker.remove();
    });
}
// Refresh bus location and update markers button function
function refreshBusLocation() {
    fetchBusData()
        .then(extractCoordinatesFromApi)
        .then(removeBusMarkers)
        .then(addBusMarkers)
        .finally(() => {
            // Refresh data every 30 seconds
            setTimeout(refreshBusLocation, 30000);
            
        });
}
// Coordinates for bus stops
  var busStopCoords = [
    [-71.093729, 42.359244],
    [-71.094915, 42.360175],
    [-71.0958, 42.360698],
    [-71.099558, 42.362953],
    [-71.103476, 42.365248],
    [-71.106067, 42.366806],
    [-71.108717, 42.368355],
    [-71.110799, 42.369192],
    [-71.113095, 42.370218],
    [-71.115476, 42.372085],
    [-71.117585, 42.373016],
    [-71.118625, 42.374863]
  ];
// Add bus stop markers function
function addStopMarkers() {
    busStopCoords.forEach(function(coord) {
        var stopMarker = new mapboxgl.Marker({
          color: "#00008B"
        }).setLngLat(coord)
            .addTo(map);
        stopMarkers.push(stopMarker);
    });
}
// Remove bus stop markers function
function removeStopMarkers() {
    stopMarkers.forEach(function(marker) {
        marker.remove();
    });
}
// Toggle bus stop markers button function
var stopMarkersVisible = false;

function toggleStopMarkers() {
    if (stopMarkersVisible) {
        removeStopMarkers();
    } else {
        addStopMarkers();
    }
    stopMarkersVisible = !stopMarkersVisible;
}