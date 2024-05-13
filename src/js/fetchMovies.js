import apiKey from "./apiKey";

let page = 1;

const fetchFrontpageApi = async (pageNum)=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`);
		const data = await response.json();
		renderFrontpageApi(data.results);
	} catch (err){
		console.log(err.message);
	}
}

function renderFrontpageApi(movies) {
	movies.forEach(movie =>{
		const allMoviesContainer = document.querySelector('.all-movies-container');
		const movieContainer = document.createElement('div');
		const movieImg = document.createElement('img');
		const movieInfoContainer = document.createElement('div');
		const movieTitle = document.createElement('h3');
		const movieOverview = document.createElement('p');
		const movieRelease = document.createElement('span');
		
		allMoviesContainer.append(movieContainer);
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
				fetchFrontpageApi(page)
			}
		})
	} catch(err){
		console.log(err.message);
	}
}

console.log(window.location.pathname)
export {scrollMoviesEffect, fetchFrontpageApi};