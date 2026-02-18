FROM ghcr.io/seplaz/film-frontend:latest as frontend
FROM nginx:alpine

COPY --from=frontend /usr/share/nginx/html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
