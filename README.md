# ai-to-human-converter
Free tool to convert AI-generated text into natural human-like writing.

## Features

### Authentication System
- Google OAuth integration
- Email/password registration and login
- Password reset functionality
- Secure session management
- JWT token authentication

### Subscription & Usage Management
- Free tier: 300 words per day
- Premium subscription: $9.99/month for unlimited usage
- Daily usage tracking with automatic reset
- Stripe payment integration
- Subscription management (upgrade, cancel, reactivate)
- Usage analytics dashboard

### AI Text Humanization
- Advanced AI detection analysis
- Multiple humanization levels and writing styles
- Real-time text processing
- History tracking for authenticated users
- Export functionality

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Stripe account for payments
- Google OAuth credentials
- Email service (Gmail recommended)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-humanizer
SESSION_SECRET=your-super-secret-session-key-change-this

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT
JWT_SECRET=your-jwt-secret-key-change-this
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# App
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000
```

3. Set up external services:

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

#### Stripe Setup
1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhook endpoint: `http://localhost:3000/api/subscription/webhook`
4. Select events: `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

#### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password
3. Use the app password in EMAIL_PASS

### Running the Application

1. Start MongoDB (if running locally)
2. Start the development server:
```bash
npm run dev
```
3. Open http://localhost:3000 in your browser

### Production Deployment

1. Set NODE_ENV=production in your environment
2. Update CLIENT_URL to your production domain
3. Use production Stripe keys
4. Set up proper SSL certificates
5. Configure your production database

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/create-checkout-session` - Create Stripe checkout
- `POST /api/subscription/success` - Handle successful payment
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/subscription/reactivate` - Reactivate subscription
- `POST /api/subscription/webhook` - Stripe webhook handler

### Text Processing
- `POST /api/humanize/process` - Humanize text
- `GET /api/humanize/history` - Get user's text history
- `GET /api/humanize/history/:id` - Get specific history entry
- `DELETE /api/humanize/history/:id` - Delete history entry

## Database Schema

### User Model
- Authentication (email, password, Google ID)
- Subscription details (type, Stripe IDs, status)
- Usage tracking (daily words, totals)
- User preferences

### TextHistory Model
- Original and humanized text
- Processing settings
- AI detection scores
- Word count and processing time

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register with email/password
- [ ] Login with email/password
- [ ] Google OAuth login
- [ ] Password reset flow
- [ ] Email verification

#### Subscription
- [ ] Free tier usage limits
- [ ] Stripe checkout flow
- [ ] Premium subscription activation
- [ ] Subscription cancellation
- [ ] Usage tracking accuracy

#### Text Processing
- [ ] AI detection analysis
- [ ] Text humanization
- [ ] History saving (authenticated users)
- [ ] Export functionality
- [ ] Guest user limitations

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Secure session management

## Performance Optimizations

- Database indexing
- Connection pooling
- Caching strategies
- Efficient query patterns
- Rate limiting to prevent abuse

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Contact support team

## License

ISC License - see LICENSE file for details