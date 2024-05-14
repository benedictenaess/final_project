import apiKey from "./apiKey";
import {filterMovies} from './filterMovies';

let page = 1;
let totalPages = 6;
let allPages = [];

const fetchMovieApiForMoviepage = async (pageNum)=>{
	try {
		while (page <= totalPages){
			const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`);
			const data = await response.json();
			const movieData = data.results;
			if(movieData.length === 0){
				break;
			}
			allPages.push(...movieData);
			page++;

			filterMovies(allPages);
		}
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


//REDNER FRONTPAGE API --------------------------------------
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

function renderMoviepageApi(moviesWidthID){
	const moviespageContainer = document.querySelector('.moviespage-movies-section');
	moviespageContainer.textContent = '';
	moviesWidthID.forEach(movie =>{
		const movieContainer = document.createElement('div');
		const movieImg = document.createElement('img');
		const movieTitle = document.createElement('p');
	
		moviespageContainer.append(movieContainer);
		movieContainer.append(movieImg, movieTitle);
	
		movieContainer.classList.add('moviespage-movies-container');
	
		movieTitle.textContent = movie.title;
		movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
	})
}

export {scrollMoviesEffect, fetchMovieApiForMoviepage, renderMoviepageApi, fetchMovieApiForFrontpage};