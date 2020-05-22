#!/bin/sh

# https://stackoverflow.com/questions/51330409/public-sheet-get-access-with-api-key-works-for-days-then-permission-denied


#curl -X GET 'https://sheets.googleapis.com/v4/spreadsheets/1Y7JcfAtZHDUAJu1yPJJEIKRAPUBg20eARydWqlR3pC4?key=AIzaSyAXxYRQpEvooPsNmG6Us_9F9k71B-xmAEQ'

#curl -L -X GET https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=retrieve


#curl -L -X GET https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=getRaces
#curl -L -X POST -d "action=retrieve" https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec
#curl -L -X POST -d "action=getRaces" https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec

#curl -L -X POST -d "action=getRaces" https://script.google.com/macros/s/AKfycbwhB3Wv0oZfOEfLN3yBeTr2dzhINsJhH1Gf5-u2fX8/dev
#curl -L -X GET https://script.google.com/macros/s/AKfycbwhB3Wv0oZfOEfLN3yBeTr2dzhINsJhH1Gf5-u2fX8/dev?action=getRaces
#curl -L -d "action=getRaces" -X POST https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=getRaces

#curl -L -X GET https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=getRaces
echo "..."

#curl -L -X GET https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec?action=startRace&starttijd=123
#curl -L -d "action=startRace&starttijd=123" -H "Content-Type: application/x-www-form-urlencoded" -X POST https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec

curl -L \
    -d '{action:startRace}' \
    -H "Content-Type: application/json" \
    -X POST https://script.google.com/macros/s/AKfycbzB3F0iaBXWNo50XEL2ARXr_aEoWp2Ij_nTAqy_rTGsmq6lxPk/exec
echo " "
echo "..."







