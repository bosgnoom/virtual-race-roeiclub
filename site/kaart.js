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

function loadWayPoints(routenummer) {
	// Define waypoints
	// Nu als static content, wordt vervangen door een google sheets interface
	console.log("loadWayPoints: Routenummer:" + routenummer);
	var waypoints = [];

	if (routenummer === undefined) {
		// Set up a route to show in the map
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
		routeItems.forEach(function (i) {
			var waypoint = virtualrace.routes.values[routenummer][i];
			waypoint = waypoint.split(",");
			console.log("Waypoint: " + waypoint);
			if (waypoint != "") {
				console.log(waypoint[0] + "->" + parseFloat(waypoint[0]));
				waypoints.push([parseFloat(waypoint[0]), parseFloat(waypoint[1])]);}
		});
		console.log(waypoints);
	}

	console.log("Aantal waypoints:" + waypoints.length);

	removeWayPoints(virtualrace.markers);
	virtualrace.markers = setupWayPoints(waypoints);

	return waypoints;
}

function removeWayPoints(markers) {
	// Remove all waypoints on map
	if (markers)
		markers.forEach(function (marker) {
			virtualrace.mymap.removeLayer(marker);
		});
}

function setupWayPoints(waypoints) {
	// Show all waypoints on map
	waypoints = waypoints || virtualrace.waypoints;

	var markers = new Array();
	for (i = 0; i < waypoints.length; i++) {
		console.log(waypoints[i]);
		var circle = L.circleMarker(waypoints[i], {
			opacity: 0.2,
		}).addTo(virtualrace.mymap);
		markers.push(circle);
		console.log("Waypoint nr " + i + ":" + waypoints[i]);
	}
	return markers;
}

function loadRoutes() {
	console.log("Routes laden...");
	var inhoud = document.getElementById("races");
	inhoud.innerHTML = "Routes worden geladen...";

	routesUrl =
		"https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=retrieve";

	fetch(routesUrl, { method: "GET" })
		.then(function (response) {
			console.log("Er is een response...");
			if (response.ok) {
				console.log("...Het is een goede!");
				return response.json();
			} else {
				console.log("KAK: geen goede response");
				laatRoutesNietGevondenZien();
			}
		})
		.then(function (data) {
			console.log("We kunnen de data laten zien...");
			laatRoutesZien(data);
			// Niet netjes op deze plaats, maar hoe anders???
			window.virtualrace.routes = data;
		})
		.catch(function (error) {
			console.log("Ah KAK: " + error);
		});
}

function laatRoutesZien(welkeDan) {
	if (welkeDan.result == "success") {
		console.log("Routes:");
		console.log(welkeDan);

		// Inhoud van "races" leegmaken en vullen met de races
		var inhoud = document.getElementById("races");
		inhoud.innerHTML = "Beschikbare races:<br><br>";

		// Voor nu een lijstje <ul>
		var lijstje = document.createElement("div");

		// <ul> in de <div id="races">
		inhoud.appendChild(lijstje);

		// Iedere race in de <div> zetten, als radiobutton
		welkeDan.values.map(function (route, i) {
			var radio = document.createElement("input");
			radio.type = "radio";
			radio.name = "routes";
			radio.value = i;
			radio.id = i;
			radio.setAttribute("class", "checkmark");

			var span = document.createElement("span");
			span.setAttribute("class", "checkmark");

			var label = document.createElement("label");
			label.setAttribute("for", i);
			label.setAttribute("class", "radio-container");
			label.setAttribute("onclick", "loadWayPoints(" + i + ");");
			label.innerHTML = "<b>" + route[2] + "</b><br>" + route[3] + "<br>";

			lijstje.appendChild(label);
			label.appendChild(radio);
			label.appendChild(span);
		});
	} else {
		laatRoutesNietGevondenZien();
	}
}

function laatRoutesNietGevondenZien() {
	var inhoud = document.getElementById("races");
	inhoud.innerHTML =
		"Helaas is er iets mis gegaan bij het laden van de routes..." +
		"Stuur een bericht, dit zou niet moeten gebeuren...";
}
