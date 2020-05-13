// MAP FUNCTIONS

function loadMap() {
	// Set up the map
	var mymap = L.map("mapid").locate({ setView: true, maxZoom: 14 });

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

function loadWayPoints(routenummer) {
	// Define waypoints
	// Nu als static content, wordt vervangen door een google sheets interface
	console.log("Routenummer:" + routenummer);
	var waypoints = [];

	if (routenummer == -1) {
		// Set up a default route to show in the map
		var waypoints = [
			[51.197954, 6.010633],
			[51.198339, 6.010791],
			[51.198524, 6.009884],
			[51.198156, 6.009634],
		];
	} else {
		// Load specific route from google sheets result
		// Kolomnummers voor de waypoints
		var routeItems = [4, 6, 7, 8, 9, 10, 5];

		// Voor ieder checkpoint een waypoint maken (als deze niet leeg is)
		routeItems.forEach(function (i) {
			var waypoint = virtualrace.routes.values[routenummer][i];

			waypoint = waypoint.split(",");

			//console.log("Waypoint: " + waypoint);
			if (waypoint != "") {
				waypoints.push([waypoint[0], waypoint[1]]);
			}
		});
	}

	//console.log("Aantal waypoints:" + waypoints.length);

	//removeWayPoints(virtualrace.markers);
	//virtualrace.markers = setupWayPoints(waypoints);

	return waypoints;
}

function removeMarkers(markers) {
	// Remove all waypoints on map
	if (markers)
		//console.log("Haalt oude markers weg...");
		markers.forEach(function (marker) {
			virtualrace.mymap.removeLayer(marker);
		});
}

function setupMarkers(waypoints) {
	// Show all waypoints on map
	waypoints = waypoints || virtualrace.waypoints;
	console.log("setupMarkers:");
	console.log(waypoints);

	var markers = new Array();
	for (i = 0; i < waypoints.length; i++) {
		//console.log(waypoints[i]);
		var circle = L.circleMarker(waypoints[i], {
			opacity: 0.2,
		}).addTo(virtualrace.mymap);
		markers.push(circle);
		console.log("Waypoint nr " + i + ":" + waypoints[i]);
	}
	return markers;
}

function laadNieuweRoute(welke) {
	// Oude route weghalen
	// Nieuwe erin zetten

	virtualrace.waypoints = loadWayPoints(welke);
	console.log("Nieuwe route:" + virtualrace.waypoints);

	//console.log("Oude markers weghalen");
	removeMarkers(virtualrace.markers);

	//console.log("Nieuwe markers erin");
	window.virtualrace.markers = setupMarkers(virtualrace.waypoints);
}
