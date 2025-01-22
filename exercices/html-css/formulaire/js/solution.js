// Validation du formulaire
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    validateForm();
});

// Validation en temps réel des champs
const inputs = document.querySelectorAll('.form-group input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.id === 'password') {
            updatePasswordStrength(this.value);
        } else {
            validateField(this);
        }
    });
});

// Gestion du bouton afficher/masquer mot de passe
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    validateField(name);
    validateField(email);
    updatePasswordStrength(password.value);
}

function validateField(input) {
    switch(input.id) {
        case 'name':
            if (input.value.trim() === '') {
                setError(input, 'Le nom est requis');
            } else if (input.value.trim().length < 3) {
                setError(input, 'Le nom doit contenir au moins 3 caractères');
            } else {
                setSuccess(input);
            }
            break;
        case 'email':
            if (!isValidEmail(input.value)) {
                setError(input, 'Email invalide');
            } else {
                setSuccess(input);
            }
            break;
    }
}

function setError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.className = 'form-group error';
    const validation = formGroup.querySelector('.validation-message');
    validation.textContent = message;
}

function setSuccess(input) {
    const formGroup = input.closest('.form-group');
    formGroup.className = 'form-group valid';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    let strength = 0;
    
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.length >= 8) strength++;

    strengthBar.className = 'strength-bar ' + 
        (strength <= 2 ? 'weak' : strength === 3 ? 'medium' : 'strong');
} 