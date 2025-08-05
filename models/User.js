const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid'],
      default: 'active'
    }
  },
  usage: {
    dailyWordsUsed: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    },
    totalWordsProcessed: {
      type: Number,
      default: 0
    },
    totalTextsProcessed: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      usage: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if daily usage should reset
userSchema.methods.checkDailyReset = function() {
  const today = new Date();
  const lastReset = new Date(this.usage.lastResetDate);
  
  // Check if it's a new day
  if (today.toDateString() !== lastReset.toDateString()) {
    this.usage.dailyWordsUsed = 0;
    this.usage.lastResetDate = today;
    return true;
  }
  return false;
};

// Check if user can process text
userSchema.methods.canProcessText = function(wordCount) {
  this.checkDailyReset();
  
  if (this.subscription.type === 'premium' && this.subscription.status === 'active') {
    return true;
  }
  
  const dailyLimit = 300;
  return (this.usage.dailyWordsUsed + wordCount) <= dailyLimit;
};

// Update usage
userSchema.methods.updateUsage = function(wordCount) {
  this.checkDailyReset();
  this.usage.dailyWordsUsed += wordCount;
  this.usage.totalWordsProcessed += wordCount;
  this.usage.totalTextsProcessed += 1;
};

// Get remaining daily words
userSchema.methods.getRemainingWords = function() {
  this.checkDailyReset();
  
  if (this.subscription.type === 'premium' && this.subscription.status === 'active') {
    return 'unlimited';
  }
  
  const dailyLimit = 300;
  return Math.max(0, dailyLimit - this.usage.dailyWordsUsed);
};

module.exports = mongoose.model('User', userSchema);