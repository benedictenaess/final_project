import firebaseConfig from "./firebaseConfig";
import {initializeApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {collection, getFirestore, addDoc, getDocs} from 'firebase/firestore';

//INITIALIZE FIREBASE AUTH/FIRESTORE ------------------------
initializeApp(firebaseConfig);
const authService = getAuth();
const database = getFirestore();
const usersCollection = collection(database, 'users');

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

// const users = [];
let isLoggedIn = false;

const signUpUser = async ()=>{
	let newUser = {
		firstname: signUpFirstname.value.toLowerCase().trim(),
		lastname: signUpLastname.value.toLowerCase().trim(),
		genre: signUpGenre.value,
		email: signUpEmail.value.toLowerCase().trim(),
		password: signUpPassword.value.trim()
	}
	try {
		const userCredential = await createUserWithEmailAndPassword(authService, newUser.email, newUser.password);
		console.log('The user has successfully signed up');
		newUser = {...newUser, id: userCredential.user.uid};
		// users.push(newUser);
		renderUserName(newUser.firstname, newUser.lastname);
		// isLoggedIn = true;
		// changeStyleDispaly(signUpForm);
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

signUpButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signUpUser();
})

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

		// isLoggedIn = true;
		// changeStyleDispaly(signInForm);
	} catch (err) {
			console.log(err.message)
	}
};

signInButton.addEventListener('click', (e)=>{
	e.preventDefault();
	signInUser();
})

//SIGN OUT ------------------------
const signInFormVisibility = document.querySelector('.signin-form_visibility');
const signUpFormVisibility = document.querySelector('.signup-form_visibility');


const signOutUser = async ()=>{
	try {
		signOut(authService)
		console.log('The user has succsessfully signed out');
		// isLoggedIn = false;
		// changeStyleDispaly();
	} catch (err) {
		console.log(err.message)
	}
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

//CHANGING DISPLAY SINGIN/OUT ------------------------------------------
// function changeStyleDispaly(form) {
// 	if(isLoggedIn){
// 		form.reset();
// 		mainContentSection.style.display = 'block';
// 		formSection.style.display = 'none';
// 		signOutButton.style.display = 'block';
// 	} else {
// 		mainContentSection.style.display = 'none';
// 		formSection.style.display = 'block';

// 		signInFormVisibility.style.display = 'block';
// 		signUpFormVisibility.style.display = 'none';

// 		signOutButton.style.display = 'none';
// 		userNameElement.textContent = '';
// 	}
// }

function signInDisplay(){
	signInForm.reset();
	signUpForm.reset();
	mainContentSection.style.display = 'block';
	formSection.style.display = 'none';
	signOutButton.style.display = 'block';
}

function signOutDisplay(){
	mainContentSection.style.display = 'none';
	formSection.style.display = 'block';

	signInFormVisibility.style.display = 'block';
	signUpFormVisibility.style.display = 'none';

	signOutButton.style.display = 'none';
	userNameElement.textContent = '';
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

onAuthStateChanged(authService, (user)=>{
	if(user){
		signInDisplay()
	} else{
		signOutDisplay()
	}
})
