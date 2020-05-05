// FUNCTIES VOOR HET VOLGEN VAN DE ROUTE (GPS)

// When user clicks on START button, web browser will ask for position permission
// Connect the user's GPS data to showPosition (main function)
function startRun() {
	if (navigator.geolocation) {
		var inhoud = document.getElementById("startRace");

		document.getElementById("mapid").style.display = "block";

		console.log("Klaar voor de start?");
		virtualrace.progress = 0;

		virtualrace.watchPositionId = navigator.geolocation.watchPosition(
			showPosition
		);
		window.virtualrace.startTijd = Date.now();
	} else {
		inhoud.innerHTML =
			"Helaas, je zult je positie moeten delen. " +
			"Of je telefoon heeft geen GPS. Balen..." +
			"<br>Refresh deze pagina voor een nieuwe poging...";
	}
}

function showPosition(position) {
	// Werk eigen positie bij
	virtualrace.currentPosition = [
		position.coords.latitude,
		position.coords.longitude,
	];

	// Werk afstand tot volgende waypoint bij
	virtualrace.afstand = berekenAfstand(
		virtualrace.currentPosition,
		virtualrace.waypoints[virtualrace.progress]
	);

	// Teken lijn
	if (virtualrace.currPosMarker == undefined) {
		// Nog geen polyline aanwezig, maak er een
		virtualrace.currPosMarker = L.polyline(
			[virtualrace.currentPosition, virtualrace.currentPosition],
			{
				color: "black",
				opacity: 0.5,
			}
		).addTo(virtualrace.mymap);
	} else {
		// Voeg punt toe aan polyline
		virtualrace.currPosMarker.addLatLng(virtualrace.currentPosition);
	}
}

function berekenAfstand(position, waypoint) {
	// Rekent de afstand uit tussen twee punten

	// Neemt aan dat format position en waypoint kloppen
	// Niet netjes, lekker boeiend voor nu

	// Google op 'haversine' voor uitleg
	var D2R = 0.01745329251; // pi/180

	var rLatU = position[0] * D2R;
	var rLonU = position[1] * D2R;
	var rLat = waypoint[0] * D2R;
	var rLon = waypoint[1] * D2R;

	var distance =
		6371137 *
		Math.acos(
			Math.cos(rLatU) * Math.cos(rLat) * Math.cos(rLon - rLonU) +
				Math.sin(rLatU) * Math.sin(rLat)
		);

	return Math.round(distance);
}
