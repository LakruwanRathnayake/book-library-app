# BookLibraryApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## 🚀 Setup Instructions

**1. Clone the repository**

git clone https://github.com/LakruwanRathnayake/book-library-app.git
cd book-library-app


**2. Install dependencies**

npm install


**3. Terminal 1 - Start JSON Server (port 3000)**


npx json-server --watch db.json --port 3000

*API: http://localhost:3000/books*

**4. Terminal 2 - Start Angular app**

npm start

*App: http://localhost:4200*

## Features
- Full CRUD (add/edit/delete books)
- Search by title/author
- Grid/List view toggle
- Responsive design
- Image upload + validation

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Built by
Lakruwan Rathnayake for LinearSix Frontend Developer Interview (Jan 2026)
