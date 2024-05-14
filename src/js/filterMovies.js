import apiKey from "./apiKey";
import {renderMoviepageApi} from './fetchMovies';

const genreID = {};

const fetchGenreId = async ()=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
		const data = await response.json();
		const allGenres = data.genres;
		allGenres.forEach(genre=>{
			genreID[genre.name] = genre.id;
		})
		console.log(genreID);
	} catch (err){
		console.log(err.message);
	}
}

const filterButtons = document.querySelectorAll('.filter-button');

const filterMovies=(movies)=>{
	renderMoviepageApi(movies);
	filterButtons.forEach(button =>{
		button.addEventListener('click', async (e)=>{
			try {
				e.preventDefault();
				const buttonTargetName = button.textContent;
				if(buttonTargetName){
					if(buttonTargetName === 'All') {
						renderMoviepageApi(movies);
					} else {
						const targetID = genreID[buttonTargetName];
						const renderMovies = movies.filter(movie => movie.genre_ids.includes(targetID));
						renderMoviepageApi(renderMovies);
					}
				}
			} catch (err){
				console.log(err.message);
			}
		})
	})
}

export {fetchGenreId, filterMovies};