import express, { request, response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const PORT = 2000;
const app = express();

app.use(cors());

app.listen(PORT, ()=>{
	console.log(`THE SERVER IS RUNNING ON PORT: ${PORT}`);
});

const {API_KEY} = process.env

app.get('/', async (req, res)=>{
	const totalPages = 10;
	const allMovies = [];
	try {
		for(let page = 1; page <= totalPages; page++){
			const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`);
			const data = await response.json();
			const movieData = data.results;
			allMovies.push(...movieData);
		}
		res.json(allMovies);
	} catch (err){
		console.log(err.message);
	}
})