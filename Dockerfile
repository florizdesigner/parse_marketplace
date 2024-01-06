FROM node:alpine
RUN mkdir -p /home/app/node_modules && chmod -R 777 /home/app/node_modules
WORKDIR /home/app
COPY package*.json ./
RUN npm -g install --unsafe-perm=true --allow-root
EXPOSE 1234