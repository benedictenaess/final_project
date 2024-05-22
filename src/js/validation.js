const validateSignInForm =(emailInput, passwordInput, emailErrorSpan, passwordErrorSpan)=>{
	let errors = {
		singInErrorStatus: false,
		emailErrorMsg: '',
		passwordErrorMsg: ''
	}
	 
	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	if(emailInput){
		if(emailRegex.test(emailInput)){
			errors = {
				singInErrorStatus: false,
				emailErrorMsg: ''
			}
			emailErrorSpan.textContent = errors.emailErrorMsg;

		} else {
			errors = {
				singInErrorStatus: true,
				emailErrorMsg: 'Email must be an email'
			}
			emailErrorSpan.textContent = errors.emailErrorMsg;
		}
	} else {
		errors = {
			singInErrorStatus: true,
			emailErrorMsg: 'Email is required'
		}
		emailErrorSpan.textContent = errors.emailErrorMsg;
	}
	
	if(passwordInput){
		if(passwordInput.length >= 6){
			errors = {
				singInErrorStatus: false,
				passwordErrorMsg: ''
			}
			passwordErrorSpan.textContent = errors.passwordErrorMsg;
		} else {
			errors = {
				singInErrorStatus: true,
				passwordErrorMsg: 'Password is too short'
			}
			passwordErrorSpan.textContent = errors.passwordErrorMsg;
		}
	} else {
		errors = {
			singInErrorStatus: true,
			passwordErrorMsg: 'Password is required'
		}
		passwordErrorSpan.textContent = errors.passwordErrorMsg;
	}

	const signinValidationStatus =()=>{
		return errors.singInErrorStatus;
	}
	return {signinValidationStatus};
}

export {validateSignInForm}