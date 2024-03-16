FROM registry.thinknet.co.th/sredev/node:20.10

RUN apt-get update \
  && apt-get install -y python3 build-essential

RUN npm install -g bun@latest

WORKDIR /usr/src/app
COPY . /usr/src/app/
ARG APP_ENV
RUN cp .env.$APP_ENV .env && \
  bun install && \
  bun run build

CMD ["bun", "run", "start"]
