// Login page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    // Password toggle functionality
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!username || !password) {
                MedTechUtils.showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate login process
            const loginBtn = loginForm.querySelector('.login-btn');
            const originalText = loginBtn.textContent;
            
            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                MedTechUtils.showNotification('Login successful!', 'success');
                
                // Redirect to homepage after successful login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 2000);
        });
    }
});

// Social login functions
function loginWithGoogle() {
    MedTechUtils.showNotification('Google login would be implemented here', 'info');
    
    // Simulate Google login
    setTimeout(() => {
        MedTechUtils.showNotification('Google login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

function loginWithFacebook() {
    MedTechUtils.showNotification('Facebook login would be implemented here', 'info');
    
    // Simulate Facebook login
    setTimeout(() => {
        MedTechUtils.showNotification('Facebook login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// Form validation
function validateForm() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    
    let isValid = true;
    
    // Username validation
    if (!username.value.trim()) {
        showFieldError(username, 'Username is required');
        isValid = false;
    } else {
        clearFieldError(username);
    }
    
    // Password validation
    if (!password.value) {
        showFieldError(password, 'Password is required');
        isValid = false;
    } else if (password.value.length < 6) {
        showFieldError(password, 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearFieldError(password);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Add field error styles
const fieldErrorStyles = `
    .field-error {
        color: #EF4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .input-container.error input {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = fieldErrorStyles;
document.head.appendChild(styleSheet);
