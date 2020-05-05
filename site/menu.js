// MENU functions

function showSidebar() {
	document.getElementById("mySidebar").style.display = "block";
	document.getElementById("mySidebarButton").onclick = function () {
		hideSidebar();
	};
}

function hideSidebar() {
	document.getElementById("mySidebar").style.display = "none";
	document.getElementById("mySidebarButton").onclick = function () {
		showSidebar();
	};
}

function showContent(welke) {
	// Niet charmant, via functie mogelijk?
	alle_elementen = ["mySidebar", "contents", "mapid", "races"];

	// Eerst alles verstoppen
	alle_elementen.forEach((element) => {
		document.getElementById(element).style.display = "none";
	});

	// Menu knop programmeren
	document.getElementById("mySidebarButton").onclick = function () {
		showSidebar();
	};

	// Gewenste laten zien
	document.getElementById(welke).style.display = "block";
	if (welke == "contents") {
		document.getElementById("mapid").style.display = "block";
	}
}
