FROM node as builder
MAINTAINER BrianVo vnbaotran@gmail.com

# Set Environment Variables
ENV DEBIAN_FRONTEND noninteractive

ARG TZ=UTC
ENV TZ ${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/angular

WORKDIR /srv/angular

COPY . .

EXPOSE 4200 49152

WORKDIR /srv/angular/

RUN npm install

RUN npm run build

# RUN chmod +x ./docker-entrypoint.sh

# ENTRYPOINT ["./docker-entrypoint.sh"]

FROM nginx

COPY --from=builder /srv/angular/dist/course-planning /usr/share/nginx/html