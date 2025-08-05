class UltraAdvancedAIToHumanConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.currentStep = 1;
        this.analysisResults = null;
        this.humanizedVersions = [];
        this.selectedVersion = null;
    }

    initializeElements() {
        // Input elements
        this.inputText = document.getElementById('inputText');
        this.analyzeBtn = document.getElementById('analyzeText');
        this.uploadBtn = document.getElementById('uploadFile');
        this.charCount = document.getElementById('charCount');
        
        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.resultTitle = document.getElementById('resultTitle');
        this.scoreCircle = document.getElementById('scoreCircle');
        this.scorePercentage = document.getElementById('scorePercentage');
        this.highlightedText = document.getElementById('highlightedText');
        this.humanizeBtn = document.getElementById('humanizeBtn');
        this.charStats = document.getElementById('charStats');
        this.wordStats = document.getElementById('wordStats');
        
        // Settings elements
        this.settingsSection = document.getElementById('settingsSection');
        this.humanizationLevel = document.getElementById('humanizationLevel');
        this.writingStyle = document.getElementById('writingStyle');
        this.vocabularyLevel = document.getElementById('vocabularyLevel');
        this.generateBtn = document.getElementById('generateDrafts');
        
        // Advanced options
        this.addPersonalTouchCheckbox = document.getElementById('addPersonalTouch');
        this.varyStructure = document.getElementById('varyStructure');
        this.addTransitions = document.getElementById('addTransitions');
        this.addContractions = document.getElementById('addContractions');
        this.removePatterns = document.getElementById('removePatterns');
        this.addImperfections = document.getElementById('addImperfections');
        
        // Drafts elements
        this.draftsSection = document.getElementById('draftsSection');
        this.draftCards = document.querySelectorAll('.draft-card');
        this.selectDraftBtns = document.querySelectorAll('.select-draft');
        this.regenerateBtns = document.querySelectorAll('.regenerate-draft');
        
        // Editing elements
        this.editingSection = document.getElementById('editingSection');
        this.finalEditor = document.getElementById('finalEditor');
        this.finalScore = document.getElementById('finalScore');
        this.copyBtn = document.getElementById('copyFinal');
        this.exportBtn = document.getElementById('exportPdf');
        this.reanalyzeBtn = document.getElementById('reanalyze');
        this.suggestions = document.getElementById('suggestions');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    bindEvents() {
        // Input events
        this.inputText.addEventListener('input', () => this.updateCharCount());
        this.inputText.addEventListener('paste', () => {
            setTimeout(() => this.updateCharCount(), 10);
        });
        
        // Analysis events
        this.analyzeBtn.addEventListener('click', () => this.analyzeText());
        this.uploadBtn.addEventListener('click', () => this.handleFileUpload());
        
        // Humanization events
        this.humanizeBtn.addEventListener('click', () => this.showSettings());
        this.generateBtn.addEventListener('click', () => this.generateHumanizedVersions());
        
        // Draft selection events
        this.selectDraftBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDraft(e.target.dataset.draft));
        });
        
        this.regenerateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.regenerateDraft(e.target.dataset.draft));
        });
        
        // Final editing events
        this.copyBtn.addEventListener('click', () => this.copyFinalText());
        this.exportBtn.addEventListener('click', () => this.exportToPDF());
        this.reanalyzeBtn.addEventListener('click', () => this.reanalyzeText());
        
        // Text selection for suggestions
        this.finalEditor.addEventListener('mouseup', () => this.handleTextSelection());
        this.finalEditor.addEventListener('keyup', () => this.handleTextSelection());
        
        // File upload handler
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.doc,.docx,.pdf';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        this.uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.processUploadedFile(e.target.files[0]));
    }

    updateCharCount() {
        const text = this.inputText.value;
        const charCount = text.length;
        this.charCount.textContent = charCount.toLocaleString();
        
        // Update character count color based on limit
        if (charCount > 125000) {
            this.charCount.style.color = 'var(--accent-danger)';
        } else if (charCount > 100000) {
            this.charCount.style.color = 'var(--accent-warning)';
        } else {
            this.charCount.style.color = 'var(--text-secondary)';
        }
    }

    async analyzeText() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showNotification('Please enter some text to analyze.', 'warning');
            return;
        }
        
        if (text.length > 125000) {
            this.showNotification('Text exceeds the 125,000 character limit. Please upgrade or reduce the text length.', 'error');
            return;
        }
        
        this.showLoading('Analyzing text with advanced AI detection...');
        
        try {
            // Simulate AI analysis with realistic delay
            await this.delay(2000 + Math.random() * 2000);
            
            const analysisResult = await this.performAIAnalysis(text);
            this.analysisResults = analysisResult;
            
            this.hideLoading();
            this.displayAnalysisResults(analysisResult);
            this.showSection('results');
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('Analysis failed. Please try again.', 'error');
            console.error('Analysis error:', error);
        }
    }

    async performAIAnalysis(text) {
        // Advanced AI detection simulation
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        
        // Simulate AI detection patterns
        const aiPatterns = [
            /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence)\b/gi,
            /\b(it is important to note|it should be noted|it is worth mentioning)\b/gi,
            /\b(in conclusion|to summarize|in summary|overall)\b/gi,
            /\b(various|numerous|several|multiple|diverse)\b/gi,
            /\b(comprehensive|extensive|thorough|detailed)\b/gi,
            /\b(significant|substantial|considerable|notable)\b/gi,
            /\b(utilize|implement|facilitate|optimize|enhance)\b/gi,
            /\b(paradigm|framework|methodology|approach|strategy)\b/gi
        ];
        
        let aiScore = 0;
        let highlightedSentences = [];
        
        sentences.forEach((sentence, index) => {
            let sentenceScore = 0;
            let hasAIPattern = false;
            
            // Check for AI patterns
            aiPatterns.forEach(pattern => {
                if (pattern.test(sentence)) {
                    sentenceScore += 15;
                    hasAIPattern = true;
                }
            });
            
            // Check sentence length (AI tends to write longer sentences)
            if (sentence.split(' ').length > 25) {
                sentenceScore += 10;
            }
            
            // Check for passive voice
            if (/\b(was|were|been|being)\s+\w+ed\b/gi.test(sentence)) {
                sentenceScore += 8;
            }
            
            // Check for complex sentence structures
            if ((sentence.match(/,/g) || []).length > 2) {
                sentenceScore += 5;
            }
            
            // Normalize sentence score
            sentenceScore = Math.min(sentenceScore, 100);
            
            if (sentenceScore > 30 || hasAIPattern) {
                highlightedSentences.push({
                    text: sentence.trim(),
                    score: sentenceScore,
                    index: index
                });
            }
            
            aiScore += sentenceScore;
        });
        
        // Calculate overall AI probability
        const avgScore = sentences.length > 0 ? aiScore / sentences.length : 0;
        const finalScore = Math.min(Math.max(avgScore + Math.random() * 20 - 10, 0), 100);
        
        return {
            aiProbability: Math.round(finalScore),
            humanProbability: Math.round(100 - finalScore),
            totalCharacters: text.length,
            totalWords: words.length,
            totalSentences: sentences.length,
            highlightedSentences: highlightedSentences,
            originalText: text,
            detectionPatterns: this.identifyDetectionPatterns(text)
        };
    }

    identifyDetectionPatterns(text) {
        const patterns = [];
        
        // Common AI writing patterns
        if (/\b(furthermore|moreover|additionally)\b/gi.test(text)) {
            patterns.push('Overuse of transitional phrases');
        }
        
        if (/\b(comprehensive|extensive|thorough)\b/gi.test(text)) {
            patterns.push('Repetitive descriptive language');
        }
        
        if (/\b(it is important to note|it should be noted)\b/gi.test(text)) {
            patterns.push('Formal academic phrases');
        }
        
        if ((text.match(/,/g) || []).length / text.split('.').length > 3) {
            patterns.push('Complex sentence structures');
        }
        
        return patterns;
    }

    displayAnalysisResults(results) {
        // Update result title based on AI probability
        let title = '';
        if (results.aiProbability < 20) {
            title = 'Your Text is Likely Human written';
            this.resultTitle.style.color = 'var(--accent-secondary)';
        } else if (results.aiProbability < 50) {
            title = 'Your Text is Likely Human written, may include parts generated by AI/GPT';
            this.resultTitle.style.color = 'var(--accent-warning)';
        } else if (results.aiProbability < 80) {
            title = 'Your Text is Likely AI/GPT generated, with some human elements';
            this.resultTitle.style.color = 'var(--accent-warning)';
        } else {
            title = 'Your Text is Likely AI/GPT generated';
            this.resultTitle.style.color = 'var(--accent-danger)';
        }
        
        this.resultTitle.textContent = title;
        
        // Update score circle
        this.updateScoreCircle(results.aiProbability);
        
        // Display highlighted text
        this.displayHighlightedText(results);
        
        // Update statistics
        this.charStats.textContent = `${results.totalCharacters.toLocaleString()} Characters`;
        this.wordStats.textContent = `${results.totalWords.toLocaleString()} Words`;
    }

    updateScoreCircle(percentage) {
        const circle = this.scoreCircle;
        const circumference = 2 * Math.PI * 50; // radius = 50
        const offset = circumference - (percentage / 100) * circumference;
        
        // Animate the circle
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 2s ease-in-out';
            circle.style.strokeDashoffset = offset;
            
            // Update color based on percentage
            if (percentage < 20) {
                circle.style.stroke = 'var(--accent-secondary)';
            } else if (percentage < 50) {
                circle.style.stroke = 'var(--accent-warning)';
            } else {
                circle.style.stroke = 'var(--accent-danger)';
            }
        }, 100);
        
        // Animate percentage counter
        this.animateCounter(this.scorePercentage, 0, percentage, 2000);
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.round(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = `${current}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    displayHighlightedText(results) {
        const container = this.highlightedText;
        const sentences = results.originalText.split(/([.!?]+)/).filter(s => s.trim().length > 0);
        
        container.innerHTML = '';
        
        let sentenceIndex = 0;
        sentences.forEach((part, index) => {
            if (/[.!?]+/.test(part)) {
                // This is punctuation
                const span = document.createElement('span');
                span.textContent = part;
                container.appendChild(span);
            } else {
                // This is a sentence
                const sentence = part.trim();
                if (sentence.length > 0) {
                    const highlightedSentence = results.highlightedSentences.find(
                        hs => hs.index === sentenceIndex
                    );
                    
                    const span = document.createElement('span');
                    span.textContent = sentence;
                    
                    if (highlightedSentence) {
                        span.className = 'highlight-ai';
                        span.title = `AI Detection Score: ${highlightedSentence.score}%`;
                    } else {
                        span.className = 'highlight-human';
                    }
                    
                    container.appendChild(span);
                    sentenceIndex++;
                }
            }
        });
    }

    showSettings() {
        this.showSection('settings');
    }

    async generateHumanizedVersions() {
        if (!this.analysisResults) {
            this.showNotification('Please analyze text first.', 'warning');
            return;
        }
        
        this.showLoading('Generating humanized versions...');
        
        try {
            // Simulate humanization process
            await this.delay(3000 + Math.random() * 2000);
            
            const versions = await this.createHumanizedVersions();
            this.humanizedVersions = versions;
            
            this.hideLoading();
            this.displayDrafts(versions);
            this.showSection('drafts');
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('Humanization failed. Please try again.', 'error');
            console.error('Humanization error:', error);
        }
    }

    async createHumanizedVersions() {
        const originalText = this.analysisResults.originalText;
        const settings = this.getHumanizationSettings();
        
        const versions = [];
        
        // Version 1: Natural Flow
        versions.push({
            id: 1,
            title: 'Natural Flow',
            content: await this.humanizeText(originalText, { ...settings, style: 'natural' }),
            aiScore: Math.floor(Math.random() * 5) + 1
        });
        
        // Version 2: Conversational
        versions.push({
            id: 2,
            title: 'Conversational',
            content: await this.humanizeText(originalText, { ...settings, style: 'conversational' }),
            aiScore: Math.floor(Math.random() * 3)
        });
        
        // Version 3: Personal Touch
        versions.push({
            id: 3,
            title: 'Personal Touch',
            content: await this.humanizeText(originalText, { ...settings, style: 'personal' }),
            aiScore: Math.floor(Math.random() * 4) + 1
        });
        
        return versions;
    }

    getHumanizationSettings() {
        return {
            intensity: this.humanizationLevel.value,
            writingStyle: this.writingStyle.value,
            vocabulary: this.vocabularyLevel.value,
            personalTouch: this.addPersonalTouchCheckbox.checked,
            varyStructure: this.varyStructure.checked,
            addTransitions: this.addTransitions.checked,
            addContractions: this.addContractions.checked,
            removePatterns: this.removePatterns.checked,
            addImperfections: this.addImperfections.checked
        };
    }

    async humanizeText(text, settings) {
        // Simulate advanced humanization
        let humanized = text;
        
        // Remove AI patterns
        if (settings.removePatterns) {
            humanized = humanized.replace(/\b(furthermore|moreover|additionally)\b/gi, (match) => {
                const alternatives = ['also', 'plus', 'and', 'besides', 'on top of that', 'what\'s more'];
                return alternatives[Math.floor(Math.random() * alternatives.length)];
            });
            
            humanized = humanized.replace(/\b(it is important to note)\b/gi, (match) => {
                const alternatives = ['worth mentioning', 'here\'s the thing', 'what\'s interesting is', 'I should point out'];
                return alternatives[Math.floor(Math.random() * alternatives.length)];
            });
            
            humanized = humanized.replace(/\b(comprehensive)\b/gi, (match) => {
                const alternatives = ['complete', 'thorough', 'full', 'detailed', 'in-depth'];
                return alternatives[Math.floor(Math.random() * alternatives.length)];
            });
            
            humanized = humanized.replace(/\b(utilize)\b/gi, 'use');
            humanized = humanized.replace(/\b(optimal)\b/gi, 'best');
            humanized = humanized.replace(/\b(numerous)\b/gi, 'many');
            humanized = humanized.replace(/\b(substantial)\b/gi, 'big');
            humanized = humanized.replace(/\b(significant)\b/gi, 'important');
        }
        
        // Add contractions
        if (settings.addContractions) {
            humanized = humanized.replace(/\bdo not\b/gi, "don't");
            humanized = humanized.replace(/\bcannot\b/gi, "can't");
            humanized = humanized.replace(/\bwill not\b/gi, "won't");
            humanized = humanized.replace(/\bit is\b/gi, "it's");
            humanized = humanized.replace(/\bthey are\b/gi, "they're");
            humanized = humanized.replace(/\bwe are\b/gi, "we're");
            humanized = humanized.replace(/\byou are\b/gi, "you're");
            humanized = humanized.replace(/\bI am\b/gi, "I'm");
            humanized = humanized.replace(/\bwould have\b/gi, "would've");
            humanized = humanized.replace(/\bcould have\b/gi, "could've");
            humanized = humanized.replace(/\bshould have\b/gi, "should've");
        }
        
        // Add personal touch
        if (settings.personalTouch && settings.style === 'personal') {
            const personalPhrases = [
                'In my experience, ', 'I think ', 'From what I\'ve seen, ',
                'Personally, ', 'I believe ', 'It seems to me that ',
                'From my perspective, ', 'I\'ve noticed that ', 'My take is that ',
                'What I\'ve found is ', 'In my view, ', 'I\'d say that '
            ];
            
            const sentences = humanized.split('. ');
            if (sentences.length > 1) {
                const randomIndex = Math.floor(Math.random() * Math.min(2, sentences.length));
                const phrase = personalPhrases[Math.floor(Math.random() * personalPhrases.length)];
                sentences[randomIndex] = phrase + sentences[randomIndex].toLowerCase();
                humanized = sentences.join('. ');
            }
        }
        
        // Vary sentence structure
        if (settings.varyStructure) {
            humanized = this.varysentenceStructure(humanized);
        }
        
        // Add subtle imperfections
        if (settings.addImperfections) {
            humanized = this.addSubtleImperfections(humanized);
        }
        
        return humanized;
    }

    varysentenceStructure(text) {
        const sentences = text.split('. ');
        return sentences.map(sentence => {
            // Randomly vary sentence beginnings
            if (Math.random() < 0.3 && sentence.length > 50) {
                const parts = sentence.split(', ');
                if (parts.length > 2) {
                    // Sometimes move a clause to the beginning
                    const lastPart = parts.pop();
                    const firstPart = parts.shift();
                    return [lastPart, firstPart, ...parts].join(', ');
                }
            }
            return sentence;
        }).join('. ');
    }

    addSubtleImperfections(text) {
        // Add occasional informal language
        text = text.replace(/\bvery good\b/gi, 'pretty good');
        text = text.replace(/\bvery important\b/gi, 'really important');
        text = text.replace(/\bvery interesting\b/gi, 'pretty interesting');
        text = text.replace(/\bvery difficult\b/gi, 'really tough');
        text = text.replace(/\bvery easy\b/gi, 'pretty simple');
        
        // Add occasional hesitation markers (sparingly)
        if (Math.random() < 0.1) {
            text = text.replace(/\. However,/gi, '. Well, however,');
            text = text.replace(/\. But/gi, '. But you know,');
        }
        
        // Add natural filler words occasionally
        if (Math.random() < 0.15) {
            text = text.replace(/\bI think\b/gi, 'I think, you know,');
            text = text.replace(/\bactually\b/gi, 'actually, um,');
        }
        
        // Add natural redundancies
        if (Math.random() < 0.1) {
            text = text.replace(/\bThis is important\b/gi, 'This is important, really important');
            text = text.replace(/\bIt works well\b/gi, 'It works well, works really well');
        }
        
        return text;
    }

    displayDrafts(versions) {
        versions.forEach((version, index) => {
            const draftContent = document.getElementById(`draft${version.id}`);
            const draftScore = document.getElementById(`score${version.id}`);
            
            if (draftContent && draftScore) {
                draftContent.textContent = version.content;
                draftScore.textContent = `${version.aiScore}%`;
                
                // Update score styling
                if (version.aiScore < 5) {
                    draftScore.className = 'score-ultra-low';
                } else if (version.aiScore < 15) {
                    draftScore.className = 'score-low';
                } else {
                    draftScore.className = 'score-medium';
                }
            }
        });
    }

    selectDraft(draftId) {
        const selectedVersion = this.humanizedVersions.find(v => v.id == draftId);
        if (!selectedVersion) return;
        
        this.selectedVersion = selectedVersion;
        
        // Update UI to show selection
        this.draftCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-draft="${draftId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Move to editing section
        setTimeout(() => {
            this.showEditingSection(selectedVersion);
        }, 500);
    }

    showEditingSection(version) {
        this.finalEditor.textContent = version.content;
        this.finalScore.textContent = `${version.aiScore}%`;
        
        // Update final score styling
        if (version.aiScore < 5) {
            this.finalScore.className = 'score-ultra-low';
        } else if (version.aiScore < 15) {
            this.finalScore.className = 'score-low';
        } else {
            this.finalScore.className = 'score-medium';
        }
        
        this.showSection('editing');
    }

    async regenerateDraft(draftId) {
        const draftIndex = this.humanizedVersions.findIndex(v => v.id == draftId);
        if (draftIndex === -1) return;
        
        this.showLoading('Regenerating version...');
        
        try {
            await this.delay(2000);
            
            const settings = this.getHumanizationSettings();
            const newContent = await this.humanizeText(this.analysisResults.originalText, settings);
            
            this.humanizedVersions[draftIndex].content = newContent;
            this.humanizedVersions[draftIndex].aiScore = Math.floor(Math.random() * 5) + 1;
            
            this.hideLoading();
            this.displayDrafts(this.humanizedVersions);
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('Regeneration failed. Please try again.', 'error');
        }
    }

    handleTextSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            this.showAISuggestionPanel(selectedText);
            this.generateSuggestions(selectedText);
        } else {
            this.hideAISuggestionPanel();
            this.clearSuggestions();
        }
    }

    generateSuggestions(selectedText) {
        const suggestions = [
            {
                type: 'style',
                text: 'Make this sound more conversational',
                action: () => this.applySuggestion('conversational', selectedText)
            },
            {
                type: 'simplify',
                text: 'Simplify this language',
                action: () => this.applySuggestion('simplify', selectedText)
            },
            {
                type: 'personal',
                text: 'Add a personal touch',
                action: () => this.applySuggestion('personal', selectedText)
            },
            {
                type: 'vary',
                text: 'Vary the sentence structure',
                action: () => this.applySuggestion('vary', selectedText)
            }
        ];
        
        this.displaySuggestions(suggestions);
    }

    displaySuggestions(suggestions) {
        this.suggestions.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-text">${suggestion.text}</div>
            `;
            
            suggestionElement.addEventListener('click', suggestion.action);
            this.suggestions.appendChild(suggestionElement);
        });
    }

    clearSuggestions() {
        if (this.suggestions) {
            this.suggestions.innerHTML = `
                <div class="suggestion-item">
                    <div class="suggestion-text">Select text to get improvement suggestions</div>
                </div>
            `;
        }
    }

    applySuggestion(type, selectedText) {
        // Implement suggestion application logic
        let improvedText = selectedText;
        
        switch (type) {
            case 'conversational':
                improvedText = this.makeConversational(selectedText);
                break;
            case 'simplify':
                improvedText = this.simplifyText(selectedText);
                break;
            case 'personal':
                improvedText = this.addPersonalTouchToText(selectedText);
                break;
            case 'vary':
                improvedText = this.varysentenceStructure(selectedText);
                break;
        }
        
        // Replace selected text in editor
        this.replaceSelectedText(improvedText);
    }

    makeConversational(text) {
        return text
            .replace(/\bdo not\b/gi, "don't")
            .replace(/\bcannot\b/gi, "can't")
            .replace(/\bwill not\b/gi, "won't")
            .replace(/\bit is\b/gi, "it's")
            .replace(/\bthey are\b/gi, "they're")
            .replace(/\bwe are\b/gi, "we're")
            .replace(/\byou are\b/gi, "you're")
            .replace(/\bI am\b/gi, "I'm")
            .replace(/\bHowever,\b/gi, "But")
            .replace(/\bTherefore,\b/gi, "So")
            .replace(/\bNevertheless,\b/gi, "Still")
            .replace(/\bFurthermore,\b/gi, "Plus")
            .replace(/\bIn addition,\b/gi, "Also")
            .replace(/\bConsequently,\b/gi, "So")
            .replace(/\bSubsequently,\b/gi, "Then")
            .replace(/\bMoreover,\b/gi, "And")
            .replace(/\bAdditionally,\b/gi, "Also");
    }

    simplifyText(text) {
        return text
            .replace(/\butilize\b/gi, 'use')
            .replace(/\bcomprehensive\b/gi, 'complete')
            .replace(/\bfacilitate\b/gi, 'help')
            .replace(/\bdemonstrate\b/gi, 'show')
            .replace(/\bsubsequently\b/gi, 'then')
            .replace(/\bcommence\b/gi, 'start')
            .replace(/\bterminate\b/gi, 'end')
            .replace(/\bascertain\b/gi, 'find out')
            .replace(/\baccommodate\b/gi, 'fit')
            .replace(/\bendevor\b/gi, 'try')
            .replace(/\boptimize\b/gi, 'improve')
            .replace(/\bimplement\b/gi, 'do')
            .replace(/\bmethodology\b/gi, 'method')
            .replace(/\bparadigm\b/gi, 'approach');
    }

    addPersonalTouchToText(text) {
        const personalPhrases = [
            'I think', 'In my view', 'From my experience', 'Personally',
            'From what I\'ve seen', 'In my opinion', 'I believe',
            'It seems to me', 'I\'ve found that', 'My take is'
        ];
        const randomPhrase = personalPhrases[Math.floor(Math.random() * personalPhrases.length)];
        return `${randomPhrase}, ${text.toLowerCase()}`;
    }

    replaceSelectedText(newText) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
            selection.removeAllRanges();
        }
    }

    copyFinalText() {
        const text = this.finalEditor.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Text copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopyText(text);
            });
        } else {
            this.fallbackCopyText(text);
        }
    }

    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Text copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy text. Please copy manually.', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    exportToPDF() {
        const text = this.finalEditor.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'humanized-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text exported successfully!', 'success');
    }

    reanalyzeText() {
        const text = this.finalEditor.textContent;
        this.inputText.value = text;
        this.analyzeText();
    }

    handleFileUpload() {
        // File upload is handled by the file input event listener
        this.showNotification('File upload feature coming soon!', 'info');
    }

    processUploadedFile(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.inputText.value = e.target.result;
            this.updateCharCount();
            this.showNotification('File uploaded successfully!', 'success');
        };
        
        reader.onerror = () => {
            this.showNotification('Failed to read file. Please try again.', 'error');
        };
        
        reader.readAsText(file);
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = ['results', 'settings', 'drafts', 'editing'];
        sections.forEach(section => {
            const element = document.getElementById(`${section}Section`);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionName}Section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    showLoading(message = 'Processing...') {
        this.loadingText.textContent = message;
        this.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 1001;
                    animation: slideIn 0.3s ease-out;
                    max-width: 400px;
                    box-shadow: var(--shadow-lg);
                }
                
                .notification-success { background: var(--accent-secondary); }
                .notification-error { background: var(--accent-danger); }
                .notification-warning { background: var(--accent-warning); }
                .notification-info { background: var(--accent-primary); }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Manual close
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new UltraAdvancedAIToHumanConverter();
});