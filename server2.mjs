import express, { request, response } from 'express';
import fetch from "node-fetch";
import cors from "cors";
import 'dotenv/config';

const PORT = 3000;
const app = express();
const options = {
	method: 'GET',
	headers: {
	  accept: 'application/json',
	  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYTlkMTIzM2ZmN2MzZjU2NmM0ZWYxMGUwOTE4ZWMwNyIsInN1YiI6IjY2Mzc5NzY3NDcwZWFkMDEyODEyZjg1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QNNIASLnDk6F1vAEmyzgXefs5hSiwgPN-PCIcasJlCg'
	}
  };
app.use(cors());

app.listen(PORT, ()=>{
	console.log(`Server is running on ${PORT}`);
})

const {API_KEY} = process.env

app.get('/', async (req, res)=>{
	try {
		const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`, options);
		const data = await response.json();
		const allGenres = data.genres;
		res.json(allGenres);
	} catch (err){
		console.log(err.message);
	}
})