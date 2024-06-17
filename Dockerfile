FROM docker.io/node:16

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli@14

ARG PORT_BUILD=4200

ENV PORT=${PORT_BUILD}

EXPOSE ${PORT_BUILD}

ENTRYPOINT ng serve --host 0.0.0.0
