class AIToHumanConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateWordCounts();
    }

    initializeElements() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.inputWordCount = document.getElementById('inputWordCount');
        this.outputWordCount = document.getElementById('outputWordCount');
        this.convertBtn = document.getElementById('convertText');
        this.clearBtn = document.getElementById('clearInput');
        this.pasteBtn = document.getElementById('pasteText');
        this.copyBtn = document.getElementById('copyOutput');
        this.downloadBtn = document.getElementById('downloadOutput');
        this.regenerateBtn = document.getElementById('regenerate');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Settings
        this.humanizationLevel = document.getElementById('humanizationLevel');
        this.writingStyle = document.getElementById('writingStyle');
        this.addPersonalTouch = document.getElementById('addPersonalTouch');
        this.varyStructure = document.getElementById('varyStructure');
    }

    bindEvents() {
        this.inputText.addEventListener('input', () => this.updateWordCounts());
        this.outputText.addEventListener('input', () => this.updateWordCounts());
        
        this.convertBtn.addEventListener('click', () => this.convertText());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.pasteBtn.addEventListener('click', () => this.pasteText());
        this.copyBtn.addEventListener('click', () => this.copyOutput());
        this.downloadBtn.addEventListener('click', () => this.downloadOutput());
        this.regenerateBtn.addEventListener('click', () => this.regenerateText());
    }

    updateWordCounts() {
        const inputWords = this.countWords(this.inputText.value);
        const outputWords = this.countWords(this.outputText.textContent);
        
        this.inputWordCount.textContent = `${inputWords} words`;
        this.outputWordCount.textContent = `${outputWords} words`;
    }

    countWords(text) {
        return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    }

    async convertText() {
        const inputValue = this.inputText.value.trim();
        
        if (!inputValue) {
            this.showNotification('Please enter some text to convert.', 'warning');
            return;
        }

        this.showLoading(true);
        this.convertBtn.disabled = true;

        try {
            // Simulate processing time
            await this.delay(2000);
            
            const convertedText = this.humanizeText(inputValue);
            this.outputText.textContent = convertedText;
            this.regenerateBtn.disabled = false;
            this.updateWordCounts();
            
            this.showNotification('Text successfully converted!', 'success');
        } catch (error) {
            this.showNotification('An error occurred during conversion.', 'error');
            console.error('Conversion error:', error);
        } finally {
            this.showLoading(false);
            this.convertBtn.disabled = false;
        }
    }

    humanizeText(text) {
        const level = this.humanizationLevel.value;
        const style = this.writingStyle.value;
        const personalTouch = this.addPersonalTouch.checked;
        const varyStructure = this.varyStructure.checked;

        let result = text;

        // Apply humanization based on level
        switch (level) {
            case 'light':
                result = this.applyLightHumanization(result);
                break;
            case 'moderate':
                result = this.applyModerateHumanization(result);
                break;
            case 'heavy':
                result = this.applyHeavyHumanization(result);
                break;
        }

        // Apply writing style
        result = this.applyWritingStyle(result, style);

        // Add personal touches if enabled
        if (personalTouch) {
            result = this.addPersonalTouches(result);
        }

        // Vary sentence structure if enabled
        if (varyStructure) {
            result = this.varySentenceStructure(result);
        }

        return result;
    }

    applyLightHumanization(text) {
        // Light changes: basic contractions and casual words
        const replacements = {
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
            'Furthermore,': 'Also,',
            'Additionally,': 'Plus,',
            'Moreover,': 'What\'s more,',
            'Therefore,': 'So,',
            'Consequently,': 'As a result,',
            'In conclusion,': 'To wrap up,',
            'utilize': 'use',
            'facilitate': 'help',
            'demonstrate': 'show',
            'implement': 'put in place'
        };

        return this.applyReplacements(text, replacements);
    }

    applyModerateHumanization(text) {
        let result = this.applyLightHumanization(text);
        
        // Add more natural transitions and expressions
        const transitions = {
            'However,': ['But,', 'Though,', 'On the other hand,'][Math.floor(Math.random() * 3)],
            'In addition,': ['Also,', 'Plus,', 'What\'s more,'][Math.floor(Math.random() * 3)],
            'For example,': ['For instance,', 'Take this case:', 'Here\'s an example:'][Math.floor(Math.random() * 3)],
            'It is important to note that': ['Worth mentioning is that', 'Keep in mind that', 'Remember that'][Math.floor(Math.random() * 3)],
            'It should be noted that': ['Note that', 'Keep in mind', 'Remember'][Math.floor(Math.random() * 3)]
        };

        result = this.applyReplacements(result, transitions);
        
        // Add some filler words occasionally
        result = result.replace(/\. ([A-Z])/g, (match, letter) => {
            if (Math.random() < 0.3) {
                const fillers = ['. Well, ', '. Now, ', '. So, ', '. Actually, '];
                return fillers[Math.floor(Math.random() * fillers.length)] + letter.toLowerCase();
            }
            return match;
        });

        return result;
    }

    applyHeavyHumanization(text) {
        let result = this.applyModerateHumanization(text);
        
        // Add more conversational elements
        const conversationalPhrases = {
            'This is because': ['The reason is', 'Here\'s why', 'The thing is'],
            'It is clear that': ['Obviously', 'Clearly', 'It\'s pretty clear that'],
            'Research shows': ['Studies have found', 'Research tells us', 'We know from research'],
            'Studies indicate': ['Research suggests', 'Studies show', 'Evidence points to'],
            'It can be concluded': ['We can conclude', 'The bottom line is', 'What this means is']
        };

        for (const [formal, casual] of Object.entries(conversationalPhrases)) {
            const replacement = casual[Math.floor(Math.random() * casual.length)];
            result = result.replace(new RegExp(formal, 'g'), replacement);
        }

        // Add occasional questions
        result = result.replace(/\. ([A-Z][^.!?]*[.!?])/g, (match, sentence) => {
            if (Math.random() < 0.2) {
                return '. But ' + sentence.charAt(0).toLowerCase() + sentence.slice(1, -1) + ', right?';
            }
            return match;
        });

        return result;
    }

    applyWritingStyle(text, style) {
        switch (style) {
            case 'casual':
                return this.makeCasual(text);
            case 'professional':
                return this.makeProfessional(text);
            case 'academic':
                return this.makeAcademic(text);
            case 'creative':
                return this.makeCreative(text);
            default:
                return text;
        }
    }

    makeCasual(text) {
        const casualReplacements = {
            'very important': 'super important',
            'extremely': 'really',
            'significant': 'big',
            'numerous': 'lots of',
            'substantial': 'pretty big',
            'essential': 'key',
            'optimal': 'best',
            'commence': 'start',
            'terminate': 'end'
        };
        return this.applyReplacements(text, casualReplacements);
    }

    makeProfessional(text) {
        const professionalReplacements = {
            'really good': 'excellent',
            'pretty bad': 'suboptimal',
            'lots of': 'numerous',
            'big': 'significant',
            'super': 'very',
            'awesome': 'outstanding',
            'terrible': 'inadequate'
        };
        return this.applyReplacements(text, professionalReplacements);
    }

    makeAcademic(text) {
        const academicReplacements = {
            'shows': 'demonstrates',
            'proves': 'establishes',
            'big': 'substantial',
            'small': 'minimal',
            'good': 'favorable',
            'bad': 'unfavorable'
        };
        return this.applyReplacements(text, academicReplacements);
    }

    makeCreative(text) {
        // Add more descriptive language and varied sentence starters
        let result = text;
        
        // Add creative sentence starters occasionally
        result = result.replace(/^([A-Z][^.!?]*[.!?])/gm, (match) => {
            if (Math.random() < 0.3) {
                const starters = ['Interestingly, ', 'Remarkably, ', 'Surprisingly, ', 'Notably, '];
                return starters[Math.floor(Math.random() * starters.length)] + match.charAt(0).toLowerCase() + match.slice(1);
            }
            return match;
        });

        return result;
    }

    addPersonalTouches(text) {
        const personalPhrases = [
            'In my experience, ',
            'I\'ve found that ',
            'From what I\'ve seen, ',
            'Personally, I think ',
            'I believe ',
            'It seems to me that '
        ];

        // Add personal touches to some sentences
        return text.replace(/^([A-Z][^.!?]*[.!?])/gm, (match) => {
            if (Math.random() < 0.2) {
                const phrase = personalPhrases[Math.floor(Math.random() * personalPhrases.length)];
                return phrase + match.charAt(0).toLowerCase() + match.slice(1);
            }
            return match;
        });
    }

    varySentenceStructure(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        
        return sentences.map((sentence, index) => {
            let trimmed = sentence.trim();
            if (!trimmed) return sentence;

            // Occasionally start with different structures
            if (Math.random() < 0.3) {
                // Move dependent clauses to the beginning sometimes
                const clausePatterns = [
                    /^(.*?), (because|since|although|while|when|if) (.*)$/i,
                    /^(.*?) (because|since|although|while|when|if) (.*)$/i
                ];

                for (const pattern of clausePatterns) {
                    const match = trimmed.match(pattern);
                    if (match) {
                        const [, main, connector, dependent] = match;
                        if (Math.random() < 0.5) {
                            trimmed = `${connector.charAt(0).toUpperCase() + connector.slice(1)} ${dependent}, ${main.toLowerCase()}`;
                        }
                        break;
                    }
                }
            }

            return trimmed + (index < sentences.length - 1 ? '. ' : '.');
        }).join('');
    }

    applyReplacements(text, replacements) {
        let result = text;
        for (const [original, replacement] of Object.entries(replacements)) {
            const regex = new RegExp(`\\b${original}\\b`, 'gi');
            result = result.replace(regex, replacement);
        }
        return result;
    }

    async clearInput() {
        this.inputText.value = '';
        this.updateWordCounts();
        this.showNotification('Input cleared.', 'info');
    }

    async pasteText() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputText.value = text;
            this.updateWordCounts();
            this.showNotification('Text pasted successfully.', 'success');
        } catch (error) {
            this.showNotification('Unable to paste. Please paste manually.', 'warning');
        }
    }

    async copyOutput() {
        const text = this.outputText.textContent;
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

    downloadOutput() {
        const text = this.outputText.textContent;
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

    async regenerateText() {
        if (!this.inputText.value.trim()) {
            this.showNotification('No input text to regenerate from.', 'warning');
            return;
        }

        this.showLoading(true);
        this.regenerateBtn.disabled = true;

        try {
            await this.delay(1500);
            const convertedText = this.humanizeText(this.inputText.value);
            this.outputText.textContent = convertedText;
            this.updateWordCounts();
            this.showNotification('Text regenerated with new variations!', 'success');
        } catch (error) {
            this.showNotification('Error regenerating text.', 'error');
        } finally {
            this.showLoading(false);
            this.regenerateBtn.disabled = false;
        }
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.remove('hidden');
        } else {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
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
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIToHumanConverter();
});