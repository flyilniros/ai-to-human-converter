const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Get subscription status
router.get('/status', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    user.checkDailyReset();
    await user.save();
    
    res.json({
      success: true,
      data: {
        subscription: user.subscription,
        usage: {
          dailyWordsUsed: user.usage.dailyWordsUsed,
          remainingWords: user.getRemainingWords(),
          totalWordsProcessed: user.usage.totalWordsProcessed,
          totalTextsProcessed: user.usage.totalTextsProcessed
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription status'
    });
  }
});

// Create checkout session for premium subscription
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    
    // Create or get Stripe customer
    let customer;
    if (user.subscription.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.subscription.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      user.subscription.stripeCustomerId = customer.id;
      await user.save();
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Humanizer Premium',
              description: 'Unlimited text processing and advanced features'
            },
            unit_amount: 999, // $9.99 in cents
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString()
      }
    });
    
    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session'
    });
  }
});

// Handle successful subscription
router.post('/success', requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Update user subscription
    req.user.subscription = {
      type: 'premium',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: subscription.status
    };
    
    await req.user.save();
    
    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: {
        subscription: req.user.subscription
      }
    });
  } catch (error) {
    console.error('Subscription success error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing subscription'
    });
  }
});

// Cancel subscription
router.post('/cancel', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    // Cancel at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current period'
    });
  } catch (error) {
    console.error('Subscription cancel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling subscription'
    });
  }
});

// Reactivate subscription
router.post('/reactivate', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    
    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No subscription found'
      });
    }
    
    // Remove cancel at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    });
    
    res.json({
      success: true,
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    console.error('Subscription reactivate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reactivating subscription'
    });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const user = await User.findOne({ 
          'subscription.stripeSubscriptionId': subscription.id 
        });
        
        if (user) {
          user.subscription.status = subscription.status;
          user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
          user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          
          if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            user.subscription.type = 'free';
          }
          
          await user.save();
        }
        break;
        
      case 'invoice.payment_failed':
        const invoice = event.data.object;
        const failedUser = await User.findOne({ 
          'subscription.stripeCustomerId': invoice.customer 
        });
        
        if (failedUser) {
          failedUser.subscription.status = 'past_due';
          await failedUser.save();
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;