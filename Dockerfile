###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Base image
FROM node:20-alpine as development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm install --legacy-peer-deps

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./
# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm pkg delete scripts.prepare && \
    npm install --legacy-peer-deps --only=production && \
    npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine as production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/.env ./
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package*.json ./

# Start the server using the production build
CMD [ "node", "dist/main.js" ]