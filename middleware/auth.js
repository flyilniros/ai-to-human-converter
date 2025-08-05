const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
const requireAuth = async (req, res, next) => {
  try {
    // Check for token in header or session
    let token = null;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.session && req.session.passport && req.session.passport.user) {
      // User authenticated via session (Google OAuth or local)
      const user = await User.findById(req.session.passport.user);
      if (user) {
        req.user = user;
        return next();
      }
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware to check usage limits
const checkUsageLimit = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }
    
    const wordCount = text.trim().split(/\s+/).length;
    
    if (!req.user.canProcessText(wordCount)) {
      const remaining = req.user.getRemainingWords();
      
      return res.status(403).json({
        success: false,
        message: 'Daily word limit exceeded',
        data: {
          wordCount,
          remainingWords: remaining,
          dailyLimit: req.user.subscription.type === 'premium' ? 'unlimited' : 300,
          upgradeRequired: true
        }
      });
    }
    
    req.wordCount = wordCount;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking usage limits'
    });
  }
};

// Middleware to check if user has premium subscription
const requirePremium = (req, res, next) => {
  if (req.user.subscription.type !== 'premium' || req.user.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required',
      upgradeRequired: true
    });
  }
  next();
};

module.exports = {
  requireAuth,
  checkUsageLimit,
  requirePremium
};