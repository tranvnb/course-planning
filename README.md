# CoursePlanning

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.2.

![image](https://user-images.githubusercontent.com/9379521/140168222-4e8db2c5-f364-4c8c-b650-3f6bd5883238.png)

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

### Kubernetes

Access to kubernetes cluster console and apply deployment files follow the order below
File name | Order
---|---
course-planning-namespace.yaml| 1
course-planning-storage-class.yaml | 2
...to be continued
