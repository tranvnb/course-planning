#!/bin/bash
set -ea

if [ ! -f "package.json" ]; then
	echo "There is no package.json file"
	echo "Using strapi $(strapi -v)"
elif [ ! -d "node_modules" ] || [ ! "ls -qAL node_modules 2> /dev/null" ]; then
	echo "Node modules not installed. Installing..."
	if [ -f "yarn.lock" ]; then
		echo "yarn install"
		yarn install
	else 
		echo "npm install"
		npm install
	fi
fi
echo "npm run build"
npm run build
echo "Starting your app..."

cd /srv/angular/
npm run start

exec "$@"