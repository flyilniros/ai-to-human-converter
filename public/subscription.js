class SubscriptionManager {
    constructor() {
        this.stripe = Stripe('pk_test_your-stripe-publishable-key'); // Replace with actual key
        this.user = null;
        this.subscriptionData = null;
        this.init();
    }
    
    async init() {
        await this.checkAuth();
        await this.loadSubscriptionData();
        this.bindEvents();
        this.updateUI();
    }
    
    async checkAuth() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/auth.html';
            return;
        }
        
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.user = data.data.user;
            } else {
                localStorage.removeItem('authToken');
                window.location.href = '/auth.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/auth.html';
        }
    }
    
    async loadSubscriptionData() {
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch('/api/subscription/status', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.subscriptionData = data.data;
            }
        } catch (error) {
            console.error('Failed to load subscription data:', error);
        }
    }
    
    bindEvents() {
        document.getElementById('premiumButton').addEventListener('click', () => this.handleUpgrade());
        document.getElementById('cancelButton').addEventListener('click', () => this.handleCancel());
        document.getElementById('reactivateButton').addEventListener('click', () => this.handleReactivate());
    }
    
    updateUI() {
        if (!this.subscriptionData) return;
        
        const { subscription, usage } = this.subscriptionData;
        
        // Update usage statistics
        document.getElementById('dailyUsage').textContent = usage.dailyWordsUsed;
        document.getElementById('remainingUsage').textContent = 
            usage.remainingWords === 'unlimited' ? '∞' : usage.remainingWords;
        document.getElementById('totalWords').textContent = usage.totalWordsProcessed.toLocaleString();
        document.getElementById('totalTexts').textContent = usage.totalTextsProcessed.toLocaleString();
        
        // Update progress bar
        if (usage.remainingWords !== 'unlimited') {
            const dailyLimit = 300;
            const progressPercent = (usage.dailyWordsUsed / dailyLimit) * 100;
            document.getElementById('dailyProgress').style.width = `${Math.min(progressPercent, 100)}%`;
        } else {
            document.getElementById('dailyProgress').style.width = '100%';
        }
        
        // Update plan cards
        const freePlan = document.getElementById('freePlan');
        const premiumPlan = document.getElementById('premiumPlan');
        const freeButton = document.getElementById('freeButton');
        const premiumButton = document.getElementById('premiumButton');
        
        if (subscription.type === 'premium' && subscription.status === 'active') {
            // User has premium
            freePlan.classList.remove('current');
            premiumPlan.classList.add('current');
            
            freeButton.textContent = 'Downgrade to Free';
            freeButton.className = 'plan-button secondary';
            
            premiumButton.textContent = 'Current Plan';
            premiumButton.className = 'plan-button current';
            premiumButton.disabled = true;
            
            // Show billing section
            this.showBillingSection();
        } else {
            // User has free plan
            freePlan.classList.add('current');
            premiumPlan.classList.remove('current');
            
            freeButton.textContent = 'Current Plan';
            freeButton.className = 'plan-button current';
            freeButton.disabled = true;
            
            premiumButton.textContent = 'Upgrade to Premium';
            premiumButton.className = 'plan-button primary';
            premiumButton.disabled = false;
            
            // Hide billing section
            document.getElementById('billingSection').style.display = 'none';
        }
    }
    
    showBillingSection() {
        const billingSection = document.getElementById('billingSection');
        const { subscription } = this.subscriptionData;
        
        billingSection.style.display = 'block';
        
        document.getElementById('currentPlan').textContent = 
            subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1);
        
        if (subscription.currentPeriodEnd) {
            const endDate = new Date(subscription.currentPeriodEnd);
            document.getElementById('nextBilling').textContent = endDate.toLocaleDateString();
        }
        
        document.getElementById('subscriptionStatus').textContent = 
            subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
        
        // Show/hide cancel/reactivate buttons based on status
        const cancelButton = document.getElementById('cancelButton');
        const reactivateButton = document.getElementById('reactivateButton');
        
        if (subscription.status === 'active') {
            cancelButton.style.display = 'inline-block';
            reactivateButton.style.display = 'none';
        } else {
            cancelButton.style.display = 'none';
            reactivateButton.style.display = 'inline-block';
        }
    }
    
    async handleUpgrade() {
        this.showLoading('Creating checkout session...');
        
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch('/api/subscription/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Redirect to Stripe Checkout
                window.location.href = data.data.url;
            } else {
                this.hideLoading();
                alert('Failed to create checkout session: ' + data.message);
            }
        } catch (error) {
            this.hideLoading();
            console.error('Upgrade error:', error);
            alert('Network error. Please try again.');
        }
    }
    
    async handleCancel() {
        if (!confirm('Are you sure you want to cancel your subscription? You\'ll continue to have access until the end of your billing period.')) {
            return;
        }
        
        this.showLoading('Canceling subscription...');
        
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Subscription canceled successfully. You\'ll continue to have access until the end of your billing period.');
                await this.loadSubscriptionData();
                this.updateUI();
            } else {
                alert('Failed to cancel subscription: ' + data.message);
            }
        } catch (error) {
            console.error('Cancel error:', error);
            alert('Network error. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    async handleReactivate() {
        this.showLoading('Reactivating subscription...');
        
        const token = localStorage.getItem('authToken');
        
        try {
            const response = await fetch('/api/subscription/reactivate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Subscription reactivated successfully!');
                await this.loadSubscriptionData();
                this.updateUI();
            } else {
                alert('Failed to reactivate subscription: ' + data.message);
            }
        } catch (error) {
            console.error('Reactivate error:', error);
            alert('Network error. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    showLoading(message) {
        document.getElementById('loadingText').textContent = message;
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }
}

// Handle successful subscription from Stripe
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session_id');

if (sessionId) {
    // Handle successful payment
    const token = localStorage.getItem('authToken');
    
    fetch('/api/subscription/success', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Subscription activated successfully! Welcome to Premium!');
            // Remove session_id from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            alert('Error activating subscription: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Subscription activation error:', error);
        alert('Error activating subscription. Please contact support.');
    });
}

// Initialize subscription manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SubscriptionManager();
});