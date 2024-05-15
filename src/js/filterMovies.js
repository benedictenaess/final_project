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
	} catch (err){
		console.log(err.message);
	}
}

fetchGenreId();

const filterButtons = document.querySelectorAll('.filter-button');
const selectCategory = document.querySelector('#categories');

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
						// sortMovies(movies)
					} else {
						const targetID = genreID[buttonTargetName];
						const renderMovies = movies.filter(movie => movie.genre_ids.includes(targetID));
						renderMoviepageApi(renderMovies);
						// sortMovies(renderMovies)
					}
				}
			} catch (err){
				console.log(err.message);
			}
		})
	})
}


function sortMovies(movies){
	selectCategory.addEventListener('change', ()=>{
		const targetOption = selectCategory.value;
		switch (targetOption) {
			case 'highest-rating':
				movies.sort((a, b)=> a.popularity - b.popularity);
				break;
			case 'lowest-rating':
				movies.sort((a, b)=> b.popularity - a.popularity);
				break;
			case 'newest-release':
				movies.sort((a, b)=> new Date(a.release_date) - new Date(b.release_date));
				break;
			case 'oldest-release':
				movies.sort((a, b)=> new Date(b.release_date) - new Date(a.release_date));
				break;
			default:
				break;
		}
	})
}

export {fetchGenreId, filterMovies, sortMovies};