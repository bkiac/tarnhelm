FROM node:14.17.0-alpine3.13
ENV NODE_ENV production
WORKDIR /app
COPY --chown=node:node . .
RUN yarn install --frozen-lockfile
# ENTRYPOINT ["/bin/bash"]
RUN yarn build
# USER node
# RUN chmod +x wait-for-it.sh
