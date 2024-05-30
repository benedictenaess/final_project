# The Movie Database

## Introduction

This project is a movie database that is build with HTML, CSS and JavaScript. It utilizes Firebase Authentication for user authentication and Firestore Database for storing user data. Users need to create an account to use the webpage. When logged in the user can access the films, read information about the films, add them to favorite, add a review, and delete their account. The movies are fetched on the backend from The Movie Database API.

API-key is hidden on the backend.

## Table of Contents

- [Usage](#usage)
- [Dependencies](#dependencies)
- [Features](#features)
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

## Features

1. **Favorite Films Feature**: Easily add new film to the favorites page with detailed information such as title, film overview, release date, and user can add their own review when adding film to favoroites. Users can also delete movies from favorites. They are also added to the favorites collection of the current user, so that user can log in and out without the film being removed from favorites. The favorite films are paricular to each user.

2. **Form Validation**: Ensures data integrity by validating user input in real-time. Users are prompted to fill out all required fields and are alerted to any errors before submitting the form. For the sign in form emails that do not exist also get errors, as well as if password in incorrect to the existing email.

3. **Display of Film API**: First Film API that is displayed on the homepage is uniqe to each user and is based on the users favorit genre. The second API that is displayed on the homepage includes 200 movies.

4. **Sorting and Filtering**: Users can filter movies by genre on the homepage, and they can sort movies by newest releases and title. The genre filtering feature uses an API to fetch correct genre ids.

5. **Responsive Design**: The application is designed to be responsive and compatible with various screen sizes and devices, ensuring a seamless user experience across desktops, tablets, and smartphones.

6. **User Authentication**: The application uses user authentication with firebase authentication. User must sign up to create an account, and is then allowed to use the webpage. They can add films to the favorites page, which is uniqe for all useres. They can sign in, sign out and delete their account from the user profile page.

## GitHub

- Link to GitHub Repository: https://github.com/benedictenaess/final_project

## Credits

- The Movie Database API ([https://www.themoviedb.org/documentation/api](https://www.themoviedb.org/documentation/api)): Used for fetching movie data

