// FUNCTIES VOOR HET VOLGEN VAN DE ROUTE (GPS)

// When user clicks on START button, web browser will ask for position permission
// Connect the user's GPS data to showPosition (main function)
function startRun() {
	if (navigator.geolocation) {
		console.log("startRun");

		var inhoud = document.getElementById("startRace");

		// Scherm omgooien
		document.getElementById("mapid").style.display = "block"; // kaart laten zien
		document.getElementById("contents").style.display = "block"; // race scherm laten zien
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

function loadRoutes() {
	//console.log("Routes laden...");
	var inhoud = document.getElementById("races");
	inhoud.innerHTML = "Routes worden geladen...";

	routesUrl =
		"https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=retrieve";

	fetch(routesUrl, { method: "GET" })
		.then(function (response) {
			//console.log("Er is een response...");
			if (response.ok) {
				//console.log("...Het is een goede!");
				return response.json();
			} else {
				console.log("KAK: geen goede response");
				laatRoutesNietGevondenZien();
			}
		})
		.then(function (data) {
			//console.log("We kunnen de data laten zien...");
			laatRoutesZien(data);
			// Niet netjes op deze plaats, maar hoe anders???
			window.virtualrace.routes = data;
			return data;
		})
		.catch(function (error) {
			console.log("Ah KAK: " + error);
			return null;
		});
}

function laatRoutesZien(welkeDan) {
	if (welkeDan.result == "success") {
		// Inhoud van "races" leegmaken en vullen met de races
		var inhoud = document.getElementById("races");
		inhoud.innerHTML = "<p>Beschikbare races:</p>";

		var lijstje = document.createElement("div");

		// in de <div id="races">
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
			label.setAttribute("onclick", "laadNieuweRoute(" + i + ");");
			label.innerHTML = "<b>" + route[2] + "</b><br>" + route[3] + "<br>";

			lijstje.appendChild(label);
			label.appendChild(radio);
			label.appendChild(span);
		});

		// Add START button at the end of the available races list
		var knopje = document.createElement("button");
		inhoud.appendChild(knopje);
		knopje.innerHTML = "START";
		knopje.setAttribute("onclick", "fetch_todo();");
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
