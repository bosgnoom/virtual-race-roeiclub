// MAIN file, koppelt een en ander aan elkaar...

// OK... global variables zijn slecht. window.variable beter?
// HELP

function runSetup() {
	// Set up "global" variables inside window (overall function)
	window.virtualrace = new Object();
	window.virtualrace.progress = 0;
	window.virtualrace.mymap = loadMap();
	window.virtualrace.waypoints = loadWayPoints();
	window.virtualrace.markers = setupWayPoints();
	window.virtualrace.currentPosition = null;
	window.virtualrace.currentPosMarker = null;
	window.virtualrace.startTijd = Date.now();
	window.virtualrace.afstand = 0;
	window.virtualrace.started = false;
	loadRoutes();

	// Iedere seconde informatie bijwerken
	window.setInterval(function () {
		if (virtualrace.currentPosition) {
			updateInformation(virtualrace.currentPosition);
		}
	}, 1000);
}

function updateInformation(position) {
	// Update de informatie naar de speler,
	// Hou tegelijkertijd de race bij

	// Update tekst naar speler
	updateUserText(virtualrace.progress, virtualrace.afstand);

	// Start inkleuren
	if (!virtualrace.started) {
		colorWayPoint(virtualrace.progress, "#33ff88");
	}

	// Check of we naar het volgende waypoint kunnen gaan
	// Afstand in meters
	if (virtualrace.afstand < 20) {
		// Naar volgende waypoint als dat gaat
		if (virtualrace.progress < virtualrace.waypoints.length) {
			// Oude marker bijwerken
			colorWayPoint(virtualrace.progress, "#33ff88");

			// Stap vooruit in race
			virtualrace.progress++;

			// Volgende waypoint inkleuren
			if (virtualrace.progress < virtualrace.waypoints.length) {
				colorWayPoint(virtualrace.progress, "#ff3333");

				// Werk afstand tot volgende waypoint bij, voorkomen dat we meteen finishen
				virtualrace.afstand = berekenAfstand(
					virtualrace.currentPosition,
					virtualrace.waypoints[virtualrace.progress]
				);
			}
		} else {
			// Bij de finish
			virtualrace.afstand = 0;
		}
	}
}

function colorWayPoint(welke, kleur) {
	// Kleur de gewenste waypoint in de gewenste kleur
	virtualrace.markers[welke].setStyle({
		opacity: 1.0,
		color: kleur,
	});
}

function updateUserText(progress, afstand) {
	// Update de tekst

	// Voor als het mis gaat. Deze wordt overschreven.
	tekst = "Oh kak...";

	// Laat verschillende tekst zien bij verschillende status van de race
	// Naar een switch ombouwen, is leesbaarder denk ik...
	switch (progress) {
		case 0:
			// Onderweg naar de START (0e waypoint)
			tekst =
				"<h2>GA NAAR DE START</h2>" + "Het is nog maar " + afstand + "m...";
			virtualrace.stopTijd = Date.now();
			break;

		case 1:
			// 0e waypoint, start de tijd
			if (!virtualrace.started) {
				virtualrace.started = true;
				virtualrace.startTijd = Date.now();
				console.log("Tijd reset");
			}
			virtualrace.stopTijd = Date.now();
			tekst = "<h2>GESTART!</h2><h3>Ga naar eerste checkpoint</h3>";
			break;

		case virtualrace.waypoints.length - 1:
			// Laatste poortje, finish in zicht...
			virtualrace.stopTijd = Date.now();
			tekst = "<h2>Ga naar de finish</h2>Nog ff doorpeddelen...";
			break;

		case virtualrace.waypoints.length:
			// Bij de FINISH
			tekst = "<h2>Jeuj, je bent gefinished!</h2>";
			// Finish gehaald, nu GPS weer uitzetten
			navigator.geolocation.clearWatch(virtualrace.watchPositionId);
			break;

		default:
			// Onderweg
			virtualrace.stopTijd = Date.now();
			tekst = "<h2>Ga naar het volgende controlepunt</h2>";
	}

	// Positie toevoegen
	tekst =
		tekst +
		"<br>Positie: " +
		virtualrace.currentPosition[0].toFixed(3) +
		", " +
		virtualrace.currentPosition[1].toFixed(3) +
		", Stap: " +
		virtualrace.progress +
		"<br>Afstand te gaan: " +
		afstand +
		"m" +
		"<br>Tijd:" +
		Math.floor((virtualrace.stopTijd - virtualrace.startTijd) / 1000) +
		" s";

	x = document.getElementById("contents");
	x.innerHTML = tekst;
}
