# CoursePlanning 

[Demo](https://programplanning.herokuapp.com)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3

![image](https://user-images.githubusercontent.com/9379521/142751147-f3b026b8-35f7-4214-a1e4-fcf6399f0dbb.png)

## Development server

Reference `angular.json` file for port and ip restriction (default is 4200 and from any ip addresses)

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng lint` for linting and checking source code and reference `.eslintrc.json` for more lint rules.

Run `npx prettier --check .` for checking prettier code format rules or `npx prettier --write .` for automatically update code format complied to `.prettierrc.json` config file.

Run

```bash
$ docker build -f Dockerfile.dev -t courses-planning .
$ docker run --name=courses-planning -p 8080:4200 -d courses-planning
```

to build docker image and then start docker container. Navigate to `http://localhost:8080/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Run

```bash
$ docker build -f Dockerfile -t courses-planning .
```

to build docker image and then pushing image to Docker Hub repository for further deployment.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deploy

### Heroku

Run `curl https://cli-assets.heroku.com/install-ubuntu.sh | sh` to install Heroku. On other environment please refer [heroku guide](https://devcenter.heroku.com/articles/heroku-cli)

Run `heroku login` login to heroku cli

Run `heroku stack:set container` to switch to heroku container mode

Update back end location variable `APP_URL` in `/projects/course-planning/src/environments/environment.ts` & `/projects/course-planning/src/environments/environment.prod.ts` according to your setting.

Get the git url project from heroku, typically https://git.heroku.com/[your-app-name].git

Run `git remote add heroku https://git.heroku.com/[your-app-name].git` to add remote branch to your current working git repos

Push code to start build `git push heroku main`.

Heroku will be the rest for you.

> NOTE: Adjust nginx configuration in ./nginx-config/nginx.conf & ./nginx-config/default.conf to math your security requirements or appy ssl certification

### Kubernetes

Access to kubernetes cluster console and apply deployment files follow the order below
File name | Order
---|---
course-planning-namespace.yaml| 1
course-planning-storage-class.yaml | 2
...to be continued
