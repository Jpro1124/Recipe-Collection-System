document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Clear previous error states
        emailInput.style.borderColor = '';
        emailInput.parentElement.style.borderColor = '';
        passwordInput.style.borderColor = '';
        passwordInput.parentElement.style.borderColor = '';

        let hasErrors = false;

        // Email validation
        if (!email) {
            emailInput.style.borderColor = '#feb2b2';
            emailInput.parentElement.style.borderColor = '#feb2b2';
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            emailInput.style.borderColor = '#feb2b2';
            emailInput.parentElement.style.borderColor = '#feb2b2';
            hasErrors = true;
        }

        // Password validation
        if (!password) {
            passwordInput.style.borderColor = '#feb2b2';
            passwordInput.parentElement.style.borderColor = '#feb2b2';
            hasErrors = true;
        }

        if (!hasErrors) {
            // Simulate login process
            showLoadingState();
            
            // Simulate API call delay
            setTimeout(() => {
                hideLoadingState();
                showSuccessMessage();
                
                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('userEmail', email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('userEmail');
                }
                
                // Redirect to dashboard or main page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html'; // You can change this to your main page
                }, 2000);
            }, 1500);
        }
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show loading state
    function showLoadingState() {
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
            </svg>
            Logging in...
        `;
        
        // Add spinning animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Hide loading state
    function hideLoadingState() {
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
    }

    // Success message function
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            <span>Login successful! Welcome back!</span>
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

    // Google login button
    const googleLoginBtn = document.querySelector('.btn-google');
    googleLoginBtn.addEventListener('click', function() {
        // Simulate Google login
        showLoadingState();
        
        setTimeout(() => {
            hideLoadingState();
            showSuccessMessage();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    });

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = prompt('Please enter your email address to reset your password:');
        if (email && isValidEmail(email)) {
            alert('Password reset instructions have been sent to your email address.');
        } else if (email) {
            alert('Please enter a valid email address.');
        }
    });

    // Check if user should be remembered
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberMeCheckbox.checked = true;
        }
    }

    // Add input focus effects
    const inputContainers = document.querySelectorAll('.input-container');
    inputContainers.forEach(container => {
        const input = container.querySelector('input');
        
        input.addEventListener('focus', function() {
            container.style.borderColor = '#68d391';
            container.style.boxShadow = '0 0 0 3px rgba(104, 211, 145, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                container.style.borderColor = '';
                container.style.boxShadow = '';
            }
        });
    });
});