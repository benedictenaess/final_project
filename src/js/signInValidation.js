const validateSignInForm = (emailInput, passwordInput, emailErrorSpan, passwordErrorSpan, emailExists) => {
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
	}
  
	if (!passwordInput) {
	  	errors.errorStatus = true;
	  	errors.passwordErrorMsg = 'Password is required';
	} else if (passwordInput.length < 6) {
	  	errors.errorStatus = true;
	  	errors.passwordErrorMsg = 'Password must be at least 6 characters';
	}
  
	emailErrorSpan.textContent = errors.emailErrorMsg;
	passwordErrorSpan.textContent = errors.passwordErrorMsg;
  
	return errors.errorStatus;
};
  
export { validateSignInForm };