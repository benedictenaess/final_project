import apiKey from "./apiKey";
import {renderMoviepageApi} from './fetchMovies';

const genreID = {};
const fetchGenreId = async ()=>{
	try {
		const response = await fetch('http://localhost:3000/');
		const allGenres = await response.json();
		allGenres.forEach(genre=>{
			genreID[genre.name] = genre.id;
		})
		console.log(allGenres);
	} catch (err){
		console.log(err.message);
	}
}
console.log(genreID);

fetchGenreId();

const filterButtons = document.querySelectorAll('.filter-button');
const selectCategory = document.querySelector('#categories');

const filterMovies=(movies)=>{
	renderMoviepageApi(movies);
	filterButtons.forEach(button =>{
		button.addEventListener('click', async (e)=>{
			try {
				e.preventDefault();
				sortMovies(movies);
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


function sortMovies(movies){
	const targetOption = selectCategory.value;
	let comparator;
	switch (targetOption) {
		case 'highest-rating':
			comparator = (a, b)=> b.vote_average - a.vote_average;
			break;
		case 'lowest-rating':
			comparator = (a, b)=> a.vote_average - b.vote_average;
			break;
		case 'newest-release':
			comparator = (a, b)=> new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
			break;
		case 'title':
			comparator = (a, b)=> a.original_title.localeCompare(b.original_title);
			break;
		default:
			break;
	}
	movies.sort(comparator);
	renderMoviepageApi(movies);
}

export {fetchGenreId, filterMovies, sortMovies};