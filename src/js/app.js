import firebaseConfig from "./firebaseConfig";
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {collection, getFirestore, addDoc, getDocs, deleteDoc, doc, setDoc} from 'firebase/firestore';
import {fetchMovies} from './fetchMovies';
import { validateSignInForm } from "./signInValidation";
import {validateSignUpForm} from './signUpValidation';

const pathName = window.location.pathname;

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

//HAMBURGER MENU -----------------------------------------------------------------------------
const menuToggleButton = document.querySelector('.hamburger-button');
const homeNavButton = document.querySelector('.home-nav');
const favoritesNavButton = document.querySelector('.favorites-nav');
const profileNavButton = document.querySelector('.profile-nav');
const signOutButton = document.querySelector('.sign-out-button');

let isMenuVisible = false;

const setMenuVisibility = () => {
    if (window.innerWidth > 900) {
        homeNavButton.style.display = 'block';
        favoritesNavButton.style.display = 'block';
        profileNavButton.style.display = 'block';
        signOutButton.style.display = 'block';
    } else {
        if (isMenuVisible) {
            homeNavButton.style.display = 'block';
            favoritesNavButton.style.display = 'block';
            profileNavButton.style.display = 'block';
            signOutButton.style.display = 'block';
        } else {
            homeNavButton.style.display = 'none';
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
	});
	
	favoritesNavButton.addEventListener('click',(e)=>{
		e.preventDefault();
		window.location.pathname = '/src/pages/favorites.html';
	});
	
	profileNavButton.addEventListener('click',(e)=>{
		e.preventDefault();
		window.location.pathname = '/src/pages/userProfile.html';
	});
};

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
		const errorMsgContainer = document.querySelector('.main-content');
		errorMsgContainer.textContent = 'Try to reload the page';
		errorMsgContainer.classList.add('catch-error-style');
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
		newUser = {...newUser, id: userCredential.user.uid};
		renderUserName(newUser.firstname, newUser.lastname);
		try {
			await addDoc(usersCollection, newUser)
		} catch (createUserError) {
			const errorMsgContainer = document.querySelector('.error-sign-up');
			errorMsgContainer.textContent = 'Unexpected error signing up';
			errorMsgContainer.classList.add('catch-error-style');
		}
	} catch (authError){
		const errorMsgContainer = document.querySelector('.error-sign-up');
		errorMsgContainer.textContent = 'Unexpected error signing up';
		errorMsgContainer.classList.add('catch-error-style');
	} 
};

if(signUpButton){
	signUpButton.addEventListener('click', async (e)=>{
		e.preventDefault();
		const firstnameValue = signUpFirstname.value.charAt(0).toUpperCase() + signUpFirstname.value.slice(1).toLowerCase().trim();
		const lastnameValue = signUpLastname.value.charAt(0).toUpperCase() + signUpLastname.value.slice(1).toLowerCase().trim();
		const emailValue = signUpEmail.value.toLowerCase().trim();
		
		try {
			const signUpValidationStatus = validateSignUpForm(firstnameValue, lastnameValue, signUpGenre.value, emailValue, signUpPassword.value.trim(), signUpFirstnameErrorSpan, signUpLastnameErrorSpan, signUpGenreErrorSpan, signUpEmailErrorSpan, signUpPasswordErrorSpan);
			if(!signUpValidationStatus){
				await signUpUser();
			} else {
				return;
			}
		} catch (err){
			const errorMsgContainer = document.querySelector('.error-sign-up');
			errorMsgContainer.textContent = 'Unexpected error signing up';
			errorMsgContainer.classList.add('catch-error-style');
		}
	})
}

//SIGN IN ----------------------------------------------------------------------------------------
const signInButton = document.querySelector('.sign-in-button_submit');
const signInForm = document.querySelector('.sign-in-form');

const signInUser = async ()=>{
	try {
		const userEmail = signInEmail.value.toLowerCase().trim();
		const userPassword = signInPassword.value.trim();
		const userCredential = await signInWithEmailAndPassword(authService, userEmail, userPassword);
		
		const signedInUserID = userCredential.user.uid;
		const querySnapshot = await getDocs(usersCollection);
		const allUsers = querySnapshot.docs.map((doc)=> doc.data());
		const signedInUser = allUsers.find((user)=> user.id === signedInUserID);
		renderUserName(signedInUser.firstname, signedInUser.lastname);
	} catch (err) {
		const errorMsgContainer = document.querySelector('.error-sign-in');
		errorMsgContainer.textContent = 'Unexpected error signing in';
		errorMsgContainer.classList.add('catch-error-style');
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
			if(!signInValidationStatus){
				await signInUser();
			} 
		} catch (err){
			const errorMsgContainer = document.querySelector('.error-sign-in');
			errorMsgContainer.textContent = 'Unexpected error signing in';
			errorMsgContainer.classList.add('catch-error-style');
		}
	})
}

//SIGN OUT ------------------------------------------------------------------------------------
const signInFormVisibility = document.querySelector('.signin-form_visibility');
const signUpFormVisibility = document.querySelector('.signup-form_visibility');

const signOutUser = async ()=>{
	try {
		signOut(authService);
	} catch (err) {
		const errorMsgContainer = document.querySelector('.main-content');
		errorMsgContainer.textContent = 'Unexpected error logging out';
		errorMsgContainer.classList.add('catch-error-style');
	}
};

signOutButton.addEventListener('click', (e)=>{
	e.preventDefault();
	window.location.href = '/dist/index.html';
	signOutUser();
})

//RENDER USERS ----------------------------------------------------------------------------------
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
		const errorMsgContainer = document.querySelector('.user-container');
		errorMsgContainer.textContent = 'Unexpected error loading page';
		errorMsgContainer.classList.add('catch-error-style');

	}
}

