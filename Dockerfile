## Build the website
FROM node:16.1.0 as builder

WORKDIR /webapp

ADD . .

# Install the node module
RUN npm install --unsafe-perm

RUN npm run build


## Deploy the website using nginx
FROM nginx:1.20.0-alpine

# Copy build folder from 'builder' to the default nginx public folder
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /webapp/build/ /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
