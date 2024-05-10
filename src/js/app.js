import firebaseConfig from "./firebaseConfig";
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {collection, getFirestore} from 'firebase/firestore';

//INITIALIZE FIREBASE AUTH/FIRESTORE ------------------------
initializeApp(firebaseConfig);
const authService = getAuth();
const database = getFirestore();

//SIGN UP ------------------------
const signUpEmail = document.querySelector('.signup-email');
const signUpPassword = document.querySelector('.signup-password');
const signUpFirstname = document.querySelector('#firstname');
const signUpLastname = document.querySelector('#lastname');
const signUpButton = document.querySelector('.sign-up-button_submit');
const signUpForm = document.querySelector('.sign-up-form');

const mainContentSection = document.querySelector('.main-content');
const formSection = document.querySelector('.form-section');
const signOutButton = document.querySelector('.sign-out-button');
	
const users = [];
let isLoggedIn = false;

const signUpUser =()=>{
	let newUser = {
		firstname: signUpFirstname.value.toLowerCase().trim(),
		lastname: signUpLastname.value.toLowerCase().trim(),
		email: signUpEmail.value.toLowerCase().trim(),
		password: signUpPassword.value.trim()
	}
	createUserWithEmailAndPassword(authService, newUser.email, newUser.password)
	.then((userCredential)=>{
		console.log('The user has successfully signed up');
		newUser = {...newUser, id: userCredential.user.uid}
		users.push(newUser);
		console.log(users);

		renderUserName(newUser.firstname, newUser.lastname);
		isLoggedIn = true;
		changingStyleDispaly(signUpForm);
	}).catch(err => console.log(err.message));
};

signUpButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signUpUser();
})

//SIGN IN ------------------------
const signInEmail = document.querySelector('.signin-email');
const signInPassword = document.querySelector('.signin-password');
const signInButton = document.querySelector('.sign-in-button_submit');
const signInForm = document.querySelector('.sign-in-form');

const signInUser =()=>{
	const userEmail = signInEmail.value.toLowerCase().trim();
	const userPassword = signInPassword.value.trim();
	signInWithEmailAndPassword(authService, userEmail, userPassword)
	.then((userCredential)=>{
		console.log('The user has successfully signed in');
		const signedInUserID = userCredential.user.uid;
		const userFromArray = users.find(user => user.id === signedInUserID);
		if(userFromArray){
			renderUserName(userFromArray.firstname, userFromArray.lastname);
		}
		isLoggedIn = true;
		changingStyleDispaly(signInForm);
	}).catch(err => console.log(err.message));
};

signInButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signInUser();
})

//SIGN OUT ------------------------
const signInFormVisibility = document.querySelector('.signin-form_visibility');
const signUpFormVisibility = document.querySelector('.signup-form_visibility');


const signOutUser =()=>{
	signOut(authService)
	.then(()=>{
		console.log('The user has succsessfully signed out');
		isLoggedIn = false;
		changingStyleDispaly();
	}).catch(err => console.log(err.message));
};

signOutButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signOutUser();
})

//RENDER USER NAME ON FRONTPAGE ----------------------------------
const userNameElement = document.createElement('h1');

function renderUserName(firstname, lastname){
	userNameElement.classList.add('render-username');
	userNameElement.textContent = `Welcome ${firstname} ${lastname}`;
	mainContentSection.append(userNameElement);
}

//CHANGING DISPLAY BLOCK/NONE ------------------------------------------
function changingStyleDispaly(form) {
	if(isLoggedIn){
		form.reset();
		mainContentSection.style.display = 'block';
		formSection.style.display = 'none';
		signOutButton.style.display = 'block';
	} else {
		mainContentSection.style.display = 'none';
		formSection.style.display = 'block';

		signInFormVisibility.style.display = 'block';
		signUpFormVisibility.style.display = 'none';

		signOutButton.style.display = 'none';
		userNameElement.textContent = '';
	}
}

//TOGGLE SIGN IN/SIGN UP -----------------------------------------------

const signInToggle = document.querySelector('.signin-form_button');
const signUpToggle = document.querySelector('.signup-form_button');

function toggleFormVisibility(formVisible, formHidden){
	formVisible.style.display = 'block';
	formHidden.style.display = 'none';
};

signInToggle.addEventListener('click', (e)=>{
	e.preventDefault();
	toggleFormVisibility(signInFormVisibility, signUpFormVisibility);
});

signUpToggle.addEventListener('click', (e)=>{
	e.preventDefault();
	toggleFormVisibility(signUpFormVisibility, signInFormVisibility);
});

//ACCESS USERS IN FIRESTORE

const usersCollection = collection(database, 'users');
