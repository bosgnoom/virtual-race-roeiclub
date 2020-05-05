// MAP FUNCTIONS

function loadMap() {
  // Set up the map
  var mymap = L.map("mapid").locate({ setView: true, maxZoom: 16 });

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiYm9zZ25vb20iLCJhIjoid1NTRWdvdyJ9.k_p-_29wfnymgYavmlpViQ",
    }
  ).addTo(mymap);

  return mymap;
}

function loadWayPoints() {
  // Define waypoints
  // Nu als static content, wordt vervangen door een google sheets interface

  var waypoints = [
    [51.197954, 6.010633],
    [51.198339, 6.010791],
    [51.198524, 6.009884],
    [51.198156, 6.009634],
  ];
  console.log("Aantal waypoints:" + waypoints.length);
  return waypoints;
}

function setupWayPoints() {
  // Show all waypoints on map

  var markers = new Array();
  for (i = 0; i < virtualrace.waypoints.length; i++) {
    var circle = L.circleMarker(virtualrace.waypoints[i], {
      opacity: 0.2,
    }).addTo(virtualrace.mymap);
    markers.push(circle);
    console.log("Waypoint nr " + i + ":" + virtualrace.waypoints[i]);
  }
  return markers;
}
