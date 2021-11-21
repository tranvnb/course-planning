#!/bin/bash
set -ea
echo "This is port was set from the environment: $PORT "
sed -i -e 's/$PORT'"$PORT"'/g' /etc/nginx/conf.d/default/default.conf && nginx -g 'daemon off;'

exec "$@"