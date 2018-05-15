FROM node:9

# Create work directory
WORKDIR /usr/src/app

# Copy app source to work directory
COPY . /usr/src/app

# Install app dependencies
RUN yarn install

# Build
RUN npm start build

#Run the app
CMD npm start