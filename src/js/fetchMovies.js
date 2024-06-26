import {filterMovies, sortMovies, genreID} from './filterMovies';
import {userFavoriteGenre, createFavoritesCollectionAndAddMovieToFavorites} from './app';

const pathName = window.location.pathname;
const selectCategory = document.querySelector('#categories');

const movieArray = [];

const fetchMovies = async ()=>{
	try {
		const response = await fetch('http://localhost:2500/');
		const data = await response.json();
		movieArray.push(...data);
		filterMovies(data);
		await renderFirstMovieArray(data);
	} catch (err){
		if(pathName.includes('index')){
			const errorMsgContainer = document.querySelector('.main-content');
			errorMsgContainer.textContent = 'Try to reload the page';
			errorMsgContainer.classList.add('catch-error-style');
		}
	}
}

//SORTING MOVIES ----------------------------------------------------------
if(pathName.includes('index.html')){
	selectCategory.addEventListener('change', ()=>{
		sortMovies(movieArray)
	})
}

//ADD MOVIE TO FAVORITES --------------------------------------------------------
function addToFavorites(movie, textArea){
	if (textArea.value.trim() !== '' && textArea.value !== 'Write Your Review Here!') {
		const movieReview = textArea.value.charAt(0).toUpperCase() + textArea.value.slice(1).toLocaleLowerCase();
		createFavoritesCollectionAndAddMovieToFavorites(movie, movieReview);
	} else {
		createFavoritesCollectionAndAddMovieToFavorites(movie);
	}
	textArea.value = 'Write Your Review Here!';
}

//REDNER FIRST MOVIE ARRAY ON FRONTPAGE ----------------------------------------------------
let currentClickedContainer = null;

async function renderFirstMovieArray(movies) {
	try{
		const currentUserFavoriteGenre = await userFavoriteGenre();
		const genreName = currentUserFavoriteGenre.charAt(0).toUpperCase() + currentUserFavoriteGenre.slice(1);
		const userGenreId = genreID[genreName];
		movies.forEach(movie =>{
			movie.genre_ids.forEach(movieId =>{
				if(movieId === userGenreId){
					displayFrontpageMovies(movie, genreName)
				} 
			})
		})
	} catch(err){
		const errorMsgContainer = document.querySelector('.main-content');
		errorMsgContainer.textContent = 'Try to reload the page';
		errorMsgContainer.classList.add('catch-error-style');
	}
}

function displayFrontpageMovies(movie, genreName){
	const favoriteGenreContainer = document.querySelector('.frontpage-favorite-genre-container');
	const frontpageHeaderInfo = document.querySelector('.frontpage-info');
	const movieContainer = document.createElement('div');
	const movieImg = document.createElement('img');
	const largeDisplayContainer = document.createElement('div');
	const textArea = document.createElement('textarea');
	
	frontpageHeaderInfo.textContent = `Check out new releases of your favorite movie genre: ${genreName}`;

	favoriteGenreContainer.append(movieContainer, largeDisplayContainer);
	movieContainer.append(movieImg);
	movieImg.classList.add('frontpage-favorite-genre-img')

	movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

	movieContainer.addEventListener('click', ()=>{
		displayLargeMovieContainer(movie, movieContainer, largeDisplayContainer, textArea)
	})

	largeDisplayContainer.addEventListener('click', (e) => {
		removeLargeContainer(e, largeDisplayContainer, textArea)
	});
}

//RENDER ALL MOVIES ON FRONTPAGE ------------------------------------------------
function renderAllMovies(movies) {
    const allMoviesSection = document.querySelector('.frontpage-movies-section');
    allMoviesSection.textContent = '';

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');
        const largeDisplayContainer = document.createElement('div');
		const textArea = document.createElement('textarea');
      
        allMoviesSection.append(movieContainer, largeDisplayContainer);
        movieContainer.append(movieImg);

        movieContainer.classList.add('frontpage-all-movies-container');
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
		
        movieContainer.addEventListener('click', () => {
			displayLargeMovieContainer(movie, movieContainer, largeDisplayContainer, textArea)
        });
		largeDisplayContainer.addEventListener('click', (e) => {
			removeLargeContainer(e, largeDisplayContainer, textArea)
		});
    });
}

//DISPLAY LARGE MOVIE CONTAINER --------------------------------------------------------
function displayLargeMovieContainer(movie, movieContainer, largeDisplayContainer, textArea){
	const infoContainer = document.createElement('div');
	const movieTitle = document.createElement('h4');
    const movieOverview = document.createElement('div');
    const movieReleaseDate = document.createElement('span');
    const movieRating = document.createElement('span');
	const movieImgLarge = document.createElement('img');
	const addToFavoritesButton = document.createElement('button');

	addToFavoritesButton.addEventListener('click',(e)=>{
		e.preventDefault();
		addToFavorites(movie, textArea);
	})
	
	if (currentClickedContainer !== null) {
		currentClickedContainer.nextSibling.style.display = 'none';
	}

	currentClickedContainer = movieContainer;

	largeDisplayContainer.textContent = '';
	largeDisplayContainer.style.display = 'flex';
	largeDisplayContainer.append(movieImgLarge, infoContainer);
	infoContainer.append(movieTitle, movieRating, movieOverview, movieReleaseDate, textArea, addToFavoritesButton);

	movieReleaseDate.textContent = movie.release_date;
	movieTitle.textContent = movie.title;
	movieOverview.textContent = movie.overview;
	textArea.value = 'Write Your Review Here!';
	addToFavoritesButton.textContent = 'Add to Favorites';
	movieRating.textContent = `Rating: ${movie.vote_average.toFixed(1)}`;
	movieImgLarge.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

	movieImgLarge.classList.add('large-movie-img');
	largeDisplayContainer.classList.add('large-movie-container');
	infoContainer.classList.add('large-info-container');
}

//REMOVE LARGE MOVIE DISPLAY ------------------------------------------------------
function removeLargeContainer(e, largeDisplayContainer, textArea){
	if (e.target === textArea){
		textArea.value = '';
	} else {
		largeDisplayContainer.style.display = 'none';
		currentClickedContainer = null;
	}
}

export {fetchMovies, renderAllMovies};