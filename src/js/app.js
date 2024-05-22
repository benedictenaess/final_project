import firebaseConfig from "./firebaseConfig";
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {collection, getFirestore, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';

const pathName = window.location.pathname;

//INITIALIZE FIREBASE AUTH/FIRESTORE ------------------------
initializeApp(firebaseConfig);
const authService = getAuth();
const database = getFirestore();
const usersCollection = collection(database, 'users');
const favoritesCollection = collection(database, 'favorites');

//ACTIVE NAV
const homeNavButton = document.querySelector('.home-nav');
const moviesNavButton = document.querySelector('.movies-nav');
const favoritesNavButton = document.querySelector('.favorites-nav');
const profileNavButton = document.querySelector('.profile-nav');

function pageNavigation(){
	homeNavButton.addEventListener('click',(e)=>{
		e.preventDefault();
		window.location.pathname = '/dist/index.html';
		activeButton(homeNavButton);
	})
	
	moviesNavButton.addEventListener('click',(e)=>{
		e.preventDefault();
		window.location.pathname = '/src/pages/movies.html';
	})
	
	favoritesNavButton.addEventListener('click',(e)=>{
		e.preventDefault();
		window.location.pathname = '/src/pages/favorites.html';
	})
	
	profileNavButton.addEventListener('click',(e)=>{
		e.preventDefault();
		window.location.pathname = '/src/pages/userProfile.html';
	})
}

//SIGN UP ------------------------
const signUpEmail = document.querySelector('.signup-email');
const signUpPassword = document.querySelector('.signup-password');
const signUpFirstname = document.querySelector('#firstname');
const signUpLastname = document.querySelector('#lastname');
const signUpGenre = document.querySelector('#genre');
const signUpButton = document.querySelector('.sign-up-button_submit');
const signUpForm = document.querySelector('.sign-up-form');

const mainContentSection = document.querySelector('.main-content');
const formSection = document.querySelector('.form-section');
const signOutButton = document.querySelector('.sign-out-button');

const signUpUser = async ()=>{
	const firstnameValue = signUpFirstname.value.charAt(0).toUpperCase() + signUpFirstname.value.slice(1).toLowerCase().trim();
	const lastnameValue = signUpLastname.value.charAt(0).toUpperCase() + signUpLastname.value.slice(1).toLowerCase().trim();

	let newUser = {
		firstname: firstnameValue,
		lastname: lastnameValue,
		genre: signUpGenre.value,
		email: signUpEmail.value.toLowerCase().trim(),
		password: signUpPassword.value.trim()
	}
	try {
		const userCredential = await createUserWithEmailAndPassword(authService, newUser.email, newUser.password);
		console.log('The user has successfully signed up');
		newUser = {...newUser, id: userCredential.user.uid};
		renderUserName(newUser.firstname, newUser.lastname);
		try {
			await addDoc(usersCollection, newUser)
			console.log('User successfully added to users collection');
		} catch (createUserError) {
			console.log('Create user error:', createUserError.message);
		}
	} catch (authError){
		console.log('Authentication error:', authError.message);
		return
	} 
};

if(signUpButton){
	signUpButton.addEventListener('click', (e)=>{
		e.preventDefault();
		signUpUser();
	})
}

//SIGN IN ------------------------
const signInEmail = document.querySelector('.signin-email');
const signInPassword = document.querySelector('.signin-password');
const signInButton = document.querySelector('.sign-in-button_submit');
const signInForm = document.querySelector('.sign-in-form');

const signInUser = async ()=>{
	const userEmail = signInEmail.value.toLowerCase().trim();
	const userPassword = signInPassword.value.trim();
	try {
		const userCredential = await signInWithEmailAndPassword(authService, userEmail, userPassword);
		console.log('The user has successfully signed in');

		const signedInUserID = userCredential.user.uid;
		const querySnapshot = await getDocs(usersCollection);
		const allUsers = querySnapshot.docs.map((doc)=> doc.data());
		const signedInUser = allUsers.find((user)=> user.id === signedInUserID);
		renderUserName(signedInUser.firstname, signedInUser.lastname);
	} catch (err) {
			console.log(err.message)
	}
};

if(signInButton){
	signInButton.addEventListener('click', (e)=>{
		e.preventDefault();
		signInUser();
	})
}

//SIGN OUT ------------------------
const signInFormVisibility = document.querySelector('.signin-form_visibility');
const signUpFormVisibility = document.querySelector('.signup-form_visibility');


const signOutUser = async ()=>{
	try {
		signOut(authService)
		console.log('The user has succsessfully signed out');
	} catch (err) {
		console.log(err.message)
	}
};

signOutButton.addEventListener('click', (e)=>{
	e.preventDefault();
	window.location.href = '/dist/index.html';
	signOutUser();
})

//RENDER USERS ---------------------------------------
const userNameElement = document.createElement('h1');
const usernameContainer = document.querySelector('.render-username-container');

function renderUserName(firstname, lastname){
	userNameElement.textContent = `Welcome ${firstname} ${lastname}`;
	usernameContainer.classList.add('render-username');
	usernameContainer.append(userNameElement);
	setTimeout(() => {
		usernameContainer.removeChild(userNameElement);
		usernameContainer.classList.remove('render-username');
	}, 3000);
}

const renderUsersOnUserProfile = async()=>{
	try {
		const currentUser = authService.currentUser;
		if(currentUser && pathName.includes('/src/pages/userProfile.html')){
			const querySnapshot = await getDocs(usersCollection);
			const allUsers = querySnapshot.docs.map((doc)=> doc.data());
			const signedInUser = allUsers.find((user)=> user.id === currentUser.uid);
			
			const userContainer = document.querySelector('.user-container');

			const userName = document.createElement('span');
			const userEmail = document.createElement('span');
			const userGenre = document.createElement('span');

			userContainer.append(userName, userEmail, userGenre);
			userName.textContent = `User: ${signedInUser.firstname} ${signedInUser.lastname}`;
			userEmail.textContent = `Email: ${signedInUser.email}`
			userGenre.textContent = `Your Favorite Genre is: ${signedInUser.genre}`;
		}
	} catch(err){
		console.log(err.message);
	}
}

//DELETE AUTH AND FIRESTORE ---------------------------------------------------

const deleteAccountButton = document.querySelector('.delete-account-button');

if(pathName.includes('/src/pages/userProfile.html')){
	deleteAccountButton.addEventListener('click', async()=>{
		await deleteAccount();
		window.location.pathname = '/dist/index.html';
	})
}

const deleteAccount = async ()=>{
	try {
		const currentSignedinUser = authService.currentUser;
		const signedInUserUid = currentSignedinUser.uid;
		
		const querySnapshot = await getDocs(usersCollection);
		const usersWithUserIdAndUid = [];
		querySnapshot.forEach(doc =>{
			const userData = doc.data()
			const user = {
				uniqueId: doc.id,
				userId: userData.id
			};
			usersWithUserIdAndUid.push(user);
		})

		const userInfoFromDatabase = usersWithUserIdAndUid.find(user => user.userId === signedInUserUid);
		const userInfoToBeDeleted = userInfoFromDatabase.uniqueId;

		if(userInfoFromDatabase.userId === signedInUserUid){
			await deleteDoc(doc(database, 'users', userInfoToBeDeleted));
			await currentSignedinUser.delete();
		}
		console.log('User account was successfully deleted');

	} catch(err){
		console.log(err.message);
	}
}

//CHANGING DISPLAY SINGIN/OUT ------------------------------------------
function signInDisplay(){
	if(window.location.pathname === '/dist/index.html'){
		signInForm.reset();
		signUpForm.reset();
		mainContentSection.style.display = 'block';
		formSection.style.display = 'none';
	}
}

function signOutDisplay(){
	if(window.location.pathname === '/dist/index.html'){
		mainContentSection.style.display = 'none';
		formSection.style.display = 'block';
		signInFormVisibility.style.display = 'block';
		signUpFormVisibility.style.display = 'none';
		userNameElement.textContent = '';
	}
}

function signOutDisplaySignOutButtonHidden(){
	signOutButton.style.visibility = 'hidden';
}

function signInDisplaySignOutButtonVisible(){
	signOutButton.style.visibility = 'visible';
}

//TOGGLE SIGN IN/SIGN UP -----------------------------------------------

const signInToggle = document.querySelector('.signin-form_button');
const signUpToggle = document.querySelector('.signup-form_button');

function toggleFormVisibility(formVisible, formHidden, buttonActive, buttonInactive){
	formVisible.style.display = 'block';
	formHidden.style.display = 'none';
	buttonActive.style.backgroundColor = 'var(--color-accent-1)';
	buttonInactive.style.backgroundColor = 'var(--color-accent-2)';
};

if(signInToggle){
	signInToggle.addEventListener('click', (e)=>{
		e.preventDefault();
		toggleFormVisibility(signInFormVisibility, signUpFormVisibility, signInToggle, signUpToggle);
	});
}

if(signUpToggle){
	signUpToggle.addEventListener('click', (e)=>{
		e.preventDefault();
		toggleFormVisibility(signUpFormVisibility, signInFormVisibility, signUpToggle, signInToggle);
	});
}

onAuthStateChanged(authService, (user)=>{
	if(user){
		console.log('user is logged in');
		signInDisplaySignOutButtonVisible();
		signInDisplay();
		pageNavigation();
		renderUsersOnUserProfile();
	} else{
		console.log('user is logged out');
		signOutDisplaySignOutButtonHidden();
		signOutDisplay();
	}
})

async function saveFavoriteMoviesToDatabase(movie, movieReview) {
    try {
		const querySnapshot = await getDocs(favoritesCollection);
		const existingMovies = querySnapshot.docs.map(doc => doc.data());
		const isExisting = existingMovies.some(existingMovie => existingMovie.title === movie.original_title);
		if(!isExisting){
			if(movieReview){
				const newMovie = {
					title: movie.original_title,
					releaseDate: movie.release_date,
					img: movie.poster_path,
					overview: movie.overview,
					review: movieReview
				};	
				console.log(movieReview);
				await addDoc(favoritesCollection, newMovie);
				console.log(`${newMovie.title} has been added to favorites`);
			} else {
				const newMovie = {
					title: movie.original_title,
					releaseDate: movie.release_date,
					img: movie.poster_path,
					overview: movie.overview
				};
				console.log(movieReview);
				await addDoc(favoritesCollection, newMovie);
				console.log(`${newMovie.title} has been added to favorites`);
			}
		} else {
			console.log('This movie already exists');
			return;
		}
    } catch(err) {
        console.log(err.message);
    }
}

//RENDER FAVORITE MOVIES -----------------------------------------------------------------
const favoriteMoviesContainer = document.querySelector('.favorite-movies-container');

async function displayFavorites(){
	try {
		favoriteMoviesContainer.textContent = '';
		const querySnapshot = await getDocs(favoritesCollection);
		const allFavoritMovies = querySnapshot.docs.map(doc => doc.data());
		allFavoritMovies.forEach((movie) =>{
			rednerFavoriteMovies(movie);
		})
	} catch (err){
		console.log(err.message);
	}
}

//RENDER FAVORITE MOVIES ----------------------------------------------------

function rednerFavoriteMovies(movie){
	if(pathName.includes('favorites')){
		const movieContainer = document.createElement('div');
		const movieImg = document.createElement('img');
		const infoContainer = document.createElement('div');
		const movieTitle = document.createElement('h2');
		const movieReleaseDate = document.createElement('p');
		const movieReview = document.createElement('span');
		const movieOverview = document.createElement('p');
		const deleteFavoriteMovie = document.createElement('button');

		movieTitle.textContent = movie.title;
		movieReleaseDate.textContent = `Release date: ${movie.releaseDate}`;
		movieOverview.textContent = movie.overview;
		movieImg.src = `https://image.tmdb.org/t/p/w500${movie.img}`;
		deleteFavoriteMovie.textContent = 'Remove from Favorites';
		movieReview.textContent = movie.review ? `User review: ${movie.review}` : '';

		movieContainer.classList.add('each-favorite-movie-container');
		infoContainer.classList.add('favorite-movie-info');
		
		favoriteMoviesContainer.append(movieContainer);
		movieContainer.append(movieImg, infoContainer);
		infoContainer.append(movieTitle, movieReleaseDate, movieOverview, movieReview, deleteFavoriteMovie);

		deleteFavoriteMovie.addEventListener('click', (e)=>{
			const removeContainer = e.target.parentElement.parentElement;
			deleteFavoriteMovieFromDatabase(movie);
			favoriteMoviesContainer.removeChild(removeContainer);
			document.addEventListener('DOMContentLoaded', ()=>{
				displayFavorites();
			})
		})
	}
}

//DELETE FAVORITE MOVIE -------------------------------------------------------------------

async function deleteFavoriteMovieFromDatabase(movie){
    try {
		let docId = [];
        const querySnapshot = await getDocs(favoritesCollection);
        for (const doc of querySnapshot.docs) {
            const favoriteMovie = doc.data();
			if (favoriteMovie.title === movie.title) {
				docId.push(doc.id);
			}
        }
		const docToDelete = docId[0];
		await deleteDoc(doc(database, 'favorites', docToDelete));
    } catch (err){
        console.log(err.message);
    }
}

if(pathName.includes('favorites')){
	displayFavorites();
}

//RENDER MOVIES --------------------------------------------------------------------------
import {fetchMovieApiForFrontpage, scrollMoviesEffect, fetchMovieApiForMoviepage} from './fetchMovies';

if(pathName.includes('/dist/index.html')){
	fetchMovieApiForFrontpage(1);
	scrollMoviesEffect();
}

if(pathName.includes('pages/movies')){
	fetchMovieApiForMoviepage();
}

export {saveFavoriteMoviesToDatabase}