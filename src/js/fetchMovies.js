import apiKey from "./apiKey.js";
import {filterMovies, sortMovies} from './filterMovies.js';

const pathName = window.location.pathname;
const selectCategory = document.querySelector('#categories');

let page = 1;

const movieArray = [];

const fetchMovieApiForMoviepage = async ()=>{
	try {
		const response = await fetch('http://localhost:2000/');
		const data = await response.json();
		movieArray.push(...data);
		filterMovies(data);
	} catch (err){
		console.log(err.message);
	}
}

const fetchMovieApiForFrontpage = async ()=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`);
			const data = await response.json();
			const movieData = data.results;
			renderFrontpageApi(movieData);
	} catch (err){
		console.log(err.message);
	}
}

//SORTING MOVIES ----------------------------------------------------------

if(pathName.includes('pages/movies.html')){
	selectCategory.addEventListener('change', ()=>{
		sortMovies(movieArray)
	})
}

//REDNER FRONTPAGE API ----------------------------------------------------
function renderFrontpageApi(movies) {
	movies.forEach(movie =>{
		const frontpageContainer = document.querySelector('.all-movies-container');
		const movieContainer = document.createElement('div');
		const movieImg = document.createElement('img');
		const movieInfoContainer = document.createElement('div');
		const movieTitle = document.createElement('h3');
		const movieOverview = document.createElement('p');
		const movieRelease = document.createElement('span');
		
		frontpageContainer.append(movieContainer);
		movieContainer.append(movieImg);

		movieContainer.classList.add('each-movie-container');
		movieTitle.classList.add('frontpage-movie-title');

		movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
		
		movieContainer.addEventListener('mouseover', ()=>{
			movieContainer.append(movieInfoContainer);
			movieContainer.classList.add('each-movie-container-hover');
			movieInfoContainer.classList.add('movie-info-container');
			movieInfoContainer.append(movieTitle, movieOverview, movieRelease);

			movieTitle.textContent = movie.title;
			movieOverview.textContent = `${movie.overview.slice(0, 210)} ...`;
			movieRelease.textContent = `Release date: ${movie.release_date}`;
			if (!movie.overview){
				movieOverview.textContent = 'We dont know what happens in this movie...'
			}
		});
		movieContainer.addEventListener('mouseleave', ()=>{
			movieContainer.classList.remove('each-movie-container-hover');
			movieContainer.removeChild(movieInfoContainer);

		})
	})
}

async function scrollMoviesEffect (){
	try {
		window.addEventListener('scroll', ()=>{
			if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
				page ++ ; 
				fetchMovieApiForFrontpage(page)
			}
		})
	} catch(err){
		console.log(err.message);
	}
}

//RENDER MOVIESPAGE API ------------------------------------------------

// function renderMoviepageApi(movies){
// 	const moviespageContainer = document.querySelector('.moviespage-movies-section');
// 	moviespageContainer.textContent = '';

// 	let currentActiveContainer = null;

// 	movies.forEach(movie =>{
// 		const movieContainer = document.createElement('div');
// 		const movieImg = document.createElement('img');
// 		const infoContainer = document.createElement('div');
			
// 		const movieTitle = document.createElement('h4');
// 		const movieOverview = document.createElement('p');
// 		const addToFavorites = document.createElement('button');
	
// 		moviespageContainer.append(movieContainer);
// 		movieContainer.append(movieImg);

	
// 		movieContainer.classList.add('moviespage-movies-container');
	
// 		movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
		
// 		let isClicked = false;
		
// 		movieContainer.addEventListener('click',()=>{
// 			if(currentActiveContainer !== movieContainer){

// 			}
// 			if(!isClicked){
// 				movieContainer.append(infoContainer);
// 				infoContainer.append(movieTitle, movieOverview, addToFavorites);
				
// 				movieTitle.textContent = movie.title;
// 				movieOverview.textContent = movie.overview;
// 				addToFavorites.textContent = 'Add to Favorites';
				
// 				movieContainer.classList.add('large-movie-container');
// 				infoContainer.classList.add('moviepage-info-container');
				
// 				isClicked = true;
// 			} else {
// 				movieContainer.removeChild(infoContainer);
// 				infoContainer.removeChild(movieTitle, movieOverview, addToFavorites);

// 				movieContainer.classList.remove('large-movie-container');
// 				infoContainer.classList.remove('moviepage-info-container');
				
// 				isClicked = false;
// 			  }
// 		})		
// 	})
// }

function renderMoviepageApi(movies){
    const moviespageContainer = document.querySelector('.moviespage-movies-section');
    moviespageContainer.textContent = '';
    
    let currentClickedContainer = null;

    movies.forEach(movie =>{
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');
        const infoContainer = document.createElement('div');
        const movieTitle = document.createElement('h4');
        const movieOverview = document.createElement('p');
		const movieReleaseDate = document.createElement('p');
        const addToFavorites = document.createElement('button');

        moviespageContainer.append(movieContainer);
        movieContainer.append(movieImg);

        movieContainer.classList.add('moviespage-movies-container');
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        
        movieContainer.addEventListener('click',()=>{
            if(currentClickedContainer !== movieContainer) {
                if(currentClickedContainer !== null) {
                    const prevInfoContainer = currentClickedContainer.querySelector('.moviepage-info-container');
                    currentClickedContainer.removeChild(prevInfoContainer);
                    currentClickedContainer.classList.remove('large-movie-container');
                }
                
                currentClickedContainer = movieContainer;
                movieContainer.append(infoContainer);
                infoContainer.append(movieTitle, movieOverview, movieReleaseDate, addToFavorites);
                
				movieReleaseDate.textContent = movie.release_date;
                movieTitle.textContent = movie.title;
                movieOverview.textContent = movie.overview;
                addToFavorites.textContent = 'Add to Favorites';
                
                movieContainer.classList.add('large-movie-container');
                infoContainer.classList.add('moviepage-info-container');
            } else {
                const prevInfoContainer = currentClickedContainer.querySelector('.moviepage-info-container');
                currentClickedContainer.removeChild(prevInfoContainer);
                movieContainer.classList.remove('large-movie-container');
                currentClickedContainer = null;
            }
        })     
    })
}

export {scrollMoviesEffect, fetchMovieApiForMoviepage, renderMoviepageApi, fetchMovieApiForFrontpage};