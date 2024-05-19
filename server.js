import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const PORT = 2000;
const app = express();

app.use(cors());

app.listen(PORT, ()=>{
	console.log(`THE SERVER IS RUNNING ON PORT: ${PORT}`);
});



