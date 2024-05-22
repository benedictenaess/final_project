const validateSignInForm = (emailInput, passwordInput, emailErrorSpan, passwordErrorSpan, emailExists, userPassword) => {
	let errors = {
		errorStatus: false,
	  	emailErrorMsg: '',
	  	passwordErrorMsg: ''
	};
  
	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	if (!emailInput) {
	  	errors.errorStatus = true;
	  	errors.emailErrorMsg = 'Email is required';
	} else if (!emailRegex.test(emailInput)) {
		errors.errorStatus = true;
	  	errors.emailErrorMsg = 'Email must be a valid email';
	} else if (!emailExists) {
		errors.errorStatus = true;
	  	errors.emailErrorMsg = 'This email is not registered to a user';
	} else {
		errors.emailErrorMsg = '';
	}
  
	if (!passwordInput) {
	  	errors.errorStatus = true;
	  	errors.passwordErrorMsg = 'Password is required';
	} else if (passwordInput.length < 6) {
	  	errors.errorStatus = true;
	  	errors.passwordErrorMsg = 'Password must be at least 6 characters';
	} else if (userPassword !== null && passwordInput !== userPassword) {
        errors.errorStatus = true;
        errors.passwordErrorMsg = 'The password is incorrect';
	} else {
		errors.passwordErrorMsg = '';
	}
  
	emailErrorSpan.textContent = errors.emailErrorMsg;
	passwordErrorSpan.textContent = errors.passwordErrorMsg;
  
	return errors.errorStatus;
};
  
export { validateSignInForm };