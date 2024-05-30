# The Movie Database

## Introduction

This project is a movie database that is build with HTML, CSS and JavaScript. It utilizes Firebase Authentication for user authentication and Firestore Database for storing user data. Users need to create an account to use the webpage. When logged in the user can access the films, read information about the films, add them to favorite, add a review, and delete their account. The movies are fetched on the backend from The Movie Database API.

API-key is hidden on the backend.

## Table of Contents

- [Usage](#usage)
- [GitHub](#github)
- [Credits](#credits)

## Usage

To run this project, follow these steps:

1. Run the application: `npm run build`
2. Run both servers: `npm run server` & `npm run server2`

Due to issues encountered during deployment on Netlify, a clone were made for the deployment and some modifications were made to the server and API fetching to ensure compatibility with the Netlify environment.

You can view a live demo of the application hosted on Netlify: https://classy-narwhal-ea20e7.netlify.app
 
## Dependencies

This project relies on the following dependencies:

- **Firebase SDK**: (https://firebase.google.com/docs) - Used for Firebase Authentication and Firestore Database.
- **Express**: (https://expressjs.com) - Used for setting up the backend server.
- **Webpack**: (https://webpack.js.org/concepts/) - Used for bundling JavaScript modules.
- **Babel**: (https://babeljs.io/docs) - Used for transpiling ES6+ code to ES5 for compatibility.
- **dotenv**: (https://www.npmjs.com/package/dotenv) - Used for managing environment variables.

## GitHub

- Link to GitHub Repository: https://github.com/benedictenaess/final_project

## Credits

- The Movie Database API ([https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api)): Used for fetching movie data

