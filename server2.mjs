import express, { request, response } from 'express';
import fetch from "node-fetch";
import cors from "cors";
import 'dotenv/config';

const PORT = 3000;
const app = express();
const requestOptions = {
    method: 'GET', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    mode: 'cors',
};
app.use(cors());

app.listen(PORT, ()=>{
	console.log(`Server is running on ${PORT}`);
})

const {API_KEY} = process.env

app.get('/', async (req, res)=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`, requestOptions);
		const data = await response.json();
		const allGenres = data.genres;
		res.json(allGenres);
	} catch (err){
		console.log(err.message);
	}
})