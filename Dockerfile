FROM node:16.13.0 as builder
MAINTAINER BrianVo vnbaotran@gmail.com

# Set Environment Variables
ENV DEBIAN_FRONTEND noninteractive

ARG TZ=UTC
ENV TZ ${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/angular

WORKDIR /srv/angular

COPY . .

WORKDIR /srv/angular/

#RUN npm install -g npm@8.1.4

RUN npm install

RUN npm run build

FROM nginx

COPY --from=builder /srv/angular/nginx-config/default.conf /etc/nginx/conf.d/default/default.conf

COPY --from=builder /srv/angular/dist/course-planning /usr/share/nginx/html

#CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
#RUN echo "Assign port to Dyno: "$PORT
#EXPOSE $PORT
CMD sed -i -e 's/$PORT'"$PORT"'/g' /etc/nginx/conf.d/default/default.conf && nginx -g 'daemon off;'