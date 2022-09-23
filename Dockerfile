## Build the website
FROM node:18.9.0 as builder

USER node

WORKDIR /webapp

COPY --chown=node:node . .

# Install the node module
RUN npm install --unsafe-perm

RUN npm run build


## Deploy the website using nginx
FROM nginx:1.23.1-alpine

# Copy build folder from 'builder' to the default nginx public folder
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /webapp/build/ /usr/share/nginx/html

# Remove the "user" directive
RUN sed -i '/^user/d' /etc/nginx/nginx.conf

## add permissions for nginx user
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

CMD ["nginx", "-g", "daemon off;"]
