document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordWarning = document.getElementById('passwordWarning');
    const emailInput = document.getElementById('email');

    // Password validation function
    function validatePassword(password) {
        const minLength = 8;
        const hasCapital = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const hasMinLength = password.length >= minLength;

        return {
            isValid: hasMinLength && hasCapital && hasSymbol,
            hasMinLength,
            hasCapital,
            hasSymbol
        };
    }

    // Show password warning
    function showPasswordWarning() {
        passwordWarning.style.display = 'flex';
        passwordInput.style.borderColor = '#feb2b2';
        passwordInput.parentElement.style.borderColor = '#feb2b2';
    }

    // Hide password warning
    function hidePasswordWarning() {
        passwordWarning.style.display = 'none';
        passwordInput.style.borderColor = '';
        passwordInput.parentElement.style.borderColor = '';
    }

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const validation = validatePassword(password);

        if (password.length > 0 && !validation.isValid) {
            showPasswordWarning();
        } else {
            hidePasswordWarning();
        }
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;

        if (confirmPassword.length > 0 && password !== confirmPassword) {
            this.style.borderColor = '#feb2b2';
            this.parentElement.style.borderColor = '#feb2b2';
        } else {
            this.style.borderColor = '';
            this.parentElement.style.borderColor = '';
        }
    });

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const validation = validatePassword(password);

        // Clear previous error states
        hidePasswordWarning();
        passwordInput.style.borderColor = '';
        passwordInput.parentElement.style.borderColor = '';
        confirmPasswordInput.style.borderColor = '';
        confirmPasswordInput.parentElement.style.borderColor = '';

        let hasErrors = false;

        // Email validation
        if (!email) {
            emailInput.style.borderColor = '#feb2b2';
            emailInput.parentElement.style.borderColor = '#feb2b2';
            hasErrors = true;
        } else {
            emailInput.style.borderColor = '';
            emailInput.parentElement.style.borderColor = '';
        }

        // Password validation
        if (!validation.isValid) {
            showPasswordWarning();
            hasErrors = true;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#feb2b2';
            confirmPasswordInput.parentElement.style.borderColor = '#feb2b2';
            hasErrors = true;
        }

        if (!hasErrors) {
            // Show success message
            showSuccessMessage();
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    });

    // Success message function
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>Account created successfully! Redirecting to login...</span>
        `;
        
        // Add success message styles
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #68d391;
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(104, 211, 145, 0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
            style.remove();
        }, 3000);
    }

    // Google signup button
    const googleSignupBtn = document.querySelector('.btn-google');
    googleSignupBtn.addEventListener('click', function() {
        // Simulate Google signup
        showSuccessMessage();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality would be implemented here.');
    });
});