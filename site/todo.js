function fetch_todo() {

    routesUrl =
        "https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=retrieve";

    const data = {
        action: "startRace",
    };
    console.log("Fetch TODO");
    fetch(routesUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("Joehoe!");
            console.log(data);
        })
        .catch((error) => console.error(error));
}

