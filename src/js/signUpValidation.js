const validateSignUpForm =(firstnameInput, lastnameInput, genreInput, emailInput, passwordInput, firstnameErrorSpan, lastnameErrorSpan, genreErrorSpan, emailErrorSpan, passwordErrorSpan, emailExists)=>{
	let errors = {
		errorStatus: false,
		firstnameErrorMsg: '',
		lastnameErrorMsg: '',
		genreErrorMsg: '',
		emailErrorMsg: '',
		passwordErrorMsg: ''
	}

	if(!firstnameInput){
		errors.errorStatus = true;
		errors.firstnameErrorMsg = 'Firstname is required';
	} else {
		errors.firstnameErrorMsg = '';
	}

	if(!lastnameInput){
		errors.errorStatus = true;
		errors.lastnameErrorMsg = 'Lastname is required';
	} else {
		errors.lastnameErrorMsg = '';
	}

	if(genreInput !== 'default'){
		errors.genreErrorMsg = '';
	} else {
		errors.errorStatus = true;
		errors.genreErrorMsg = 'Genre is required';
	}

	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	if(!emailInput){
		errors.errorStatus = true;
		errors.emailErrorMsg = 'Email is required';
	} else if(!emailRegex.test(emailInput)){
		errors.errorStatus = true;
		errors.emailErrorMsg = 'Email must be an email account';
	} else if(!emailExists){
		errors.errorStatus = true;
				errors.emailErrorMsg = 'This email is already registered to a user';
	} else {
		errors.emailErrorMsg = '';
	}
	
	const forbiddenSymbolsPattern = /[<|$\-%#@*?!^()[\]{}=;'",.:\\\s]/;
    
	if(passwordInput){
		if(passwordInput.length >= 6){
			if(!forbiddenSymbolsPattern.test(passwordInput)){
				errors.passwordErrorMsg = '';
			} else {
				errors.errorStatus = true;
				errors.passwordErrorMsg = "Password cannot contain the following symbols: < | $ \\ - % # @ * ? ! ^ ( ) [ ] { } = ; ' \" , . :";
			}
		} else {
			errors.errorStatus = true;
			errors.passwordErrorMsg = 'Password must be at least 6 characters';
		}
	} else {
		errors.errorStatus = true;
		errors.passwordErrorMsg = 'Password is required';
	}

	firstnameErrorSpan.textContent = errors.firstnameErrorMsg;
	lastnameErrorSpan.textContent = errors.lastnameErrorMsg;
	genreErrorSpan.textContent = errors.genreErrorMsg;
	emailErrorSpan.textContent = errors.emailErrorMsg;
	passwordErrorSpan.textContent = errors.passwordErrorMsg;

	const signUpValidationStatus = errors.errorStatus;

	return signUpValidationStatus;
}

export {validateSignUpForm}