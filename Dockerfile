# Create image based on the official Node 6 image from dockerhub
FROM node:6

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY .angular-cli.json /usr/src/app
COPY ./src/app /usr/src/app
COPY proxy.conf.json /usr/src/app
COPY tsconfig.json /usr/src/app

RUN mkdir -p /usr/src/app/src
COPY tsconfig.json /usr/src/app/src/tsconfig.app.json

# Expose the port the app runs in
EXPOSE 4200

# Serve the app
CMD ["npm", "start"]