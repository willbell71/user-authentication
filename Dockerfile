FROM nginx:alpine

WORKDIR /

COPY nginx/site.conf /etc/nginx/conf.d/default.conf
COPY login-reactts/dist/* /usr/share/nginx/html/

EXPOSE 80
