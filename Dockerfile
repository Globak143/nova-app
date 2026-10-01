# Start from an official Node.js 18 image — comes with Node and npm pre-installed
FROM node:18

# Set the working folder inside the container; everything after this happens relative to here
WORKDIR /usr/src/app

# Copy only the package files first (not the rest of the code yet)
# This lets Docker reuse the cached "npm install" step if only your code changes, not your dependencies
COPY package*.json ./ 

# Install dependencies, skipping devDependencies (jest, supertest) — those are only needed for testing,
# not for running the app in production, so leaving them out keeps the image smaller
RUN npm install --omit=dev

# Now copy the rest of the application code into the container
COPY . .

# These two ARG lines define build-time variables — values that get passed in
# from OUTSIDE when the image is built (GitHub Actions will supply the real values)
ARG GIT_COMMIT=unknown
ARG BUILD_TIME=unknown

# Convert those build-time ARGs into environment variables that exist INSIDE the running container
# This is what makes them readable by server.js via process.env.GIT_COMMIT / process.env.BUILD_TIME
ENV GIT_COMMIT=$GIT_COMMIT
ENV BUILD_TIME=$BUILD_TIME

# Documents that the app listens on port 3000 (doesn't open the port by itself — just informational)
EXPOSE 3000

# The command that actually runs when a container starts from this image
# "npm start" runs the "start" script from package.json, which is "node server.js"
CMD [ "npm", "start" ]