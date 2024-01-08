FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN sudo apt-get install chromium-browser

# Bundle app source
COPY . /usr/src/app

EXPOSE 1234