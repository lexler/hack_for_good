class FinishEvaluationApp {
    constructor() {
        this.counts = {};
        this.isSkipCoding = false;
        this.isTeachingSession = null;
        this.questionAnswers = {
            daysPracticed: null,
            didNotCollect: false,
            ecbiScore: null,
            didNotAdminister: false
        };
        this.defaultLabels = {
            1: { code: 'TA', description: 'Neutral Talk' },
            2: { code: 'BD', description: 'Behavior Description' },
            3: { code: 'RF', description: 'Reflection' },
            4: { code: 'LP', description: 'Labeled Praise' },
            6: { code: 'UP', description: 'Unlabeled Praise' },
            7: { code: 'QU', description: 'Question' },
            8: { code: 'CM', description: 'Command' },
            9: { code: 'NTA', description: 'Negative Talk' }
        };
        
        this.labels = this.parseCustomLabels() || this.defaultLabels;
        
        // Check if we're in test mode
        this.isTestMode = new URLSearchParams(window.location.search).get('testMode') === 'true';
        
        this.init();
    }
    
    init() {
        this.parseUrlParams();
        this.bindEvents();
        
        if (this.isSkipCoding) {
            document.getElementById('teaching-session-modal').classList.add('show');
            document.getElementById('combined-modal').classList.remove('show');
        } else {
            this.populateNormalSummary();
        }
    }
    
    parseCustomLabels() {
        const urlParams = new URLSearchParams(window.location.search);
        const customLabels = {};
        let hasCustomLabels = false;
        
        // Map btn1-btn8 to data-id values (1,2,3,4,6,7,8,9)
        const buttonMapping = {
            'btn1': 1, 'btn2': 2, 'btn3': 3, 'btn4': 4,
            'btn5': 6, 'btn6': 7, 'btn7': 8, 'btn8': 9
        };
        
        for (const [param, dataId] of Object.entries(buttonMapping)) {
            const value = urlParams.get(param);
            if (value && value.includes(':')) {
                const [code, ...descriptionParts] = value.split(':');
                const description = descriptionParts.join(':').trim();
                
                if (code && description) {
                    customLabels[dataId] = {
                        code: code.trim(),
                        description: description
                    };
                    hasCustomLabels = true;
                }
            }
        }
        
        // Fill in missing labels with defaults
        if (hasCustomLabels) {
            for (const dataId of [1, 2, 3, 4, 6, 7, 8, 9]) {
                if (!customLabels[dataId]) {
                    customLabels[dataId] = this.defaultLabels[dataId];
                }
            }
            return customLabels;
        }
        
        return null;
    }
    
    parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        // Parse counts
        [1, 2, 3, 4, 6, 7, 8, 9].forEach(id => {
            const count = params.get(`c${id}`);
            if (count !== null) {
                this.counts[id] = parseInt(count) || 0;
            }
        });
        
        // Parse skip coding flag
        this.isSkipCoding = params.get('skip') === 'true';
    }
    
    bindEvents() {
        document.getElementById('combined-return-btn').addEventListener('click', () => {
            this.returnToCounter();
        });
        
        document.getElementById('copy-email-btn').addEventListener('click', () => {
            this.processCombinedForm();
        });
        
        document.getElementById('did-not-collect').addEventListener('change', (e) => {
            this.toggleDaysInput(e.target.checked);
        });
        
        document.getElementById('did-not-administer').addEventListener('change', (e) => {
            this.toggleScoreInput(e.target.checked);
        });
        
        document.getElementById('teaching-yes-btn').addEventListener('click', () => {
            this.handleTeachingSessionAnswer(true);
        });
        
        document.getElementById('teaching-no-btn').addEventListener('click', () => {
            this.handleTeachingSessionAnswer(false);
        });
    }
    
    handleTeachingSessionAnswer(isTeaching) {
        this.isTeachingSession = isTeaching;
        document.getElementById('teaching-session-modal').classList.remove('show');
        this.showSkipCodingModal();
    }
    
    showSkipCodingModal() {
        const sessionType = this.isTeachingSession ? 'Teaching Session only' : 'Alternative Session';
        this.populateAlternativeSummary(sessionType);
        this.resetQuestionForm();
        document.getElementById('combined-modal').classList.add('show');
    }
    
    populateNormalSummary() {
        const summaryList = document.getElementById('summary-list');
        summaryList.innerHTML = '';
        
        Object.keys(this.counts).forEach(id => {
            const labelData = this.labels[id];
            const displayLabel = labelData ? `${labelData.code} (${labelData.description})` : `Button ${id}`;
            
            const item = document.createElement('div');
            item.className = 'summary-item';
            item.innerHTML = `
                <span class="summary-label">${displayLabel}:</span>
                <span class="summary-count">${this.counts[id]}</span>
            `;
            summaryList.appendChild(item);
        });
    }
    
    populateAlternativeSummary(sessionType) {
        const summaryList = document.getElementById('summary-list');
        summaryList.innerHTML = `
            <div class="summary-item alternative-session">
                <span class="summary-label">${sessionType}</span>
            </div>
        `;
    }
    
    resetQuestionForm() {
        document.getElementById('days-practiced').value = '';
        document.getElementById('did-not-collect').checked = false;
        document.getElementById('ecbi-score').value = '';
        document.getElementById('did-not-administer').checked = false;
        document.getElementById('days-practiced').disabled = false;
        document.getElementById('ecbi-score').disabled = false;
        document.getElementById('validation-error').style.display = 'none';
    }
    
    toggleDaysInput(isChecked) {
        const input = document.getElementById('days-practiced');
        input.disabled = isChecked;
        if (isChecked) {
            input.value = '';
            this.questionAnswers.daysPracticed = null;
        }
        this.questionAnswers.didNotCollect = isChecked;
    }
    
    toggleScoreInput(isChecked) {
        const input = document.getElementById('ecbi-score');
        input.disabled = isChecked;
        if (isChecked) {
            input.value = '';
            this.questionAnswers.ecbiScore = null;
        }
        this.questionAnswers.didNotAdminister = isChecked;
    }
    
    validateQuestions() {
        const daysInput = document.getElementById('days-practiced');
        const ecbiInput = document.getElementById('ecbi-score');
        const didNotCollect = document.getElementById('did-not-collect').checked;
        const didNotAdminister = document.getElementById('did-not-administer').checked;
        const errorDiv = document.getElementById('validation-error');
        
        // Validate days practiced
        if (!didNotCollect) {
            const days = parseInt(daysInput.value);
            if (isNaN(days) || days < 0 || days > 7) {
                errorDiv.textContent = 'Please enter days practiced (0-7) or check "Did not collect"';
                errorDiv.style.display = 'block';
                return false;
            }
            this.questionAnswers.daysPracticed = days;
        }
        
        // Validate ECBI score
        if (!didNotAdminister) {
            const score = parseInt(ecbiInput.value);
            if (isNaN(score) || score < 0) {
                errorDiv.textContent = 'Please enter ECBI/WACB score or check "Did not administer"';
                errorDiv.style.display = 'block';
                return false;
            }
            this.questionAnswers.ecbiScore = score;
        }
        
        errorDiv.style.display = 'none';
        return true;
    }
    
    processCombinedForm() {
        if (!this.validateQuestions()) {
            return;
        }
        
        // Generate clipboard data (counts + questions)
        const clipboardData = this.generateClipboardData();
        this.copyToClipboard(clipboardData);
        this.showToast('Results copied! Opening email client...');
        
        // Generate email content
        const emailContent = this.generateEmailContent();
        const subject = '[PCIT Intermediary]';
        const recipient = 'RACHEL.4.WILSON@cuanschutz.edu';
        
        if (this.isTestMode) {
            // In test mode, expose email data for testing
            window.testEmailData = {
                recipient: recipient,
                subject: subject,
                body: emailContent,
                clipboard: clipboardData
            };
            console.log('Test mode: Email data captured', window.testEmailData);
        } else {
            // Normal mode: send email
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(emailContent);
            setTimeout(() => {
                window.location.href = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
            }, 500);
        }
    }
    
    generateClipboardData() {
        // Output just the behavioral counts, one per line
        let data = '';
        
        if (this.isSkipCoding) {
            // For skip coding, return empty counts
            data = '0\n0\n0\n0\n0\n0\n0\n0';
        } else {
            // Add all the behavioral counts in order
            const countKeys = Object.keys(this.counts).sort();
            countKeys.forEach((id, index) => {
                data += this.counts[id];
                if (index < countKeys.length - 1) {
                    data += '\n';
                }
            });
        }
        
        // Add days practiced (number or blank line)
        data += '\n';
        if (this.questionAnswers.daysPracticed !== null && !this.questionAnswers.didNotCollect) {
            data += this.questionAnswers.daysPracticed;
        }
        
        // Add ECBI/WACB score (number or blank line)
        data += '\n';
        if (this.questionAnswers.ecbiScore !== null && !this.questionAnswers.didNotAdminister) {
            data += this.questionAnswers.ecbiScore;
        }
        
        return data;
    }

    generateEmailContent() {
        if (this.isSkipCoding) {
            const teachingAnswer = this.isTeachingSession ? 'yes' : 'no';
            return `Questionnaire: no
Asked about homework: no
Did coding analysis: ${teachingAnswer}`;
        }

        const homeworkAnswer = this.questionAnswers.didNotCollect ? 'no' : 'yes';
        const questionnaireAnswer = this.questionAnswers.didNotAdminister ? 'no' : 'yes';

        return `Questionnaire: ${questionnaireAnswer}
Asked about homework: ${homeworkAnswer}
Did coding analysis: yes`;
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(err => {
                console.error('Failed to copy:', err);
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }
    
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textarea);
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    returnToCounter() {
        // Pass through custom labels when returning to counter
        const currentParams = new URLSearchParams(window.location.search);
        const params = new URLSearchParams();
        
        const buttonMapping = {
            'btn1': 1, 'btn2': 2, 'btn3': 3, 'btn4': 4,
            'btn5': 6, 'btn6': 7, 'btn7': 8, 'btn8': 9
        };
        
        for (const [param, dataId] of Object.entries(buttonMapping)) {
            const value = currentParams.get(param);
            if (value) {
                params.append(param, value);
            }
        }
        
        // Pass through testMode if present
        if (currentParams.get('testMode') === 'true') {
            params.append('testMode', 'true');
        }
        
        const queryString = params.toString();
        window.location.href = queryString ? `index.html?${queryString}` : 'index.html';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FinishEvaluationApp();
});