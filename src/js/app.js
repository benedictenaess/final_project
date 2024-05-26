import firebaseConfig from "./firebaseConfig";
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {collection, getFirestore, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';
import {fetchMovies} from './fetchMovies';
import { validateSignInForm } from "./signInValidation";
import {validateSignUpForm} from './signUpValidation';

const pathName = window.location.pathname;

//VALIDATION -----------------------------------------------------------------------------------

const signInEmail = document.querySelector('.signin-email');
const signInPassword = document.querySelector('.signin-password');
const signInEmailErrorSpan = document.querySelector('.email-signin-error-span');
const signInPasswordErrorSpan = document.querySelector('.password-signin-error-span');

const signUpFirstnameErrorSpan = document.querySelector('.firstname-signup-error-span');
const signUpLastnameErrorSpan = document.querySelector('.lastname-signup-error-span');
const signUpGenreErrorSpan = document.querySelector('.genre-signup-error-span');
const signUpEmailErrorSpan = document.querySelector('.email-signup-error-span');
const signUpPasswordErrorSpan = document.querySelector('.password-signup-error-span');


//INITIALIZE FIREBASE AUTH/FIRESTORE -------------------------------------
initializeApp(firebaseConfig);
const authService = getAuth();
const database = getFirestore();
const usersCollection = collection(database, 'users');
const favoritesCollection = collection(database, 'favorites');

//HAMBURGER MENU -----------------------------------------------------------------------------
const menuToggleButton = document.querySelector('.header-logo');
const homeNavButton = document.querySelector('.home-nav');
const moviesNavButton = document.querySelector('.movies-nav');
const favoritesNavButton = document.querySelector('.favorites-nav');
const profileNavButton = document.querySelector('.profile-nav');
const signOutButton = document.querySelector('.sign-out-button');

let isMenuVisible = false; // Track the menu visibility state

const setMenuVisibility = () => {
    if (window.innerWidth > 900) {
        homeNavButton.style.display = 'block';
        moviesNavButton.style.display = 'block';
        favoritesNavButton.style.display = 'block';
        profileNavButton.style.display = 'block';
        signOutButton.style.display = 'block';
    } else {
        if (isMenuVisible) {
            homeNavButton.style.display = 'block';
            moviesNavButton.style.display = 'block';
            favoritesNavButton.style.display = 'block';
            profileNavButton.style.display = 'block';
            signOutButton.style.display = 'block';
        } else {
            homeNavButton.style.display = 'none';
            moviesNavButton.style.display = 'none';
            favoritesNavButton.style.display = 'none';
            profileNavButton.style.display = 'none';
            signOutButton.style.display = 'none';
        }
    }
};

const menuBarToggle = () => {
    if (window.innerWidth <= 900) {
        isMenuVisible = !isMenuVisible;
        setMenuVisibility();
    }
};

window.addEventListener('resize', setMenuVisibility);
window.addEventListener('load', setMenuVisibility);

//ACTIVE NAV -----------------------------------------------------------------------

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

//FIND EMAIL AND PASSWORD IN AUTH ---------------------------------------------
async function findEmail(emailFromInput){
	try {
		const querySnapshot = await getDocs(usersCollection);
		const allUsers = querySnapshot.docs.map((doc)=> doc.data());
		const emailExists = allUsers.some(user => user.email === emailFromInput);
		let existingEmailPassword = null;
		if(emailExists){
			const userFromInput = allUsers.find(user => user.email === emailFromInput);
			existingEmailPassword = userFromInput.password;	
		}
		return {emailExists, existingEmailPassword};
	} catch (err){
		console.log(err.message);
		return false;
	}
}

//FIND USER FAVORITE GENRE ------------------------------------------------------

async function userFavoriteGenre(){
	try {
		const currentSignedinUser = authService.currentUser;
		const signedInUserUid = currentSignedinUser.uid;
	
		const querySnapshot = await getDocs(usersCollection);
		const allUsers = querySnapshot.docs.map((doc)=>doc.data());
		const currentUser = allUsers.find(user => user.id === signedInUserUid);
		const currentUserFavoriteGenre = currentUser.genre;
	
		return currentUserFavoriteGenre;
	} catch(err){
		console.log(err.message);
	}
}


//SIGN UP ----------------------------------------------------------------
const signUpEmail = document.querySelector('.signup-email');
const signUpPassword = document.querySelector('.signup-password');
const signUpFirstname = document.querySelector('#firstname');
const signUpLastname = document.querySelector('#lastname');
const signUpGenre = document.querySelector('#genre');
const signUpButton = document.querySelector('.sign-up-button_submit');
const signUpForm = document.querySelector('.sign-up-form');

const mainContentSection = document.querySelector('.main-content');
const formSection = document.querySelector('.form-section');

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
	signUpButton.addEventListener('click', async (e)=>{
		e.preventDefault();
		const firstnameValue = signUpFirstname.value.charAt(0).toUpperCase() + signUpFirstname.value.slice(1).toLowerCase().trim();
		const lastnameValue = signUpLastname.value.charAt(0).toUpperCase() + signUpLastname.value.slice(1).toLowerCase().trim();
		const emailValue = signUpEmail.value.toLowerCase().trim();
		
		try {
			const emailExists = await findEmail(emailValue);
			const signUpValidationStatus = validateSignUpForm(firstnameValue, lastnameValue, signUpGenre.value, emailValue, signUpPassword.value.trim(), signUpFirstnameErrorSpan, signUpLastnameErrorSpan, signUpGenreErrorSpan, signUpEmailErrorSpan, signUpPasswordErrorSpan, emailExists);

			console.log(signUpValidationStatus);
			
			if(!signUpValidationStatus){
				await signUpUser();
			} else {
				return;
			}
		} catch (err){
			console.log(err.message);
		}
	})
}

