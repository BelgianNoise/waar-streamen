FROM node:18-alpine As build

RUN npm i -g pnpm
WORKDIR /usr/src/app
COPY --chown=node:node . .
# Install with dev dependencies cause we need nest to build the code
RUN pnpm install
RUN pnpm run build
# Overwrite node_modules with production dependencies
RUN pnpm install --prod
USER node

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
