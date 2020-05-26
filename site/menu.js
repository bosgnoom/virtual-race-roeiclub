// MENU functions

function showSidebar() {
	document.getElementById("mapid").style.display = "none";
	document.getElementById("mySidebar").style.display = "block";
	document.getElementById("mySidebarButton").onclick = function () {
		hideSidebar();
	};
}

function hideSidebar() {
	document.getElementById("mySidebar").style.display = "none";
	document.getElementById("mapid").style.display = "block";
	document.getElementById("mySidebarButton").onclick = function () {
		showSidebar();
	};
}

function showContent(welke) {
	// Niet charmant, via functie mogelijk?
	alle_elementen = ["mySidebar", "contents", "races", "player"];

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
	document.getElementById("mapid").style.display = "block";
}
