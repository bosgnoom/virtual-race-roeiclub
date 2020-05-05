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
	alle_elementen = ["mySidebar", "startRace", "contents", "mapid", "races"];

	alle_elementen.forEach((element) => {
		document.getElementById(element).style.display = "none";
	});

  document.getElementById(welke).style.display = "block";
  
  document.getElementById("mySidebarButton").onclick = function () {
		showSidebar();
	};
}