//SIGN IN ------------------------
const signInButton = document.querySelector('.sign-in-button_submit');
const signInForm = document.querySelector('.sign-in-form');

const signInUser = async ()=>{
	try {
		const userEmail = signInEmail.value.toLowerCase().trim();
		const userPassword = signInPassword.value.trim();
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
	signInButton.addEventListener('click', async (e)=>{
		e.preventDefault();
		const userEmail = signInEmail.value.toLowerCase().trim();
		const userPassword = signInPassword.value.trim();

		try {
			const {emailExists, existingEmailPassword} = await findEmail(userEmail);
	
			const signInValidationStatus = validateSignInForm(userEmail, userPassword, signInEmailErrorSpan, signInPasswordErrorSpan, emailExists, existingEmailPassword);
			console.log(signInValidationStatus);
			if(!signInValidationStatus){
				await signInUser();
			} 
		} catch (err){
			console.log(err.message);
		}
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

//USER AUTH STATE ----------------------------------------------------------------------
onAuthStateChanged(authService, (user)=>{
	if(user){
		console.log('user is logged in');
		signInDisplaySignOutButtonVisible();
		signInDisplay();
		pageNavigation();
		renderUsersOnUserProfile();
		if (pathName.includes('pages/movies') || pathName.includes('/dist/index.html')) {
			fetchMovies();
		}
		menuToggleButton.addEventListener('click', menuBarToggle);
	} else{
		console.log('user is logged out');
		signOutDisplaySignOutButtonHidden();
		signOutDisplay();
	}
})

//ADD TO FAVORITES ----------------------------------------------------------------------
const addToFavoritesContainer = document.querySelector('.add-to-favorites');

async function saveFavoriteMoviesToDatabase(movie, movieReview) {
    try {
		const querySnapshot = await getDocs(favoritesCollection);
		const existingMovies = querySnapshot.docs.map(doc => doc.data());
		const isExisting = existingMovies.some(existingMovie => existingMovie.title === movie.original_title);
		if(!isExisting){
			if(movieReview){
				const newMovie = {
					title: movie.original_title,
					rating: movie.vote_averag.toFixed(1),
					releaseDate: movie.release_date,
					img: movie.poster_path,
					overview: movie.overview,
					review: movieReview
				};	
				await addDoc(favoritesCollection, newMovie);
				console.log(`${newMovie.title} has been added to favorites`);

			} else {
				const newMovie = {
					title: movie.original_title,
					rating: movie.vote_average.toFixed(1),
					releaseDate: movie.release_date,
					img: movie.poster_path,
					overview: movie.overview
				};
				await addDoc(favoritesCollection, newMovie);
				renderFavoritesToast(newMovie.title, 'has been added to favorites');
			}
		} else {
			console.log('This movie already exists');
			renderFavoritesToast('This movie has already been added to favorites');
		}
    } catch(err) {
        console.log(err.message);
    }
}

function renderFavoritesToast(displayMovie, displayText=''){
	const addToFavoritesDisplay = document.createElement('div');
	addToFavoritesContainer.append(addToFavoritesDisplay);
	addToFavoritesDisplay.classList.add('add-to-favorites-display');
	addToFavoritesDisplay.textContent = `${displayMovie} ${displayText}`;
	setTimeout(() => {
		addToFavoritesContainer.removeChild(addToFavoritesDisplay);
	}, 2000);		
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
		const movieRating = document.createElement('p');
		const movieReview = document.createElement('span');
		const movieOverview = document.createElement('p');
		const deleteFavoriteMovie = document.createElement('button');
		const imgAndInfoContainer = document.createElement('div');


		movieTitle.textContent = movie.title;
		movieReleaseDate.textContent = `Release date: ${movie.releaseDate}`;
		movieRating.textContent = `Rating: ${movie.rating}`;
		movieOverview.textContent = movie.overview;
		movieImg.src = `https://image.tmdb.org/t/p/w500${movie.img}`;
		deleteFavoriteMovie.textContent = 'Remove from Favorites';
		movieReview.textContent = movie.review ? `User review: ${movie.review}` : '';

		movieContainer.classList.add('each-favorite-movie-container');
		imgAndInfoContainer.classList.add('favorite-img-info-container')
		infoContainer.classList.add('favorite-movie-info');
		
		favoriteMoviesContainer.append(movieContainer);
		movieContainer.append(movieTitle, imgAndInfoContainer);
		imgAndInfoContainer.append(movieImg, infoContainer);
		infoContainer.append(movieRating, movieReleaseDate, movieOverview, movieReview, deleteFavoriteMovie);

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

export {saveFavoriteMoviesToDatabase, userFavoriteGenre}