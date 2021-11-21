FROM node:16.13.0 as builder
MAINTAINER BrianVo vnbaotran@gmail.com

# Set Environment Variables
ENV DEBIAN_FRONTEND noninteractive

ARG TZ=UTC
ENV TZ ${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/angular

WORKDIR /srv/angular

COPY . ./

RUN npm install

RUN npm run build --prod

FROM nginx

COPY ./nginx-config/nginx.conf /etc/nginx/

COPY ./nginx-config/default.conf /etc/nginx/templates/default.conf.template

# using nginx template as verion after 1.19
#COPY ./nginx-config/default.conf /etc/nginx/templates/default.conf.template

COPY --from=builder /srv/angular/dist/course-planning/* /usr/share/nginx/html/

CMD ["/bin/bash" , "-c" , "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

#CMD /bin/bash -c "envsubst '$PORT' < /etc/nginx/conf.d/default/default.conf > /etc/nginx/conf.d/default/default.conf" && nginx -g 'daemon off;'""
#CMD sed -i -e 's/$PORT'"$PORT"'/g' /etc/nginx/conf.d/default/default.conf && nginx -g 'daemon off;'
#/bin/bash -c "envsubst '$PORT' < /etc/nginx/conf.d/default/default.conf > /etc/nginx/conf.d/default/default.conf" && nginx -g 'daemon off;'