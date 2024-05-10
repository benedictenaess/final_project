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
function signInDisplay(){
	signInForm.reset();
	signUpForm.reset();
	mainContentSection.style.display = 'block';
	formSection.style.display = 'none';
	signOutButton.style.visibility = 'visible';
}

function signOutDisplay(){
	mainContentSection.style.display = 'none';
	formSection.style.display = 'block';
	signInFormVisibility.style.display = 'block';
	signUpFormVisibility.style.display = 'none';
	signOutButton.style.visibility = 'hidden';
	userNameElement.textContent = '';
}

//TOGGLE SIGN IN/SIGN UP -----------------------------------------------

const signInToggle = document.querySelector('.signin-form_button');
const signUpToggle = document.querySelector('.signup-form_button');

function toggleFormVisibility(formVisible, formHidden, buttonActive, buttonInactive){
	formVisible.style.display = 'block';
	formHidden.style.display = 'none';
	buttonActive.style.backgroundColor = 'var(--color-accent-1)';
	buttonActive.style.color = 'var(--color-secondary)';
	buttonInactive.style.backgroundColor = 'var(--color-accent-2)';
	buttonInactive.style.color = 'var(--color-primary)';
};

signInToggle.addEventListener('click', (e)=>{
	e.preventDefault();
	toggleFormVisibility(signInFormVisibility, signUpFormVisibility, signInToggle, signUpToggle);
});

signUpToggle.addEventListener('click', (e)=>{
	e.preventDefault();
	toggleFormVisibility(signUpFormVisibility, signInFormVisibility, signUpToggle, signInToggle);
});

onAuthStateChanged(authService, (user)=>{
	if(user){
		signInDisplay()
	} else{
		signOutDisplay()
	}
})