//DELETE AUTH AND FIRESTORE ------------------------------------------------------------------
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
			signOutDisplay();
		}
	} catch(err){
		const errorMsgContainer = document.querySelector('.main-section-userprofile');
		errorMsgContainer.textContent = 'Unexpected error deleting account';
		errorMsgContainer.classList.add('catch-error-style');
	}
}

//CHANGING DISPLAY SINGIN/OUT ------------------------------------------
const movieSection = document.querySelector('.find-movie-section');
const headerSection = document.querySelector('.menu-bar');
const frontpageInfo = document.querySelector('.frontpage-signin-info');

function signInDisplay(){
	if(window.location.pathname === '/dist/index.html'){
		signInForm.reset();
		signUpForm.reset();
		mainContentSection.style.display = 'block';
		headerSection.style.display = 'flex';
		movieSection.style.display = 'block';
		formSection.style.display = 'none';
		frontpageInfo.style.display = 'none';
	}
}

function signOutDisplay(){
	if(window.location.pathname === '/dist/index.html'){
		mainContentSection.style.display = 'none';
		headerSection.style.display = 'none';
		movieSection.style.display = 'none';
		formSection.style.display = 'block';
		signInFormVisibility.style.display = 'block';
		frontpageInfo.style.display = 'block';
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

//TOGGLE SIGN IN/SIGN UP -------------------------------------------------------------
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
		signInDisplaySignOutButtonVisible();
		signInDisplay();
		pageNavigation();
		renderUsersOnUserProfile();
		fetchMovies();
		menuToggleButton.addEventListener('click', menuBarToggle);
		if(pathName.includes('favorites')){
			displayFavorites();
		}
	} else{
		signOutDisplaySignOutButtonHidden();
		signOutDisplay();
	}
})

//ADD TO FAVORITES ----------------------------------------------------------------------
const addToFavoritesContainer = document.querySelector('.add-to-favorites');

async function createFavoritesCollectionAndAddMovieToFavorites(movie, movieReview){
	try {
		const currentSignedinUseronAuth = authService.currentUser;
		const signedInUserUid = currentSignedinUseronAuth.uid;

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
		const userDocRef = userInfoFromDatabase.uniqueId;

		const currentUserDatabase = doc(database, 'users', userDocRef);
		const favoritesCollectionRef = collection(currentUserDatabase, 'favorites');
		

		const querySnapshot2 = await getDocs(favoritesCollectionRef);
		const favoriteMoviesInDatabase = querySnapshot2.docs.map(doc => doc.data());
        const movieAlreadyExists = favoriteMoviesInDatabase.some(existingMovie => existingMovie.title === movie.original_title);

		if(!movieAlreadyExists){
			const favoriteMovie = {
				title: movie.original_title,
				rating: movie.vote_average.toFixed(1),
				releaseDate: movie.release_date,
				img: movie.poster_path,
				overview: movie.overview,
				review: movieReview ? movieReview : ''
			}
			await addDoc(favoritesCollectionRef, favoriteMovie);
			renderFavoritesToast(favoriteMovie.title, 'has been added to favorites');
		} else {
			renderFavoritesToast('This movie has already been added to favorites');
		}

	} catch(err){
		const errorMsgContainer = document.querySelector('.main-content');
		errorMsgContainer.textContent = 'Unexpected error adding movie to favorites';
		errorMsgContainer.classList.add('catch-error-style');
	}
}

//RENDER TOAST FOR ADDING FAVORITE MOVIE ----------------------------------------------------------
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
		const currentSignedinUseronAuth = authService.currentUser;
		const signedInUserUid = currentSignedinUseronAuth.uid;

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
		const userDocRef = userInfoFromDatabase.uniqueId;

		const currentUserDatabase = doc(database, 'users', userDocRef);
		const favoritesCollectionRef = collection(currentUserDatabase, 'favorites');
		const querySnapshot2 = await getDocs(favoritesCollectionRef); 
		const favoriteMovies = querySnapshot2.docs.map(doc => doc.data());

		if(favoriteMovies.length === 0){
			favoriteMoviesContainer.textContent = 'You have not added any movies to favorites. Go to the home page an add your first movie!';
		} else {
			favoriteMovies.forEach(movie => {
				renderFavoriteMovies(movie);
			});
		}

    } catch (err) {
		const errorMsgContainer = document.querySelector('.favorite-movies-container');
		errorMsgContainer.textContent = 'Try to reload the page';
		errorMsgContainer.classList.add('catch-error-style');
	}
}

function renderFavoriteMovies(movie){
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
			const removeContainer = e.target.parentElement.parentElement.parentElement;
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
		const currentSignedinUseronAuth = authService.currentUser;
		const signedInUserUid = currentSignedinUseronAuth.uid;
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
		const userDocRef = userInfoFromDatabase.uniqueId;

		const currentUserDatabase = doc(database, 'users', userDocRef);
		const favoritesCollectionRef = collection(currentUserDatabase, 'favorites');

		let docId = [];

        const querySnapshot2 = await getDocs(favoritesCollectionRef);
        for (const doc of querySnapshot2.docs) {
            const favoriteMovie = doc.data();
			if (favoriteMovie.title === movie.title) {
				docId.push(doc.id);
			}
        }
		const docToDelete = docId[0];
		await deleteDoc(doc(favoritesCollectionRef, docToDelete));
    } catch (err){
		const errorMsgContainer = document.querySelector('.favorite-movies-container');
		errorMsgContainer.textContent = 'Try to reload the page';
		errorMsgContainer.classList.add('catch-error-style');
    }
}


export {userFavoriteGenre, createFavoritesCollectionAndAddMovieToFavorites}