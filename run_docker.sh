docker run -d --rm \
    -p 8000:443 \
    -v "$(pwd)"/site:/usr/share/nginx/html:Z \
    my-nginx

# Voor nu mapping van /site naar docker container,
# gemakkelijker in het ontwikkelen. Straks eruit
# halen en alles in de container zetten


