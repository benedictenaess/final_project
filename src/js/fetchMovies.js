import apiKey from "./apiKey";

let page = 1;

const fetchMovieApi = async (pageNum)=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`);
		const data = await response.json();
		const movieData = data.results
		renderFrontpageApi(movieData);
		renderMoviepageApi(movieData);
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
				fetchMovieApi(page)
			}
		})
	} catch(err){
		console.log(err.message);
	}
}

//RENDER MOVIESPAGE API ------------------------------------------------

const genreID = [];

const fetchGenreId = async ()=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
		const data = await response.json();
		const allGenres = data.genres;
		allGenres.map(genre=>{
			genreID.push({id: genre.id, genre: genre.name});
		})
		console.log(genreID);
	} catch (err){
		console.log(err.message);
	}
}

function renderMoviepageApi(movie){
	const moviespageContainer = document.querySelector('.moviespage-movies-container');
	const movieContainer = document.createElement('div');
	const movieImg = document.createElement('img');
	const movieTitle = document.createElement('h3');
	// const movieRelease = document.createElement('span');
		
	moviespageContainer.append(movieContainer);
	movieContainer.append(movieImg);

	movieContainer.classList.add('each-movie-container');
	movieTitle.classList.add('frontpage-movie-title');

	movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
}

export {scrollMoviesEffect, fetchMovieApi, fetchGenreId};