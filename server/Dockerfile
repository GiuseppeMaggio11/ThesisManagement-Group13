FROM cypress/browsers:node16.16.0-chrome107-ff107-edge

# Define the application's working directory.
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
# copy source code and npm files
COPY . .

# expose server port
EXPOSE 3001

# Run this command when the container is started
CMD ["node", "index.js"]