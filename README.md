# Virtuele race roerclub

Dit is de verzameling aan files voor de virtuele race voor de roeiclub. Het is een werk in ontwikkeling.

## Docker

Om ook mijn kubernetes cluster te kunnen gebruiken, wordt de (lokale) ontwikkeling in een Docker container gestopt. Aangezien dit project GPS data van een mobiele telefoon gebruikt, moet deze op een http**s** site gehost worden. Hiervoor moeten eerst certificaten aangemaakt worden met `./maak_certs.sh`. Deze worden opgeslagen op de goede locaties.

In een poging om de "foei, je hebt geen echt certificaat" melding weg te krijgen, wordt ook een .p12 bestand aangemaakt. Deze werkt echter nog niet goed op mijn eigen Android telefoon. Als iemand tips heeft om een zelf-gesigneerd certificaat goed aan de gang te krijgen, laat het me weten...

De docker container wordt aangemaakt met `./maak_docker.sh` en kan gestart worden met `./run_docker.sh`.

### nginx

Deze host de website lokaal, om te testen. De *live* versie is [hier](https://clerx.info/banaan/) te vinden. Met `./upload_site.sh` wordt de nieuwe versie live gezet.

### site

Bevat de HTML en JavaScript voor de website.

### google sheets

De site gebruikt als database een google sheet. Interface tussen website en google sheets is in ontwikkeling.