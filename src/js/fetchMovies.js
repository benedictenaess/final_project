import {filterMovies, sortMovies, genreID} from './filterMovies';
import {saveFavoriteMoviesToDatabase, userFavoriteGenre} from './app';

const pathName = window.location.pathname;
const selectCategory = document.querySelector('#categories');

const movieArray = [];

const fetchMovies = async ()=>{
	try {
		const response = await fetch('http://localhost:2000/');
		const data = await response.json();
		movieArray.push(...data);
		if(pathName.includes('pages/movies')){
			filterMovies(data);
		} else if(pathName.includes('index')){
			try {
				await renderFrontpageApi(data);
			} catch(err){
				console.log(err.message);
			}
		}
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
let currentClickedContainerFrontpage = null;

async function renderFrontpageApi(movies) {
	try{
		const currentUserFavoriteGenre = await userFavoriteGenre();
		console.log(currentUserFavoriteGenre);
		const genreName = currentUserFavoriteGenre.charAt(0).toUpperCase() + currentUserFavoriteGenre.slice(1);
		const userGenreId = genreID[genreName];
		movies.forEach(movie =>{
			movie.genre_ids.forEach(movieId =>{
				if(movieId === userGenreId){
					renderFavoriteMovies(movie, genreName)
				} 
			})
		})

	} catch(err){
		console.log(err.message);
	}
}

function renderFavoriteMovies(movie, genreName){
	
	const frontpageHeaderInfo = document.querySelector('.frontpage-info');
	const frontpageContainer = document.querySelector('.all-movies-container');
	const movieContainer = document.createElement('div');
	const movieImg = document.createElement('img');
	const infoContainer = document.createElement('div');
	const movieTitle = document.createElement('h3');
	const movieOverview = document.createElement('div');
	const movieRating = document.createElement('span');
	const movieReleaseDate = document.createElement('span');
	const addToFavorites = document.createElement('button');
	const textArea = document.createElement('textarea');

	addToFavorites.addEventListener('click',(e)=>{
		e.preventDefault();
		if(textArea.value.trim() !== '' && textArea.value !== 'Write Your Review Here!'){
			const movieReview = textArea.value.charAt(1).toUpperCase() + textArea.value.slice(1).toLocaleLowerCase();
			saveFavoriteMoviesToDatabase(movie, movieReview);
		} else {
			saveFavoriteMoviesToDatabase(movie);
		}
	})

	frontpageContainer.append(movieContainer);
	movieContainer.append(movieImg);

	frontpageHeaderInfo.textContent = `Check out new releases of your favorite movie genre: ${genreName}`;

	movieContainer.classList.add('each-movie-container');
	movieTitle.classList.add('frontpage-movie-title');
	movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

	movieContainer.addEventListener('click',(e)=>{
		if(e.target === textArea){
			textArea.textContent = '';
			return;
		} 
		if(currentClickedContainerFrontpage !== movieContainer) {

			if(currentClickedContainerFrontpage !== null) {
				const prevInfoContainer = currentClickedContainerFrontpage.querySelector('.info-container-frontpage');
				currentClickedContainerFrontpage.removeChild(prevInfoContainer);
				currentClickedContainerFrontpage.classList.remove('large-movie-container-frontpage');
			}
			
			currentClickedContainerFrontpage = movieContainer;
			
			movieReleaseDate.textContent = movie.release_date;
			movieTitle.textContent = movie.title;
			movieOverview.textContent = movie.overview;
			textArea.textContent = 'Write Your Review Here!';
			addToFavorites.textContent = 'Add to Favorites';
			movieRating.textContent = `Rating: ${movie.vote_average.toFixed(1)}`;

			movieContainer.append(infoContainer);
			infoContainer.append(movieTitle, movieRating, movieOverview, movieReleaseDate,textArea, addToFavorites);
			
			movieContainer.classList.add('large-movie-container-frontpage');
			infoContainer.classList.add('info-container-frontpage');

		} else {
			const prevInfoContainer = currentClickedContainerFrontpage.querySelector('.info-container-frontpage');
			currentClickedContainerFrontpage.removeChild(prevInfoContainer);
			movieContainer.classList.remove('large-movie-container-frontpage');
			currentClickedContainerFrontpage = null;
		}
	})
}

//SAVING MOVIES TO FAVORITEARRAY
const favoriteMoviesArray = [];

//RENDER MOVIESPAGE API ------------------------------------------------
function renderMoviepageApi(movies){
    const moviespageContainer = document.querySelector('.moviespage-movies-section');
    moviespageContainer.textContent = '';
    
    let currentClickedContainer = null;

    movies.forEach(movie =>{
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');
        const infoContainer = document.createElement('div');
        const movieTitle = document.createElement('h4');
        const movieOverview = document.createElement('div');
		const movieReleaseDate = document.createElement('span');
		const movieRating = document.createElement('span');
        const addToFavorites = document.createElement('button');
		const textArea = document.createElement('textarea');

		addToFavorites.addEventListener('click',(e)=>{
			e.preventDefault();
			if(textArea.value.trim() !== '' && textArea.value !== 'Write Your Review Here!'){
				const movieReview = textArea.value.charAt(1).toUpperCase() + textArea.value.slice(1).toLocaleLowerCase();
				saveFavoriteMoviesToDatabase(movie, movieReview);
			} else {
				saveFavoriteMoviesToDatabase(movie);
			}
		})

        moviespageContainer.append(movieContainer);
        movieContainer.append(movieImg);

        movieContainer.classList.add('moviespage-movies-container');
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        
        movieContainer.addEventListener('click',(e)=>{
			if(e.target === textArea){
				textArea.textContent = '';
				return;
			} 
            if(currentClickedContainer !== movieContainer) {

                if(currentClickedContainer !== null) {
                    const prevInfoContainer = currentClickedContainer.querySelector('.moviepage-info-container');
                    currentClickedContainer.removeChild(prevInfoContainer);
                    currentClickedContainer.classList.remove('large-movie-container');
                }
                
                currentClickedContainer = movieContainer;
                movieContainer.append(infoContainer);
                infoContainer.append(movieTitle, movieRating, movieOverview, movieReleaseDate,textArea, addToFavorites);
                
				movieReleaseDate.textContent = movie.release_date;
                movieTitle.textContent = movie.title;
                movieOverview.textContent = movie.overview;
				textArea.textContent = 'Write Your Review Here!';
                addToFavorites.textContent = 'Add to Favorites';
                movieRating.textContent = `Rating: ${movie.vote_average.toFixed(1)}`;

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

export {fetchMovies, renderMoviepageApi};