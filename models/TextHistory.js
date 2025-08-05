const mongoose = require('mongoose');

const textHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  humanizedText: {
    type: String,
    required: true
  },
  settings: {
    humanizationLevel: String,
    writingStyle: String,
    vocabularyLevel: String,
    features: [String]
  },
  aiDetectionScore: {
    original: Number,
    humanized: Number
  },
  wordCount: {
    type: Number,
    required: true
  },
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
textHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TextHistory', textHistorySchema);