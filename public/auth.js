class AuthManager {
    constructor() {
        this.currentMode = 'login'; // login, register, forgot
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkUrlParams();
    }
    
    bindEvents() {
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => this.handleForgotPassword(e));
        
        // Mode switching
        document.getElementById('authSwitchLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchMode();
        });
        
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPassword();
        });
        
        document.getElementById('backToLoginBtn').addEventListener('click', () => {
            this.showLogin();
        });
    }
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const error = urlParams.get('error');
        const token = urlParams.get('token');
        
        if (mode === 'register') {
            this.showRegister();
        } else if (mode === 'forgot') {
            this.showForgotPassword();
        }
        
        if (error) {
            this.showError(this.getErrorMessage(error));
        }
        
        if (token) {
            // Handle OAuth success
            localStorage.setItem('authToken', token);
            this.showSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        }
    }
    
    getErrorMessage(error) {
        const errorMessages = {
            'oauth_failed': 'Google authentication failed. Please try again.',
            'invalid_token': 'Invalid or expired token. Please try again.',
            'email_not_verified': 'Please verify your email address before logging in.'
        };
        
        return errorMessages[error] || 'An error occurred. Please try again.';
    }
    
    switchMode() {
        if (this.currentMode === 'login') {
            this.showRegister();
        } else {
            this.showLogin();
        }
    }
    
    showLogin() {
        this.currentMode = 'login';
        document.getElementById('authTitle').textContent = 'Welcome Back';
        document.getElementById('authSubtitle').textContent = 'Sign in to your account to continue';
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('forgotPasswordForm').classList.add('hidden');
        document.getElementById('authSwitchText').innerHTML = 'Don\'t have an account? <a href="#" id="authSwitchLink">Sign up</a>';
        this.rebindSwitchEvent();
    }
    
    showRegister() {
        this.currentMode = 'register';
        document.getElementById('authTitle').textContent = 'Create Account';
        document.getElementById('authSubtitle').textContent = 'Join thousands of users humanizing AI text';
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('forgotPasswordForm').classList.add('hidden');
        document.getElementById('authSwitchText').innerHTML = 'Already have an account? <a href="#" id="authSwitchLink">Sign in</a>';
        this.rebindSwitchEvent();
    }
    
    showForgotPassword() {
        this.currentMode = 'forgot';
        document.getElementById('authTitle').textContent = 'Reset Password';
        document.getElementById('authSubtitle').textContent = 'Enter your email to receive a reset link';
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('forgotPasswordForm').classList.remove('hidden');
        document.getElementById('authSwitchText').innerHTML = '';
    }
    
    rebindSwitchEvent() {
        const switchLink = document.getElementById('authSwitchLink');
        if (switchLink) {
            switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchMode();
            });
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('loginBtn');
        
        this.setLoading(btn, true);
        this.hideMessages();
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                this.showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setLoading(btn, false);
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const btn = document.getElementById('registerBtn');
        
        this.setLoading(btn, true);
        this.hideMessages();
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                
                this.showSuccess('Account created successfully! Please check your email for verification.');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setLoading(btn, false);
        }
    }
    
    async handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        const btn = document.getElementById('forgotBtn');
        
        this.setLoading(btn, true);
        this.hideMessages();
        
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSuccess('Password reset email sent! Check your inbox.');
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.setLoading(btn, false);
        }
    }
    
    setLoading(btn, loading) {
        if (loading) {
            btn.disabled = true;
            btn.textContent = 'Loading...';
            btn.classList.add('loading');
        } else {
            btn.disabled = false;
            btn.classList.remove('loading');
            
            // Restore original text
            if (btn.id === 'loginBtn') btn.textContent = 'Sign In';
            else if (btn.id === 'registerBtn') btn.textContent = 'Create Account';
            else if (btn.id === 'forgotBtn') btn.textContent = 'Send Reset Link';
        }
    }
    
    showError(message) {
        const errorEl = document.getElementById('errorMessage');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorEl.classList.add('hidden');
        }, 5000);
    }
    
    showSuccess(message) {
        const successEl = document.getElementById('successMessage');
        successEl.textContent = message;
        successEl.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            successEl.classList.add('hidden');
        }, 5000);
    }
    
    hideMessages() {
        document.getElementById('errorMessage').classList.add('hidden');
        document.getElementById('successMessage').classList.add('hidden');
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});