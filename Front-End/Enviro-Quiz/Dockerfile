FROM node:alpine as build
LABEL authors="bsoan"

WORKDIR /usr/local/app
COPY package*.json ./
COPY . ./

RUN npm install
RUN npm install -g @angular/cli

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/local/app/dist/enviro-quiz/browser /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

