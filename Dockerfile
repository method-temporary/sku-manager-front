FROM nginx:stable-alpine
COPY dist /usr/share/nginx/html/manager
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY robots.txt /usr/share/nginx/html/robots.txt
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
