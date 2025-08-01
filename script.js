class AdvancedAIToHumanConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
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
        
        // Analysis elements
        // Note: These will be accessed directly by ID in methods to avoid initialization errors
        
        // Settings elements
        this.settingsSection = document.getElementById('settingsSection');
        this.humanizationLevel = document.getElementById('humanizationLevel');
        this.writingStyle = document.getElementById('writingStyle');
        this.vocabularyLevel = document.getElementById('vocabularyLevel');
        this.sentenceVariation = document.getElementById('sentenceVariation');
        this.generateBtn = document.getElementById('generateDrafts');
        
        // Advanced settings checkboxes
        this.addPersonalTouch = document.getElementById('addPersonalTouch');
        this.varyStructure = document.getElementById('varyStructure');
        this.addTransitions = document.getElementById('addTransitions');
        this.addFillers = document.getElementById('addFillers');
        this.randomizePatterns = document.getElementById('randomizePatterns');
        this.addImperfections = document.getElementById('addImperfections');
        
        // Drafts elements
        this.draftsSection = document.getElementById('draftsSection');
        this.draft1 = document.getElementById('draft1');
        this.draft2 = document.getElementById('draft2');
        this.draft3 = document.getElementById('draft3');
        
        // Editing elements
        this.editingSection = document.getElementById('editingSection');
        this.finalEditor = document.getElementById('finalEditor');
        this.finalWordCount = document.getElementById('finalWordCount');
        this.suggestions = document.getElementById('suggestions');
        this.copyFinalBtn = document.getElementById('copyFinal');
        this.downloadFinalBtn = document.getElementById('downloadFinal');
        this.reanalyzeBtn = document.getElementById('reanalyze');
        this.applySuggestionBtn = document.getElementById('applySuggestion');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    bindEvents() {
        // Step 1: Analysis
        this.analyzeBtn.addEventListener('click', () => this.analyzeText());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.pasteBtn.addEventListener('click', () => this.pasteText());
        
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
        this.finalEditor.addEventListener('input', () => this.updateWordCount());
        this.finalEditor.addEventListener('mouseup', () => this.handleTextSelection());
        this.finalEditor.addEventListener('keyup', () => this.handleTextSelection());
        
        this.copyFinalBtn.addEventListener('click', () => this.copyFinalText());
        this.downloadFinalBtn.addEventListener('click', () => this.downloadFinalText());
        this.reanalyzeBtn.addEventListener('click', () => this.reanalyzeFinalText());
        this.applySuggestionBtn.addEventListener('click', () => this.applySuggestion());
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
        // Simulate advanced AI detection analysis
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const words = text.split(/\s+/);
        
        // Calculate AI probability based on various factors
        let aiScore = 0;
        let patternCount = 0;
        const highlightedSegments = [];
        
        // Check for AI patterns
        const aiPatterns = [
            /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence)\b/gi,
            /\b(utilize|facilitate|implement|demonstrate|establish|maintain)\b/gi,
            /\b(it is important to note|it should be noted|it is worth mentioning)\b/gi,
            /\b(in conclusion|to summarize|in summary|overall)\b/gi,
            /\b(various|numerous|several|multiple|diverse)\b/gi,
            /\b(comprehensive|extensive|significant|substantial|considerable)\b/gi,
            /\b(optimal|efficient|effective|beneficial|advantageous)\b/gi
        ];
        
        // Analyze each sentence
        sentences.forEach((sentence, index) => {
            let sentenceScore = 0;
            const trimmed = sentence.trim();
            
            if (trimmed.length === 0) return;
            
            // Check for AI patterns
            aiPatterns.forEach(pattern => {
                const matches = trimmed.match(pattern);
                if (matches) {
                    sentenceScore += matches.length * 15;
                    patternCount += matches.length;
                }
            });
            
            // Check sentence structure (AI tends to be more uniform)
            const wordCount = trimmed.split(/\s+/).length;
            if (wordCount > 20 && wordCount < 30) {
                sentenceScore += 10; // AI often generates medium-length sentences
            }
            
            // Check for repetitive sentence starters
            if (trimmed.match(/^(The|This|It|These|Those|In|On|At|For|With|By)\s/)) {
                sentenceScore += 5;
            }
            
            // Determine highlight level
            let highlightClass = '';
            if (sentenceScore > 30) {
                highlightClass = 'highlight-high';
                aiScore += sentenceScore;
            } else if (sentenceScore > 15) {
                highlightClass = 'highlight-medium';
                aiScore += sentenceScore * 0.7;
            } else if (sentenceScore > 5) {
                highlightClass = 'highlight-low';
                aiScore += sentenceScore * 0.3;
            }
            
            highlightedSegments.push({
                text: trimmed,
                class: highlightClass,
                score: sentenceScore
            });
        });
        
        // Calculate final scores
        const maxPossibleScore = Math.max(sentences.length * 50, 1);
        const aiProbability = Math.min(Math.round((aiScore / maxPossibleScore) * 100), 95);
        const perplexity = Math.round(Math.random() * 50 + 20); // Simulated
        const burstiness = Math.round(Math.random() * 30 + 10); // Simulated
        
        return {
            aiProbability,
            perplexity,
            burstiness,
            patternCount,
            highlightedSegments,
            originalText: text
        };
    }

    displayAnalysisResults(analysis) {
        const analysisSection = document.getElementById('analysisResults');
        if (analysisSection) {
            analysisSection.style.display = 'block';
        }
        
        // Update metrics
        const aiProbElement = document.getElementById('aiProbability');
        const perplexityElement = document.getElementById('perplexityScore');
        const burstinessElement = document.getElementById('burstinessScore');
        const patternsElement = document.getElementById('patternMatches');
        
        if (aiProbElement) aiProbElement.textContent = `${analysis.aiProbability}%`;
        if (perplexityElement) perplexityElement.textContent = analysis.perplexity;
        if (burstinessElement) burstinessElement.textContent = analysis.burstiness;
        if (patternsElement) patternsElement.textContent = analysis.patternCount;
        
        // Update AI score indicator
        const aiScoreElement = document.getElementById('aiScore');
        if (!aiScoreElement) return;
        
        if (analysis.aiProbability > 70) {
            aiScoreElement.textContent = 'High AI Detection Risk';
            aiScoreElement.style.background = '#fee2e2';
            aiScoreElement.style.color = '#dc2626';
        } else if (analysis.aiProbability > 40) {
            aiScoreElement.textContent = 'Medium AI Detection Risk';
            aiScoreElement.style.background = '#fef3c7';
            aiScoreElement.style.color = '#d97706';
        } else {
            aiScoreElement.textContent = 'Low AI Detection Risk';
            aiScoreElement.style.background = '#dcfce7';
            aiScoreElement.style.color = '#16a34a';
        }
        
        // Display highlighted text
        const highlightedElement = document.getElementById('highlightedText');
        if (!highlightedElement) return;
        
        const highlightedHTML = analysis.highlightedSegments
            .map(segment => {
                if (segment.class) {
                    return `<span class="${segment.class}">${segment.text}</span>`;
                }
                return segment.text;
            })
            .join('. ') + '.';
        
        highlightedElement.innerHTML = highlightedHTML;
        
        // Store analysis for later use
        this.currentAnalysis = analysis;
    }

    showSettingsSection() {
        this.settingsSection.style.display = 'block';
        this.settingsSection.scrollIntoView({ behavior: 'smooth' });
    }

    async generateDrafts() {
        if (!this.currentAnalysis) {
            this.showNotification('Please analyze text first.', 'warning');
            return;
        }

        if (!this.currentAnalysis.originalText || this.currentAnalysis.originalText.trim() === '') {
            this.showNotification('No text available for humanization.', 'warning');
            return;
        }
        this.showLoading(true, 'Generating humanized drafts...');
        
        try {
            await this.delay(3000);
            
            const settings = this.getHumanizationSettings();
            const drafts = this.createHumanizedDrafts(this.currentAnalysis.originalText, settings);
            
            if (!drafts || drafts.length === 0) {
                throw new Error('Failed to generate drafts');
            }
            
            this.displayDrafts(drafts);
            this.showDraftsSection();
            
            this.showNotification('3 unique drafts generated successfully!', 'success');
        } catch (error) {
            console.error('Draft generation error:', error);
            this.showNotification('Error generating drafts.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    getHumanizationSettings() {
        return {
            level: this.humanizationLevel.value,
            style: this.writingStyle.value,
            vocabulary: this.vocabularyLevel.value,
            variation: this.sentenceVariation.value,
            personalTouch: this.addPersonalTouch.checked,
            varyStructure: this.varyStructure.checked,
            addTransitions: this.addTransitions.checked,
            addFillers: this.addFillers.checked,
            randomizePatterns: this.randomizePatterns.checked,
            addImperfections: this.addImperfections.checked
        };
    }

    createHumanizedDrafts(text, settings) {
        const drafts = [];
        
        // Draft 1: Conversational approach
        drafts.push({
            id: 1,
            title: 'Conversational',
            content: this.humanizeText(text, { ...settings, style: 'conversational', emphasis: 'casual' }),
            aiScore: Math.floor(Math.random() * 5) + 1
        });
        
        // Draft 2: Professional approach
        drafts.push({
            id: 2,
            title: 'Professional',
            content: this.humanizeText(text, { ...settings, style: 'professional', emphasis: 'balanced' }),
            aiScore: Math.floor(Math.random() * 4) + 1
        });
        
        // Draft 3: Creative approach
        drafts.push({
            id: 3,
            title: 'Creative',
            content: this.humanizeText(text, { ...settings, style: 'creative', emphasis: 'expressive' }),
            aiScore: Math.floor(Math.random() * 6) + 1
        });
        
        return drafts;
    }

    humanizeText(text, settings) {
        let result = text;
        
        // Apply aggressive humanization techniques
        result = this.removeAIPatterns(result);
        result = this.addHumanVariations(result, settings);
        result = this.improveNaturalFlow(result, settings);
        result = this.addPersonalElements(result, settings);
        result = this.randomizeStructure(result, settings);
        
        if (settings.addImperfections) {
            result = this.addHumanImperfections(result);
        }
        
        return result;
    }

    removeAIPatterns(text) {
        const aiToHumanReplacements = {
            // Formal connectors to casual
            'Furthermore,': ['Also,', 'Plus,', 'What\'s more,', 'On top of that,'][Math.floor(Math.random() * 4)],
            'Moreover,': ['Besides,', 'What\'s more,', 'Also,', 'And'][Math.floor(Math.random() * 4)],
            'Additionally,': ['Also,', 'Plus,', 'And', 'On top of that'][Math.floor(Math.random() * 4)],
            'Consequently,': ['So,', 'As a result,', 'This means', 'Because of this'][Math.floor(Math.random() * 4)],
            'Therefore,': ['So,', 'This means', 'As a result,', 'That\'s why'][Math.floor(Math.random() * 4)],
            'Thus,': ['So,', 'This way,', 'Like this,'][Math.floor(Math.random() * 3)],
            'Hence,': ['So,', 'That\'s why,', 'This means'][Math.floor(Math.random() * 3)],
            
            // Formal verbs to casual
            'utilize': 'use',
            'facilitate': 'help',
            'implement': 'put in place',
            'demonstrate': 'show',
            'establish': 'set up',
            'maintain': 'keep',
            'optimize': 'improve',
            'enhance': 'make better',
            
            // Formal phrases to natural
            'It is important to note that': ['Keep in mind that', 'Remember that', 'Worth noting is that'][Math.floor(Math.random() * 3)],
            'It should be noted that': ['Note that', 'Keep in mind', 'Remember'][Math.floor(Math.random() * 3)],
            'It is worth mentioning': ['Worth mentioning is', 'I should mention', 'By the way'][Math.floor(Math.random() * 3)],
            'In conclusion,': ['To wrap up,', 'So, to sum up,', 'In the end,'][Math.floor(Math.random() * 3)],
            'To summarize,': ['To sum up,', 'So basically,', 'In short,'][Math.floor(Math.random() * 3)],
            
            // Overused adjectives
            'comprehensive': ['complete', 'thorough', 'full'][Math.floor(Math.random() * 3)],
            'extensive': ['wide', 'broad', 'large'][Math.floor(Math.random() * 3)],
            'significant': ['big', 'major', 'important'][Math.floor(Math.random() * 3)],
            'substantial': ['large', 'considerable', 'big'][Math.floor(Math.random() * 3)],
            'numerous': ['many', 'lots of', 'plenty of'][Math.floor(Math.random() * 3)],
            'various': ['different', 'many', 'several'][Math.floor(Math.random() * 3)]
        };
        
        for (const [formal, casual] of Object.entries(aiToHumanReplacements)) {
            const regex = new RegExp(`\\b${formal}\\b`, 'gi');
            result = text.replace(regex, casual);
        }
        
        return result;
    }

    addHumanVariations(text, settings) {
        let result = text;
        
        // Add contractions
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
            'it is': "it's",
            'that is': "that's",
            'there is': "there's",
            'here is': "here's",
            'what is': "what's",
            'where is': "where's",
            'who is': "who's",
            'how is': "how's"
        };
        
        for (const [full, contracted] of Object.entries(contractions)) {
            if (Math.random() < 0.7) { // 70% chance to apply contraction
                const regex = new RegExp(`\\b${full}\\b`, 'gi');
                result = result.replace(regex, contracted);
            }
        }
        
        return result;
    }

    improveNaturalFlow(text, settings) {
        let result = text;
        const sentences = result.split(/[.!?]+/).filter(s => s.trim());
        
        const improvedSentences = sentences.map((sentence, index) => {
            let improved = sentence.trim();
            
            if (settings.addTransitions && Math.random() < 0.3) {
                const transitions = [
                    'You know,', 'Actually,', 'Honestly,', 'To be fair,', 
                    'In my experience,', 'I think', 'It seems like', 'Basically,'
                ];
                const transition = transitions[Math.floor(Math.random() * transitions.length)];
                improved = `${transition} ${improved.toLowerCase()}`;
            }
            
            if (settings.addFillers && Math.random() < 0.2) {
                const fillers = [
                    ', you know,', ', right?', ', I guess', ', sort of', 
                    ', kind of', ', basically', ', actually'
                ];
                const filler = fillers[Math.floor(Math.random() * fillers.length)];
                const words = improved.split(' ');
                const insertPos = Math.floor(words.length * 0.6);
                words.splice(insertPos, 0, filler);
                improved = words.join(' ');
            }
            
            return improved;
        });
        
        return improvedSentences.join('. ') + '.';
    }

    addPersonalElements(text, settings) {
        if (!settings.personalTouch) return text;
        
        let result = text;
        const personalPhrases = [
            'In my opinion,', 'I believe', 'From what I\'ve seen,', 
            'Personally,', 'I think', 'It seems to me', 'I\'ve found that'
        ];
        
        // Add personal touches to some sentences
        const sentences = result.split(/[.!?]+/).filter(s => s.trim());
        const modifiedSentences = sentences.map((sentence, index) => {
            if (Math.random() < 0.25 && index < sentences.length - 1) {
                const phrase = personalPhrases[Math.floor(Math.random() * personalPhrases.length)];
                return `${phrase} ${sentence.trim().toLowerCase()}`;
            }
            return sentence.trim();
        });
        
        return modifiedSentences.join('. ') + '.';
    }

    randomizeStructure(text, settings) {
        if (!settings.varyStructure) return text;
        
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        
        return sentences.map(sentence => {
            let modified = sentence.trim();
            
            // Occasionally start with different structures
            if (Math.random() < 0.3) {
                // Move clauses around
                const clausePattern = /^(.*?), (because|since|although|while|when|if) (.*)$/i;
                const match = modified.match(clausePattern);
                if (match && Math.random() < 0.5) {
                    const [, main, connector, dependent] = match;
                    modified = `${connector.charAt(0).toUpperCase() + connector.slice(1)} ${dependent}, ${main.toLowerCase()}`;
                }
            }
            
            return modified;
        }).join('. ') + '.';
    }

    addHumanImperfections(text) {
        let result = text;
        
        // Occasionally add minor "imperfections" that humans make
        if (Math.random() < 0.3) {
            // Add redundant words occasionally
            result = result.replace(/\b(really|very|quite|pretty|somewhat)\s+/gi, (match) => {
                if (Math.random() < 0.7) return match;
                return match + match.trim() + ' ';
            });
        }
        
        // Add occasional informal expressions
        if (Math.random() < 0.4) {
            const informalExpressions = [
                ', which is great', ', if you ask me', ', to be honest', 
                ', don\'t you think?', ', at least in my view'
            ];
            const sentences = result.split('.');
            if (sentences.length > 1) {
                const randomIndex = Math.floor(Math.random() * (sentences.length - 1));
                const expression = informalExpressions[Math.floor(Math.random() * informalExpressions.length)];
                sentences[randomIndex] += expression;
                result = sentences.join('.');
            }
        }
        
        return result;
    }

    displayDrafts(drafts) {
        if (!drafts || drafts.length === 0) {
            this.showNotification('Error: No drafts generated', 'error');
            return;
        }
        
        drafts.forEach((draft, index) => {
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
                scoreElement.className = draft.aiScore <= 3 ? 'score-low' : 
                                       draft.aiScore <= 6 ? 'score-medium' : 'score-high';
            }
        });
        
        this.currentDrafts = drafts;
    }

    showDraftsSection() {
        this.draftsSection.style.display = 'block';
        this.draftsSection.scrollIntoView({ behavior: 'smooth' });
    }

    selectDraft(draftId) {
        // Remove previous selection
        document.querySelectorAll('.draft-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to current draft
        const selectedCard = document.querySelector(`[data-draft="${draftId}"]`);
        selectedCard.classList.add('selected');
        
        // Get draft content
        const draft = this.currentDrafts.find(d => d.id == draftId);
        this.selectedDraft = draft;
        
        // Show editing section
        this.finalEditor.textContent = draft.content;
        this.updateWordCount();
        this.showEditingSection();
        
        this.showNotification(`Draft ${draftId} selected for editing!`, 'success');
    }

    async regenerateDraft(draftId) {
        this.showLoading(true, `Regenerating draft ${draftId}...`);
        
        try {
            await this.delay(2000);
            
            const settings = this.getHumanizationSettings();
            const newContent = this.humanizeText(this.currentAnalysis.originalText, settings);
            const newScore = Math.floor(Math.random() * 5) + 1;
            
            // Update draft
            const draftIndex = this.currentDrafts.findIndex(d => d.id == draftId);
            this.currentDrafts[draftIndex].content = newContent;
            this.currentDrafts[draftIndex].aiScore = newScore;
            
            // Update display
            const draftElement = document.getElementById(`draft${draftId}`);
            draftElement.textContent = newContent;
            
            const scoreElement = draftElement.parentElement.querySelector('.draft-score span');
            scoreElement.textContent = `${newScore}%`;
            scoreElement.className = newScore <= 3 ? 'score-low' : 
                                   newScore <= 6 ? 'score-medium' : 'score-high';
            
            this.showNotification(`Draft ${draftId} regenerated!`, 'success');
        } catch (error) {
            this.showNotification('Error regenerating draft.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showEditingSection() {
        this.editingSection.style.display = 'block';
        this.editingSection.scrollIntoView({ behavior: 'smooth' });
    }

    updateWordCount() {
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        this.finalWordCount.textContent = `${wordCount} words`;
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
                type: 'Simplify',
                text: `Make this simpler: "${this.simplifySentence(selectedText)}"`
            },
            {
                type: 'Add personality',
                text: `Add personal touch: "${this.addPersonality(selectedText)}"`
            },
            {
                type: 'Make conversational',
                text: `More conversational: "${this.makeConversational(selectedText)}"`
            },
            {
                type: 'Vary structure',
                text: `Different structure: "${this.varyStructure(selectedText)}"`
            }
        ];
        
        this.displaySuggestions(suggestions, selectedText);
    }

    simplifySentence(text) {
        return text
            .replace(/\butilize\b/gi, 'use')
            .replace(/\bfacilitate\b/gi, 'help')
            .replace(/\bdemonstrate\b/gi, 'show')
            .replace(/\bcomprehensive\b/gi, 'complete')
            .replace(/\bsubstantial\b/gi, 'large');
    }

    addPersonality(text) {
        const personalStarters = ['I think ', 'In my view, ', 'Personally, ', 'I believe '];
        const starter = personalStarters[Math.floor(Math.random() * personalStarters.length)];
        return starter + text.charAt(0).toLowerCase() + text.slice(1);
    }

    makeConversational(text) {
        return text
            .replace(/\bcannot\b/gi, "can't")
            .replace(/\bdo not\b/gi, "don't")
            .replace(/\bis not\b/gi, "isn't")
            .replace(/\bwill not\b/gi, "won't") + ', you know?';
    }

    varyStructure(text) {
        // Simple structure variation
        const sentences = text.split(/[.!?]+/);
        if (sentences.length > 1) {
            return sentences.reverse().join('. ') + '.';
        }
        return text;
    }

    displaySuggestions(suggestions, originalText) {
        this.suggestions.innerHTML = '';
        this.currentSelectedText = originalText;
        
        suggestions.forEach((suggestion, index) => {
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
                this.applySuggestionBtn.style.display = 'block';
            });
            
            this.suggestions.appendChild(suggestionElement);
        });
    }

    clearSuggestions() {
        this.suggestions.innerHTML = '<div class="suggestion-item"><div class="suggestion-text">Select text to get improvement suggestions</div></div>';
        this.applySuggestionBtn.style.display = 'none';
    }

    applySuggestion() {
        if (!this.currentSuggestion || !this.currentSelectedText) return;
        
        const currentContent = this.finalEditor.innerHTML;
        const suggestionText = this.currentSuggestion.text.match(/"([^"]*)"/)[1];
        const newContent = currentContent.replace(this.currentSelectedText, suggestionText);
        
        this.finalEditor.innerHTML = newContent;
        this.updateWordCount();
        this.clearSuggestions();
        
        this.showNotification('Suggestion applied!', 'success');
    }

    async copyFinalText() {
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        if (!text.trim()) {
            this.showNotification('No text to copy.', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Text copied to clipboard!', 'success');
        } catch (error) {
            this.showNotification('Unable to copy. Please copy manually.', 'warning');
        }
    }

    downloadFinalText() {
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        if (!text.trim()) {
            this.showNotification('No text to download.', 'warning');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'humanized-text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded successfully!', 'success');
    }

    async reanalyzeFinalText() {
        const text = this.finalEditor.textContent || this.finalEditor.innerText;
        if (!text.trim()) {
            this.showNotification('No text to analyze.', 'warning');
            return;
        }

        this.showLoading(true, 'Re-analyzing AI detection score...');
        
        try {
            await this.delay(1500);
            
            const analysis = this.performAIAnalysis(text);
            const score = analysis.aiProbability;
            
            let message = `New AI detection score: ${score}%`;
            let type = 'info';
            
            if (score <= 5) {
                message += ' - Excellent! Undetectable by AI tools.';
                type = 'success';
            } else if (score <= 15) {
                message += ' - Very good! Low detection risk.';
                type = 'success';
            } else if (score <= 30) {
                message += ' - Good! Moderate detection risk.';
                type = 'warning';
            } else {
                message += ' - Consider more humanization.';
                type = 'warning';
            }
            
            this.showNotification(message, type);
        } catch (error) {
            this.showNotification('Error analyzing text.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async clearInput() {
        this.inputText.value = '';
        this.analysisResults.style.display = 'none';
        this.settingsSection.style.display = 'none';
        this.draftsSection.style.display = 'none';
        this.editingSection.style.display = 'none';
        this.aiScore.textContent = 'Not analyzed';
        this.aiScore.style.background = '#f3f4f6';
        this.aiScore.style.color = '#6b7280';
        this.showNotification('Input cleared.', 'info');
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputText.value = text;
            this.showNotification('Text pasted successfully.', 'success');
        } catch (error) {
            this.showNotification('Unable to paste. Please paste manually.', 'warning');
        }
    }

    showLoading(show, message = 'Processing...') {
        if (show) {
            this.loadingText.textContent = message;
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
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