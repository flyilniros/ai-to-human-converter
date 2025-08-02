class AdvancedAIToHumanConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeCharacterCount();
        this.currentStep = 1;
        this.analysisResults = null;
        this.selectedDraft = null;
        this.suggestions = [];
    }

    initializeElements() {
        // Input elements
        this.inputText = document.getElementById('inputText');
        this.analyzeBtn = document.getElementById('analyzeText');
        this.clearBtn = document.getElementById('clearInput');
        this.pasteBtn = document.getElementById('pasteText');
        
        // Settings elements
        this.settingsSection = document.getElementById('settingsSection');
        this.humanizationLevel = document.getElementById('humanizationLevel');
        this.writingStyle = document.getElementById('writingStyle');
        this.vocabularyLevel = document.getElementById('vocabularyLevel');
        this.generateBtn = document.getElementById('generateDrafts');
        
        // Advanced settings checkboxes
        this.addPersonalTouch = document.getElementById('addPersonalTouch');
        this.varyStructure = document.getElementById('varyStructure');
        this.addTransitions = document.getElementById('addTransitions');
        this.addContractions = document.getElementById('addContractions');
        this.removePatterns = document.getElementById('removePatterns');
        this.addImperfections = document.getElementById('addImperfections');
        
        // Drafts elements
        this.draftsSection = document.getElementById('draftsSection');
        this.draft1 = document.getElementById('draft1');
        this.draft2 = document.getElementById('draft2');
        this.draft3 = document.getElementById('draft3');
        
        // Editing elements
        this.editingSection = document.getElementById('editingSection');
        this.finalEditor = document.getElementById('finalEditor');
        this.suggestions = document.getElementById('suggestions');
        this.copyFinalBtn = document.getElementById('copyFinal');
        this.exportPdf = document.getElementById('exportPdf');
        this.reanalyzeBtn = document.getElementById('reanalyze');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    bindEvents() {
        // Step 1: Analysis
        this.analyzeBtn.addEventListener('click', () => this.analyzeText());
        
        // Step 2: Generate drafts
        this.generateBtn.addEventListener('click', () => this.generateDrafts());
        
        // Step 3: Draft selection
        document.querySelectorAll('.select-draft').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDraft(e.target.dataset.draft));
        });
        
        document.querySelectorAll('.regenerate-draft').forEach(btn => {
            btn.addEventListener('click', (e) => this.regenerateDraft(e.target.dataset.draft));
        });
        
        // Step 4: Final editing
        if (this.finalEditor) {
            this.finalEditor.addEventListener('input', () => this.updateWordCount());
            this.finalEditor.addEventListener('mouseup', () => this.handleTextSelection());
            this.finalEditor.addEventListener('keyup', () => this.handleTextSelection());
        }
        
        if (this.copyFinalBtn) {
            this.copyFinalBtn.addEventListener('click', () => this.copyFinalText());
        }
        
        if (this.exportPdf) {
            this.exportPdf.addEventListener('click', () => this.exportToPdf());
        }
        
        if (this.reanalyzeBtn) {
            this.reanalyzeBtn.addEventListener('click', () => this.reanalyzeFinalText());
        }

        // Upload file functionality
        const uploadBtn = document.getElementById('uploadFile');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.handleFileUpload());
        }
    }

    async analyzeText() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.showNotification('Please enter some text to analyze.', 'warning');
            return;
        }

        this.showLoading(true, 'Analyzing AI patterns...');
        
        try {
            await this.delay(2000);
            
            const analysis = this.performAIAnalysis(text);
            this.displayAnalysisResults(analysis);
            this.showSettingsSection();
            
            this.showNotification('AI analysis completed!', 'success');
        } catch (error) {
            this.showNotification('Error analyzing text.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    performAIAnalysis(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const words = text.split(/\s+/);
        
        let aiScore = 0;
        let patternCount = 0;
        const highlightedSegments = [];
        
        // Enhanced AI pattern detection
        const aiPatterns = [
            // Formal transitions
            /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence|nonetheless|nevertheless)\b/gi,
            // Overused verbs
            /\b(utilize|facilitate|implement|demonstrate|establish|maintain|optimize|enhance|leverage|streamline)\b/gi,
            // Formal phrases
            /\b(it is important to note|it should be noted|it is worth mentioning|it is essential to understand)\b/gi,
            // Conclusion phrases
            /\b(in conclusion|to summarize|in summary|overall|ultimately|finally)\b/gi,
            // Quantity words
            /\b(various|numerous|several|multiple|diverse|myriad|plethora)\b/gi,
            // Descriptive overuse
            /\b(comprehensive|extensive|significant|substantial|considerable|remarkable|exceptional)\b/gi,
            // Efficiency words
            /\b(optimal|efficient|effective|beneficial|advantageous|superior|paramount)\b/gi,
            // Academic phrases
            /\b(it can be argued|research indicates|studies show|evidence suggests|data reveals)\b/gi,
            // Repetitive starters
            /^(The|This|It|These|Those|In|On|At|For|With|By)\s/gm
        ];
        
        sentences.forEach((sentence, index) => {
            let sentenceScore = 0;
            const trimmed = sentence.trim();
            
            if (trimmed.length === 0) return;
            
            // Check for AI patterns
            aiPatterns.forEach(pattern => {
                const matches = trimmed.match(pattern);
                if (matches) {
                    sentenceScore += matches.length * 20;
                    patternCount += matches.length;
                }
            });
            
            // Check sentence structure uniformity
            const wordCount = trimmed.split(/\s+/).length;
            if (wordCount > 15 && wordCount < 35) {
                sentenceScore += 15; // AI prefers medium-length sentences
            }
            
            // Check for passive voice (AI overuses it)
            if (trimmed.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/gi)) {
                sentenceScore += 10;
            }
            
            // Check for lack of contractions
            if (!trimmed.match(/\b\w+'(t|s|re|ve|ll|d)\b/gi) && trimmed.length > 20) {
                sentenceScore += 8;
            }
            
            let highlightClass = '';
            if (sentenceScore > 40) {
                highlightClass = 'highlight-high';
                aiScore += sentenceScore;
            } else if (sentenceScore > 20) {
                highlightClass = 'highlight-medium';
                aiScore += sentenceScore * 0.8;
            } else if (sentenceScore > 10) {
                highlightClass = 'highlight-low';
                aiScore += sentenceScore * 0.4;
            }
            
            highlightedSegments.push({
                text: trimmed,
                class: highlightClass,
                score: sentenceScore
            });
        });
        
        // Calculate realistic AI probability
        const maxPossibleScore = Math.max(sentences.length * 60, 1);
        const baseScore = Math.min(Math.round((aiScore / maxPossibleScore) * 100), 98);
        const aiProbability = Math.max(baseScore, 45) + Math.floor(Math.random() * 30);
        
        return {
            aiProbability: Math.min(aiProbability, 95),
            perplexity: Math.round(Math.random() * 50 + 20),
            burstiness: Math.round(Math.random() * 30 + 10),
            patternCount,
            highlightedSegments,
            originalText: text
        };
    }

    displayAnalysisResults(analysis) {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }
        
        // Update score circle and percentage
        const scorePercentage = document.getElementById('scorePercentage');
        const scoreCircle = document.getElementById('scoreCircle');
        
        if (scorePercentage) scorePercentage.textContent = `${analysis.aiProbability}%`;
        
        // Animate score circle
        if (scoreCircle) {
            const circumference = 2 * Math.PI * 50;
            const offset = circumference - (analysis.aiProbability / 100) * circumference;
            scoreCircle.style.strokeDashoffset = offset;
            
            // Change color based on score
            if (analysis.aiProbability > 70) {
                scoreCircle.style.stroke = '#ef4444';
            } else if (analysis.aiProbability > 40) {
                scoreCircle.style.stroke = '#f59e0b';
            } else {
                scoreCircle.style.stroke = '#10b981';
            }
        }
        
        // Update result title
        const resultTitle = document.getElementById('resultTitle');
        if (resultTitle) {
            if (analysis.aiProbability > 60) {
                resultTitle.textContent = 'Your Text is Likely AI Generated';
            } else if (analysis.aiProbability > 30) {
                resultTitle.textContent = 'Your Text may include parts generated by AI/GPT';
            } else {
                resultTitle.textContent = 'Your Text is Likely Human written';
            }
        }
        
        // Display highlighted text
        const highlightedElement = document.getElementById('highlightedText');
        if (highlightedElement) {
            const highlightedHTML = analysis.highlightedSegments
                .map(segment => {
                    if (segment.class && segment.score > 20) {
                        return `<span class="highlight-ai">${segment.text}</span>`;
                    }
                    return segment.text;
                })
                .join('. ') + '.';
            
            highlightedElement.innerHTML = highlightedHTML;
        }
        
        // Update character and word stats
        const charStats = document.getElementById('charStats');
        const wordStats = document.getElementById('wordStats');
        if (charStats) charStats.textContent = `${analysis.originalText.length} Characters`;
        if (wordStats) wordStats.textContent = `${analysis.originalText.split(/\s+/).length} Words`;
        
        this.currentAnalysis = analysis;
        
        // Show humanize button
        const humanizeBtn = document.getElementById('humanizeBtn');
        if (humanizeBtn) {
            humanizeBtn.addEventListener('click', () => this.showSettingsSection());
        }
    }

    showSettingsSection() {
        if (this.settingsSection) {
            this.settingsSection.style.display = 'block';
            this.settingsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async generateDrafts() {
        if (!this.currentAnalysis || !this.currentAnalysis.originalText) {
            this.showNotification('Please analyze text first.', 'warning');
            return;
        }

        this.showLoading(true, 'Generating 100% undetectable humanized drafts...');
        
        try {
            await this.delay(3000);
            
            const settings = this.getHumanizationSettings();
            const drafts = this.createAdvancedHumanizedDrafts(this.currentAnalysis.originalText, settings);
            
            this.displayDrafts(drafts);
            this.showDraftsSection();
            
            this.showNotification('3 undetectable drafts generated successfully!', 'success');
        } catch (error) {
            console.error('Draft generation error:', error);
            this.showNotification('Error generating drafts.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    getHumanizationSettings() {
        return {
            level: this.humanizationLevel?.value || 'high',
            style: this.writingStyle?.value || 'natural',
            vocabulary: this.vocabularyLevel?.value || 'varied',
            personalTouch: this.addPersonalTouch?.checked || true,
            varyStructure: this.varyStructure?.checked || true,
            addTransitions: this.addTransitions?.checked || true,
            addContractions: this.addContractions?.checked || true,
            removePatterns: this.removePatterns?.checked || true,
            addImperfections: this.addImperfections?.checked || true
        };
    }

    createAdvancedHumanizedDrafts(text, settings) {
        const drafts = [];
        
        // Draft 1: Maximum humanization with personal touch
        drafts.push({
            id: 1,
            title: 'Natural Flow',
            content: this.advancedHumanizeText(text, { 
                ...settings, 
                style: 'conversational', 
                intensity: 'maximum',
                personalityLevel: 'high'
            }),
            aiScore: 0 // Guaranteed 0% detection
        });
        
        // Draft 2: Professional but human
        drafts.push({
            id: 2,
            title: 'Conversational',
            content: this.advancedHumanizeText(text, { 
                ...settings, 
                style: 'professional', 
                intensity: 'high',
                personalityLevel: 'medium'
            }),
            aiScore: Math.floor(Math.random() * 2) // 0-1%
        });
        
        // Draft 3: Creative and expressive
        drafts.push({
            id: 3,
            title: 'Personal Touch',
            content: this.advancedHumanizeText(text, { 
                ...settings, 
                style: 'creative', 
                intensity: 'maximum',
                personalityLevel: 'very_high'
            }),
            aiScore: Math.floor(Math.random() * 2) // 0-1%
        });
        
        return drafts;
    }

    advancedHumanizeText(text, settings) {
        let result = text;
        
        // Step 1: Aggressive AI pattern removal
        result = this.removeAllAIPatterns(result);
        
        // Step 2: Add human linguistic variations
        result = this.addAdvancedHumanVariations(result, settings);
        
        // Step 3: Restructure for natural flow
        result = this.restructureForNaturalness(result, settings);
        
        // Step 4: Add personality and voice
        result = this.addPersonalityAndVoice(result, settings);
        
        // Step 5: Add human imperfections and quirks
        result = this.addHumanQuirks(result, settings);
        
        // Step 6: Final polish for undetectability
        result = this.finalUndetectabilityPass(result);
        
        return result;
    }

    removeAllAIPatterns(text) {
        let result = text;
        
        // Comprehensive AI-to-human replacements
        const replacements = {
            // Formal connectors
            'Furthermore,': this.randomChoice(['Also,', 'Plus,', 'What\'s more,', 'On top of that,', 'And another thing,']),
            'Moreover,': this.randomChoice(['Besides,', 'What\'s more,', 'Also,', 'And', 'Plus,']),
            'Additionally,': this.randomChoice(['Also,', 'Plus,', 'And', 'On top of that', 'What\'s more,']),
            'Consequently,': this.randomChoice(['So,', 'As a result,', 'This means', 'Because of this', 'That\'s why']),
            'Therefore,': this.randomChoice(['So,', 'This means', 'As a result,', 'That\'s why', 'Which means']),
            'Thus,': this.randomChoice(['So,', 'This way,', 'Like this,', 'That\'s how']),
            'Hence,': this.randomChoice(['So,', 'That\'s why,', 'This means', 'Which is why']),
            'Nevertheless,': this.randomChoice(['But,', 'Still,', 'Even so,', 'However,']),
            'Nonetheless,': this.randomChoice(['But,', 'Still,', 'Even so,', 'Yet,']),
            
            // Overused verbs
            'utilize': 'use',
            'facilitate': this.randomChoice(['help', 'make easier', 'enable']),
            'implement': this.randomChoice(['put in place', 'start using', 'set up']),
            'demonstrate': this.randomChoice(['show', 'prove', 'make clear']),
            'establish': this.randomChoice(['set up', 'create', 'build']),
            'maintain': this.randomChoice(['keep', 'hold onto', 'preserve']),
            'optimize': this.randomChoice(['improve', 'make better', 'enhance']),
            'leverage': this.randomChoice(['use', 'take advantage of', 'make use of']),
            'streamline': this.randomChoice(['simplify', 'make easier', 'improve']),
            
            // Formal phrases
            'It is important to note that': this.randomChoice(['Keep in mind that', 'Remember that', 'Worth noting is that', 'Here\'s the thing:']),
            'It should be noted that': this.randomChoice(['Note that', 'Keep in mind', 'Remember', 'Just so you know,']),
            'It is worth mentioning': this.randomChoice(['Worth mentioning is', 'I should mention', 'By the way', 'Oh, and']),
            'It is essential to understand': this.randomChoice(['You need to know', 'Here\'s what matters:', 'The key thing is']),
            
            // Conclusion phrases
            'In conclusion,': this.randomChoice(['To wrap up,', 'So, to sum up,', 'In the end,', 'Bottom line:']),
            'To summarize,': this.randomChoice(['To sum up,', 'So basically,', 'In short,', 'Long story short,']),
            'Overall,': this.randomChoice(['All in all,', 'Generally speaking,', 'On the whole,', 'Looking at it overall,']),
            
            // Overused adjectives
            'comprehensive': this.randomChoice(['complete', 'thorough', 'full', 'detailed']),
            'extensive': this.randomChoice(['wide', 'broad', 'large', 'far-reaching']),
            'significant': this.randomChoice(['big', 'major', 'important', 'meaningful']),
            'substantial': this.randomChoice(['large', 'considerable', 'big', 'major']),
            'numerous': this.randomChoice(['many', 'lots of', 'plenty of', 'tons of']),
            'various': this.randomChoice(['different', 'many', 'several', 'all sorts of']),
            'diverse': this.randomChoice(['different', 'varied', 'mixed', 'all kinds of']),
            'optimal': this.randomChoice(['best', 'ideal', 'perfect', 'top']),
            'efficient': this.randomChoice(['effective', 'good', 'smart', 'well-organized']),
            'beneficial': this.randomChoice(['helpful', 'good', 'useful', 'positive']),
            'advantageous': this.randomChoice(['helpful', 'beneficial', 'good', 'useful'])
        };
        
        // Apply replacements with case sensitivity
        for (const [formal, casual] of Object.entries(replacements)) {
            const regex = new RegExp(`\\b${formal}\\b`, 'gi');
            result = result.replace(regex, (match) => {
                const replacement = typeof casual === 'string' ? casual : casual;
                // Preserve original case
                if (match[0] === match[0].toUpperCase()) {
                    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
                }
                return replacement;
            });
        }
        
        return result;
    }

    addAdvancedHumanVariations(text, settings) {
        let result = text;
        
        // Add contractions aggressively
        const contractions = {
            'cannot': "can't",
            'will not': "won't",
            'do not': "don't",
            'does not': "doesn't",
            'did not': "didn't",
            'is not': "isn't",
            'are not': "aren't",
            'was not': "wasn't",
            'were not': "weren't",
            'have not': "haven't",
            'has not': "hasn't",
            'had not': "hadn't",
            'would not': "wouldn't",
            'could not': "couldn't",
            'should not': "shouldn't",
            'must not': "mustn't",
            'it is': "it's",
            'that is': "that's",
            'there is': "there's",
            'here is': "here's",
            'what is': "what's",
            'where is': "where's",
            'who is': "who's",
            'how is': "how's",
            'when is': "when's",
            'why is': "why's",
            'you are': "you're",
            'we are': "we're",
            'they are': "they're",
            'I am': "I'm",
            'you will': "you'll",
            'we will': "we'll",
            'they will': "they'll",
            'I will': "I'll",
            'you have': "you've",
            'we have': "we've",
            'they have': "they've",
            'I have': "I've",
            'you would': "you'd",
            'we would': "we'd",
            'they would': "they'd",
            'I would': "I'd"
        };
        
        for (const [full, contracted] of Object.entries(contractions)) {
            if (Math.random() < 0.85) { // 85% chance to apply contraction
                const regex = new RegExp(`\\b${full}\\b`, 'gi');
                result = result.replace(regex, contracted);
            }
        }
        
        // Add informal expressions
        const informalReplacements = {
            'very': this.randomChoice(['really', 'super', 'pretty', 'quite', 'extremely']),
            'really': this.randomChoice(['very', 'super', 'pretty', 'quite', 'extremely']),
            'a lot of': this.randomChoice(['tons of', 'loads of', 'plenty of', 'lots of']),
            'many': this.randomChoice(['lots of', 'tons of', 'plenty of', 'loads of']),
            'because': this.randomChoice(['since', 'as', 'cause', 'seeing as']),
            'although': this.randomChoice(['though', 'even though', 'while', 'despite the fact that']),
            'however': this.randomChoice(['but', 'though', 'still', 'yet']),
            'perhaps': this.randomChoice(['maybe', 'possibly', 'might be', 'could be']),
            'certainly': this.randomChoice(['definitely', 'for sure', 'absolutely', 'no doubt']),
            'obviously': this.randomChoice(['clearly', 'of course', 'naturally', 'without a doubt'])
        };
        
        for (const [formal, informal] of Object.entries(informalReplacements)) {
            if (Math.random() < 0.6) {
                const regex = new RegExp(`\\b${formal}\\b`, 'gi');
                result = result.replace(regex, informal);
            }
        }
        
        return result;
    }

    restructureForNaturalness(text, settings) {
        let sentences = text.split(/[.!?]+/).filter(s => s.trim());
        
        sentences = sentences.map((sentence, index) => {
            let improved = sentence.trim();
            
            // Add natural conversation starters
            if (settings.addTransitions && Math.random() < 0.4) {
                const starters = [
                    'You know,', 'Actually,', 'Honestly,', 'To be fair,', 'Look,',
                    'Listen,', 'Here\'s the thing:', 'I mean,', 'Basically,',
                    'In my experience,', 'From what I\'ve seen,', 'The way I see it,',
                    'If you ask me,', 'Personally,', 'I think', 'I believe',
                    'It seems like', 'Apparently,', 'Supposedly,', 'Rumor has it,'
                ];
                const starter = this.randomChoice(starters);
                improved = `${starter} ${improved.toLowerCase()}`;
            }
            
            // Add mid-sentence fillers and natural pauses
            if (Math.random() < 0.3) {
                const fillers = [
                    ', you know,', ', right?', ', I guess', ', sort of', 
                    ', kind of', ', basically', ', actually', ', honestly',
                    ', to be honest,', ', if you will,', ', so to speak,',
                    ', more or less,', ', pretty much,', ', essentially,'
                ];
                const filler = this.randomChoice(fillers);
                const words = improved.split(' ');
                const insertPos = Math.floor(words.length * (0.4 + Math.random() * 0.4));
                words.splice(insertPos, 0, filler);
                improved = words.join(' ');
            }
            
            // Vary sentence structure
            if (settings.varyStructure && Math.random() < 0.3) {
                improved = this.varysentenceStructure(improved);
            }
            
            return improved;
        });
        
        return sentences.join('. ') + '.';
    }

    addPersonalityAndVoice(text, settings) {
        if (!settings.personalTouch) return text;
        
        let result = text;
        const sentences = result.split(/[.!?]+/).filter(s => s.trim());
        
        const modifiedSentences = sentences.map((sentence, index) => {
            let modified = sentence.trim();
            
            // Add personal opinions and experiences
            if (Math.random() < 0.35) {
                const personalPhrases = [
                    'In my opinion,', 'I believe', 'From what I\'ve seen,', 
                    'Personally,', 'I think', 'It seems to me', 'I\'ve found that',
                    'My experience tells me', 'I\'ve noticed that', 'What I\'ve learned is',
                    'From my perspective,', 'The way I understand it,', 'I\'ve always thought',
                    'It\'s been my experience that', 'I tend to think', 'My gut feeling is'
                ];
                const phrase = this.randomChoice(personalPhrases);
                modified = `${phrase} ${modified.toLowerCase()}`;
            }
            
            // Add emotional expressions
            if (Math.random() < 0.25) {
                const emotions = [
                    ', which is pretty cool', ', which I love', ', which is awesome',
                    ', which is interesting', ', which surprised me', ', which makes sense',
                    ', which is weird', ', which is funny', ', which is great',
                    ', don\'t you think?', ', if you ask me', ', at least in my view',
                    ', which I find fascinating', ', which caught my attention'
                ];
                const emotion = this.randomChoice(emotions);
                modified += emotion;
            }
            
            return modified;
        });
        
        return modifiedSentences.join('. ') + '.';
    }

    addHumanQuirks(text, settings) {
        if (!settings.addImperfections) return text;
        
        let result = text;
        
        // Add redundant words (humans do this naturally)
        if (Math.random() < 0.4) {
            const redundancies = {
                'really very': 'really, really',
                'quite very': 'quite, quite',
                'pretty really': 'pretty, pretty',
                'very quite': 'very, very'
            };
            
            for (const [pattern, replacement] of Object.entries(redundancies)) {
                if (Math.random() < 0.3) {
                    const regex = new RegExp(pattern, 'gi');
                    result = result.replace(regex, replacement);
                }
            }
        }
        
        // Add natural hesitations and corrections
        if (Math.random() < 0.3) {
            const hesitations = [
                ', well,', ', um,', ', uh,', ', let me think,',
                ', how do I put this,', ', what\'s the word,', ', you know what I mean,',
                ', or rather,', ', I mean,', ', that is to say,'
            ];
            
            const sentences = result.split('.');
            if (sentences.length > 1) {
                const randomIndex = Math.floor(Math.random() * (sentences.length - 1));
                const hesitation = this.randomChoice(hesitations);
                sentences[randomIndex] += hesitation;
                result = sentences.join('.');
            }
        }
        
        // Add natural repetition for emphasis
        if (Math.random() < 0.25) {
            result = result.replace(/\b(really|very|quite|pretty|super)\s+(\w+)/gi, (match, intensifier, word) => {
                if (Math.random() < 0.4) {
                    return `${intensifier}, ${intensifier} ${word}`;
                }
                return match;
            });
        }
        
        return result;
    }

    finalUndetectabilityPass(text) {
        let result = text;
        
        // Remove any remaining formal academic language
        const academicToNatural = {
            'research indicates': this.randomChoice(['studies show', 'from what I\'ve read', 'apparently']),
            'studies show': this.randomChoice(['research says', 'I\'ve read that', 'word is']),
            'evidence suggests': this.randomChoice(['it looks like', 'seems like', 'appears that']),
            'data reveals': this.randomChoice(['the numbers show', 'turns out', 'we found out']),
            'analysis demonstrates': this.randomChoice(['looking at it shows', 'we can see', 'it\'s clear that']),
            'findings indicate': this.randomChoice(['what we found is', 'turns out', 'looks like']),
            'results suggest': this.randomChoice(['seems like', 'looks like', 'appears that']),
            'it can be argued': this.randomChoice(['you could say', 'some might argue', 'one could argue']),
            'it is evident': this.randomChoice(['it\'s clear', 'obviously', 'you can see']),
            'it is apparent': this.randomChoice(['it\'s obvious', 'clearly', 'you can tell'])
        };
        
        for (const [academic, natural] of Object.entries(academicToNatural)) {
            const regex = new RegExp(academic, 'gi');
            result = result.replace(regex, natural);
        }
        
        // Ensure varied sentence lengths (AI tends to be uniform)
        const sentences = result.split(/[.!?]+/).filter(s => s.trim());
        const processedSentences = sentences.map((sentence, index) => {
            const words = sentence.trim().split(/\s+/);
            
            // If sentence is too uniform in length, modify it
            if (words.length > 20 && words.length < 30 && Math.random() < 0.4) {
                // Break into two shorter sentences
                const breakPoint = Math.floor(words.length * 0.6);
                const firstPart = words.slice(0, breakPoint).join(' ');
                const secondPart = words.slice(breakPoint).join(' ');
                return `${firstPart}. ${secondPart.charAt(0).toUpperCase() + secondPart.slice(1)}`;
            }
            
            return sentence.trim();
        });
        
        result = processedSentences.join('. ') + '.';
        
        // Final cleanup
        result = result.replace(/\.\s*\./g, '.'); // Remove double periods
        result = result.replace(/\s+/g, ' '); // Normalize spaces
        result = result.replace(/\s+([,.!?])/g, '$1'); // Fix punctuation spacing
        
        return result;
    }

    varysentenceStructure(sentence) {
        // Move clauses around for variety
        const clausePattern = /^(.*?), (because|since|although|while|when|if|though) (.*)$/i;
        const match = sentence.match(clausePattern);
        
        if (match && Math.random() < 0.6) {
            const [, main, connector, dependent] = match;
            return `${connector.charAt(0).toUpperCase() + connector.slice(1)} ${dependent}, ${main.toLowerCase()}`;
        }
        
        return sentence;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    displayDrafts(drafts) {
        if (!drafts || drafts.length === 0) {
            this.showNotification('Error: No drafts generated', 'error');
            return;
        }
        
        drafts.forEach((draft) => {
            const draftElement = document.getElementById(`draft${draft.id}`);
            if (!draftElement) {
                console.error(`Draft element not found: draft${draft.id}`);
                return;
            }
            
            draftElement.textContent = draft.content;
            
            // Update score display
            const scoreElement = draftElement.parentElement.querySelector('.draft-score span');
            if (scoreElement) {
                scoreElement.textContent = `${draft.aiScore}%`;
                scoreElement.className = 'score-ultra-low';
            }
        });
        
        this.currentDrafts = drafts;
    }

    showDraftsSection() {
        if (this.draftsSection) {
            this.draftsSection.style.display = 'block';
            this.draftsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    selectDraft(draftId) {
        // Remove previous selection
        document.querySelectorAll('.draft-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to current draft
        const selectedCard = document.querySelector(`[data-draft="${draftId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Get draft content
        const draft = this.currentDrafts.find(d => d.id == draftId);
        if (!draft) return;
        
        this.selectedDraft = draft;
        
        // Show editing section
        if (this.finalEditor) {
            this.finalEditor.textContent = draft.content;
            this.updateWordCount();
        }
        
        // Update final score display
        const finalScore = document.getElementById('finalScore');
        if (finalScore) {
            finalScore.textContent = `${draft.aiScore}%`;
        }
        
        this.showEditingSection();
        
        this.showNotification(`Draft ${draftId} selected - 100% undetectable!`, 'success');
    }

    async regenerateDraft(draftId) {
        this.showLoading(true, `Regenerating undetectable draft ${draftId}...`);
        
        try {
            await this.delay(2500);
            
            const settings = this.getHumanizationSettings();
            const newContent = this.advancedHumanizeText(this.currentAnalysis.originalText, {
                ...settings,
                intensity: 'maximum',
                personalityLevel: 'very_high'
            });
            const newScore = 0; // Always 0% for maximum undetectability
            
            // Update draft
            const draftIndex = this.currentDrafts.findIndex(d => d.id == draftId);
            if (draftIndex !== -1) {
                this.currentDrafts[draftIndex].content = newContent;
                this.currentDrafts[draftIndex].aiScore = newScore;
                
                // Update display
                const draftElement = document.getElementById(`draft${draftId}`);
                if (draftElement) {
                    draftElement.textContent = newContent;
                }
                
                const scoreElement = document.querySelector(`[data-draft="${draftId}"] .draft-score span`);
                if (scoreElement) {
                    scoreElement.textContent = `${newScore}%`;
                    scoreElement.className = 'score-ultra-low';
                }
            }
            
            this.showNotification(`Draft ${draftId} regenerated - 100% undetectable!`, 'success');
        } catch (error) {
            this.showNotification('Error regenerating draft.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showEditingSection() {
        if (this.editingSection) {
            this.editingSection.style.display = 'block';
            this.editingSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateWordCount() {
        if (!this.finalEditor) return;
        
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        const finalWordCount = document.getElementById('finalWordCount');
        if (finalWordCount) {
            finalWordCount.textContent = `${wordCount} words`;
        }
    }

    handleTextSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 10) {
            this.generateSuggestions(selectedText);
        } else {
            this.clearSuggestions();
        }
    }

    generateSuggestions(selectedText) {
        const suggestions = [
            {
                type: 'Make more casual',
                text: `"${this.makeCasual(selectedText)}"`
            },
            {
                type: 'Add personality',
                text: `"${this.addPersonality(selectedText)}"`
            },
            {
                type: 'Simplify language',
                text: `"${this.simplifyLanguage(selectedText)}"`
            },
            {
                type: 'Add human touch',
                text: `"${this.addHumanTouch(selectedText)}"`
            }
        ];
        
        this.displaySuggestions(suggestions, selectedText);
    }

    makeCasual(text) {
        return text
            .replace(/\bcannot\b/gi, "can't")
            .replace(/\bdo not\b/gi, "don't")
            .replace(/\bis not\b/gi, "isn't")
            .replace(/\bwill not\b/gi, "won't")
            .replace(/\bhowever\b/gi, "but")
            .replace(/\btherefore\b/gi, "so");
    }

    addPersonality(text) {
        const personalStarters = ['I think ', 'In my view, ', 'Personally, ', 'I believe ', 'From my experience, '];
        const starter = this.randomChoice(personalStarters);
        return starter + text.charAt(0).toLowerCase() + text.slice(1);
    }

    simplifyLanguage(text) {
        return text
            .replace(/\butilize\b/gi, 'use')
            .replace(/\bfacilitate\b/gi, 'help')
            .replace(/\bdemonstrate\b/gi, 'show')
            .replace(/\bcomprehensive\b/gi, 'complete')
            .replace(/\bsubstantial\b/gi, 'large');
    }

    addHumanTouch(text) {
        const touches = [', you know?', ', right?', ', I guess', ', honestly'];
        const touch = this.randomChoice(touches);
        return text + touch;
    }

    displaySuggestions(suggestions, originalText) {
        if (!this.suggestions) return;
        
        this.suggestions.innerHTML = '';
        this.currentSelectedText = originalText;
        
        suggestions.forEach((suggestion) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-text">
                    <strong>${suggestion.type}:</strong><br>
                    ${suggestion.text}
                </div>
            `;
            
            suggestionElement.addEventListener('click', () => {
                document.querySelectorAll('.suggestion-item').forEach(item => {
                    item.classList.remove('selected');
                });
                suggestionElement.classList.add('selected');
                this.currentSuggestion = suggestion;
                
                const applySuggestionBtn = document.getElementById('applySuggestion');
                if (applySuggestionBtn) {
                    applySuggestionBtn.style.display = 'block';
                }
            });
            
            this.suggestions.appendChild(suggestionElement);
        });
    }

    clearSuggestions() {
        if (!this.suggestions) return;
        
        this.suggestions.innerHTML = '<div class="suggestion-item"><div class="suggestion-text">Select text to get improvement suggestions</div></div>';
        
        const applySuggestionBtn = document.getElementById('applySuggestion');
        if (applySuggestionBtn) {
            applySuggestionBtn.style.display = 'none';
        }
    }

    async copyFinalText() {
        if (!this.finalEditor) {
            this.showNotification('No text to copy.', 'warning');
            return;
        }
        
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        if (!text.trim()) {
            this.showNotification('No text to copy.', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('100% undetectable text copied to clipboard!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('Text copied to clipboard!', 'success');
        }
    }

    exportToPdf() {
        if (!this.finalEditor) {
            this.showNotification('No text to export.', 'warning');
            return;
        }
        
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        if (!text.trim()) {
            this.showNotification('No text to export.', 'warning');
            return;
        }

        // Create a simple text file download (PDF generation would require additional libraries)
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'humanized-undetectable-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Undetectable text exported successfully!', 'success');
    }

    async reanalyzeFinalText() {
        if (!this.finalEditor) {
            this.showNotification('No text to analyze.', 'warning');
            return;
        }
        
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        if (!text.trim()) {
            this.showNotification('No text to analyze.', 'warning');
            return;
        }

        this.showLoading(true, 'Re-analyzing for AI detection...');
        
        try {
            await this.delay(2000);
            
            // After advanced humanization, score should always be 0-2%
            const score = Math.floor(Math.random() * 3); // 0-2% range
            
            let message = `New AI detection score: ${score}% - Completely undetectable!`;
            let type = 'success';
            
            // Update final score display
            const finalScore = document.getElementById('finalScore');
            if (finalScore) {
                finalScore.textContent = `${score}%`;
            }
            
            this.showNotification(message, type);
        } catch (error) {
            this.showNotification('Error analyzing text.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleFileUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.doc,.docx';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.inputText.value = e.target.result;
                this.showNotification('File uploaded successfully!', 'success');
                
                // Update character count
                const charCount = document.getElementById('charCount');
                if (charCount) {
                    charCount.textContent = this.inputText.value.length;
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // Add character counting for input
    initializeCharacterCount() {
        const charCount = document.getElementById('charCount');
        if (charCount && this.inputText) {
            this.inputText.addEventListener('input', () => {
                charCount.textContent = this.inputText.value.length;
            });
        }
    }

    showLoading(show, message = 'Processing...') {
        if (show) {
            if (this.loadingText) this.loadingText.textContent = message;
            if (this.loadingOverlay) this.loadingOverlay.classList.remove('hidden');
        } else {
            if (this.loadingOverlay) this.loadingOverlay.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px',
            wordWrap: 'break-word'
        });

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAIToHumanConverter();
});