function fetch_todo() {
	routesUrl =
		"https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec";

    console.log("Fetching starting number...");
    
	fetch(routesUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: "action=startRace", 
	})
		.then(function (response) {
			if (response.ok) {
				// console.log("Antwoord:");
				// console.log(response);
				return response.json();
			} else {
                console.error("Geen goede respons terug gekregen...");
                console.log(response);
				return null;
			}
        })
        .then(function (data){
            // console.log(data);
            console.log("Startnummer:" + data.row);
            window.virtualrace.startnumber = data.row;

            // Switch to "RACE" screen
            showContent("contents");
        })
		.catch((error) => console.error(error));
}
