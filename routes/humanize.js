const express = require('express');
const TextHistory = require('../models/TextHistory');
const { requireAuth, checkUsageLimit } = require('../middleware/auth');

const router = express.Router();

// Humanize text endpoint
router.post('/process', requireAuth, checkUsageLimit, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { 
      text, 
      settings = {
        humanizationLevel: 'high',
        writingStyle: 'natural',
        vocabularyLevel: 'varied',
        features: ['addPersonalTouch', 'varyStructure', 'addTransitions', 'addContractions', 'removePatterns', 'addImperfections']
      }
    } = req.body;
    
    // Simulate AI detection analysis
    const originalAIScore = Math.floor(Math.random() * 40) + 60; // 60-99% AI detected
    
    // Simulate humanization process
    const humanizedText = await humanizeText(text, settings);
    
    // Simulate improved AI detection score
    const humanizedAIScore = Math.floor(Math.random() * 5) + 1; // 1-5% AI detected
    
    const processingTime = Date.now() - startTime;
    
    // Update user usage
    req.user.updateUsage(req.wordCount);
    await req.user.save();
    
    // Save to history
    const historyEntry = new TextHistory({
      userId: req.user._id,
      originalText: text,
      humanizedText,
      settings,
      aiDetectionScore: {
        original: originalAIScore,
        humanized: humanizedAIScore
      },
      wordCount: req.wordCount,
      processingTime
    });
    
    await historyEntry.save();
    
    res.json({
      success: true,
      data: {
        originalText: text,
        humanizedText,
        aiDetectionScore: {
          original: originalAIScore,
          humanized: humanizedAIScore
        },
        wordCount: req.wordCount,
        processingTime,
        usage: {
          dailyWordsUsed: req.user.usage.dailyWordsUsed,
          remainingWords: req.user.getRemainingWords()
        }
      }
    });
  } catch (error) {
    console.error('Humanization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing text'
    });
  }
});

// Get user's text history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const history = await TextHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-originalText -humanizedText'); // Exclude large text fields for list view
    
    const total = await TextHistory.countDocuments({ userId: req.user._id });
    
    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history'
    });
  }
});

// Get specific history entry
router.get('/history/:id', requireAuth, async (req, res) => {
  try {
    const historyEntry = await TextHistory.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found'
      });
    }
    
    res.json({
      success: true,
      data: historyEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching history entry'
    });
  }
});

// Delete history entry
router.delete('/history/:id', requireAuth, async (req, res) => {
  try {
    const historyEntry = await TextHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found'
      });
    }
    
    res.json({
      success: true,
      message: 'History entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting history entry'
    });
  }
});

// Advanced humanization function
async function humanizeText(text, settings) {
  // This is a simplified version - in production, you'd use advanced NLP
  let humanized = text;
  
  // Apply different transformations based on settings
  if (settings.features.includes('addContractions')) {
    humanized = addContractions(humanized);
  }
  
  if (settings.features.includes('varyStructure')) {
    humanized = varyStructure(humanized);
  }
  
  if (settings.features.includes('addPersonalTouch')) {
    humanized = addPersonalTouch(humanized);
  }
  
  if (settings.features.includes('addTransitions')) {
    humanized = addTransitions(humanized);
  }
  
  if (settings.features.includes('removePatterns')) {
    humanized = removeAIPatterns(humanized);
  }
  
  if (settings.features.includes('addImperfections')) {
    humanized = addHumanImperfections(humanized);
  }
  
  return humanized;
}

function addContractions(text) {
  const contractions = {
    'do not': "don't",
    'does not': "doesn't",
    'did not': "didn't",
    'will not': "won't",
    'would not': "wouldn't",
    'should not': "shouldn't",
    'could not': "couldn't",
    'cannot': "can't",
    'is not': "isn't",
    'are not': "aren't",
    'was not': "wasn't",
    'were not': "weren't",
    'have not': "haven't",
    'has not': "hasn't",
    'had not': "hadn't",
    'it is': "it's",
    'that is': "that's",
    'there is': "there's",
    'you are': "you're",
    'we are': "we're",
    'they are': "they're"
  };
  
  let result = text;
  for (const [full, contracted] of Object.entries(contractions)) {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    result = result.replace(regex, contracted);
  }
  
  return result;
}

function varyStructure(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  return sentences.map(sentence => {
    sentence = sentence.trim();
    if (!sentence) return sentence;
    
    // Randomly vary sentence structure
    if (Math.random() < 0.3 && sentence.includes(',')) {
      const parts = sentence.split(',');
      if (parts.length >= 2) {
        // Sometimes reverse clause order
        return parts.reverse().join(',');
      }
    }
    
    return sentence;
  }).join('. ') + '.';
}

function addPersonalTouch(text) {
  const personalPhrases = [
    'In my experience, ',
    'I think ',
    'From what I\'ve seen, ',
    'Personally, ',
    'I believe ',
    'It seems to me that '
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  return sentences.map((sentence, index) => {
    sentence = sentence.trim();
    if (!sentence) return sentence;
    
    // Add personal touch to some sentences
    if (Math.random() < 0.2 && index > 0) {
      const phrase = personalPhrases[Math.floor(Math.random() * personalPhrases.length)];
      return phrase + sentence.toLowerCase();
    }
    
    return sentence;
  }).join('. ') + '.';
}

function addTransitions(text) {
  const transitions = [
    'However, ',
    'Moreover, ',
    'Furthermore, ',
    'Additionally, ',
    'On the other hand, ',
    'Nevertheless, ',
    'Meanwhile, ',
    'Consequently, '
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  return sentences.map((sentence, index) => {
    sentence = sentence.trim();
    if (!sentence) return sentence;
    
    // Add transitions to some sentences
    if (Math.random() < 0.15 && index > 0 && index < sentences.length - 1) {
      const transition = transitions[Math.floor(Math.random() * transitions.length)];
      return transition + sentence.toLowerCase();
    }
    
    return sentence;
  }).join('. ') + '.';
}

function removeAIPatterns(text) {
  // Remove common AI patterns
  let result = text;
  
  // Remove excessive use of "Furthermore", "Moreover", etc.
  result = result.replace(/\b(Furthermore|Moreover|Additionally),?\s*/gi, '');
  
  // Remove overly formal transitions
  result = result.replace(/\bIn conclusion,?\s*/gi, '');
  result = result.replace(/\bTo summarize,?\s*/gi, '');
  
  // Remove repetitive patterns
  result = result.replace(/\b(It is important to note that|It should be noted that)\s*/gi, '');
  
  return result;
}

function addHumanImperfections(text) {
  let result = text;
  
  // Occasionally use less formal language
  result = result.replace(/\butilize\b/gi, 'use');
  result = result.replace(/\bfacilitate\b/gi, 'help');
  result = result.replace(/\bdemonstrate\b/gi, 'show');
  
  // Add some casual expressions
  if (Math.random() < 0.3) {
    result = result.replace(/\bvery important\b/gi, 'really important');
    result = result.replace(/\bextremely\b/gi, 'really');
  }
  
  return result;
}

module.exports = router;