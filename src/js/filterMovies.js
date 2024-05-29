import {renderAllMovies} from './fetchMovies';

const genreID = {};
const fetchGenreId = async ()=>{
	try {
		const response = await fetch('http://localhost:3000/');
		const allGenres = await response.json();
		allGenres.forEach(genre=>{
			genreID[genre.name] = genre.id;
		})
	} catch (err){
		const errorMsgContainer = document.querySelector('.frontpage-movies-section');
		errorMsgContainer.textContent = 'Try to reload the page';
	}
}

fetchGenreId();

const filterButtons = document.querySelectorAll('.filter-button');
const selectCategory = document.querySelector('#categories');

const filterMovies=(movies)=>{
	renderAllMovies(movies);
	filterButtons.forEach(button =>{
		button.addEventListener('click', async (e)=>{
			try {
				e.preventDefault();
				sortMovies(movies);
				const buttonTargetName = button.textContent;
				if(buttonTargetName){
					if(buttonTargetName === 'All') {
						renderAllMovies(movies);
					} else {
						const targetID = genreID[buttonTargetName];
						const renderMovies = movies.filter(movie => movie.genre_ids.includes(targetID));
						renderAllMovies(renderMovies);
					}
				}
			} catch (err){
				const errorMsgContainer = document.querySelector('.frontpage-movies-section');
				errorMsgContainer.textContent = 'Try to reload the page';
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
	renderAllMovies(movies);
}

export {filterMovies, sortMovies, genreID};