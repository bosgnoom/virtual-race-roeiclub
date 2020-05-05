FROM nginx

WORKDIR /etc/nginx
COPY nginx/ .

WORKDIR /usr/share/nginx/html
COPY site/ .

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]


