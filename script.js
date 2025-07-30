// Version 0.0.34

// Configuration
function getTimerDuration() {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    return isLocalhost 
        ? 10      // 10 seconds for localhost testing
        : 60 * 5; // 5 minutes for production
}

const TIMER_DURATION_SECONDS = getTimerDuration();

class CounterApp {
    constructor() {
        this.version = '0.0.34';
        this.isStarted = false;
        this.counts = {
            1: 0, 2: 0, 3: 0, 4: 0,
            6: 0, 7: 0, 8: 0, 9: 0
        };
        this.actionHistory = [];
        this.questionAnswers = {
            daysPracticed: null,
            didNotCollect: false,
            ecbiScore: null,
            didNotAdminister: false
        };
        this.timer = {
            startTime: null,
            duration: TIMER_DURATION_SECONDS,
            remaining: TIMER_DURATION_SECONDS,
            isActive: false,
            isExpired: false,
            intervalId: null
        };
        this.labels = {
            1: 'TA (talk)',
            2: 'BD (behavior description)',
            3: 'RF (reflection)',
            4: 'LP (labeled praise)',
            6: 'UP (unlabeled praise)',
            7: 'QU (question)',
            8: 'CM (command)',
            9: 'NTA (criticism)'
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.bindKeyboardEvents();
        this.updateTimerDisplay();
        this.updateButtonState();
    }
    
    bindEvents() {
        const countButtons = document.querySelectorAll('.count-button');
        countButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(button.dataset.id);
                this.incrementCount(id);
            });
        });
        
        document.getElementById('config-btn').addEventListener('click', () => {
            this.showConfigModal();
        });
        
        document.getElementById('undo-direct-btn').addEventListener('click', () => {
            this.undoLastAction();
        });
        
        document.getElementById('return-btn').addEventListener('click', () => {
            this.hideConfigModal();
        });
        
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.cancelEvaluation();
        });
        
        document.getElementById('finish-btn').addEventListener('click', () => {
            this.finishEvaluation();
        });
        
        document.getElementById('combined-return-btn').addEventListener('click', () => {
            this.hideCombinedModal();
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
    }
    
    incrementCount(id) {
        if (this.timer.isExpired) return; // Don't allow counting when timer expired
        
        // Start timer on first button press (only if already started)
        if (!this.timer.isActive && this.isStarted) {
            this.startTimer();
        }
        
        // Don't allow counting until started
        if (!this.isStarted) return;
        
        this.counts[id]++;
        this.actionHistory.push(id);
        this.updateDisplay(id);
        this.hapticFeedback();
    }
    
    updateDisplay(id) {
        const button = document.querySelector(`[data-id="${id}"]`);
        const countElement = button.querySelector('.count');
        countElement.textContent = this.counts[id];
    }
    
    showConfigModal() {
        document.getElementById('version-info').textContent = `Version ${this.version}`;
        document.getElementById('config-modal').classList.add('show');
    }
    
    hideConfigModal() {
        document.getElementById('config-modal').classList.remove('show');
    }
    
    undoLastAction() {
        if (!this.isStarted) {
            // Start button clicked
            this.isStarted = true;
            this.startTimer();
            this.updateButtonState();
            this.hapticFeedback(50);
            return;
        }
        
        if (this.actionHistory.length === 0) return;
        
        const lastAction = this.actionHistory.pop();
        this.counts[lastAction]--;
        this.updateDisplay(lastAction);
        this.hideConfigModal();
        this.hapticFeedback(50);
    }
    
    updateButtonState() {
        const button = document.getElementById('undo-direct-btn');
        const buttonText = document.getElementById('button-text');
        const undoIcon = document.getElementById('undo-icon');
        const playIcon = document.getElementById('play-icon');
        
        if (!this.isStarted) {
            // Start state
            button.classList.add('start-state');
            buttonText.textContent = 'Start';
            undoIcon.style.display = 'none';
            playIcon.style.display = 'block';
        } else {
            // Undo state
            button.classList.remove('start-state');
            buttonText.textContent = 'Undo';
            undoIcon.style.display = 'block';
            playIcon.style.display = 'none';
        }
    }
    
    cancelEvaluation() {
        this.counts = {
            1: 0, 2: 0, 3: 0, 4: 0,
            6: 0, 7: 0, 8: 0, 9: 0
        };
        this.actionHistory = [];
        this.isStarted = false;
        
        // Reset timer
        this.resetTimer();
        
        Object.keys(this.counts).forEach(id => {
            this.updateDisplay(parseInt(id));
        });
        
        this.updateButtonState();
        this.hideConfigModal();
    }
    
    finishEvaluation() {
        this.showCombinedModal();
        this.hideConfigModal();
    }
    
    
    hapticFeedback(duration = 30) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }
    
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard input on main screen (no modals open)
            const modalsOpen = document.querySelector('.modal.show');
            if (modalsOpen) return;
            
            const keyMap = {
                // Numpad mapping
                '7': '1', // TA
                '8': '2', // BD  
                '9': '3', // RF
                '4': '4', // LP
                '5': 'undo', // Undo
                '6': '6', // UP
                '1': '7', // QU
                '2': '8', // CM
                '3': '9', // NTA
                
                // QWE mapping  
                'q': '1', 'Q': '1', // TA
                'w': '2', 'W': '2', // BD
                'e': '3', 'E': '3', // RF
                'a': '4', 'A': '4', // LP
                's': 'undo', 'S': 'undo', // Undo
                'd': '6', 'D': '6', // UP
                'z': '7', 'Z': '7', // QU
                'x': '8', 'X': '8', // CM
                'c': '9', 'C': '9'  // NTA
            };
            
            const key = e.key;
            if (keyMap[key]) {
                e.preventDefault();
                
                if (key === '5' || key === 's' || key === 'S') {
                    // Trigger start/undo
                    this.undoLastAction();
                    this.highlightButton('undo-direct-btn');
                } else {
                    // Trigger count increment
                    const dataId = keyMap[key];
                    this.incrementCount(parseInt(dataId));
                    this.highlightButton(`[data-id="${dataId}"]`);
                }
            }
        });
    }
    
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                button.style.transform = '';
                button.style.transition = '';
            }, 150);
        }
    }
    
    startTimer() {
        this.timer.startTime = Date.now();
        this.timer.isActive = true;
        
        this.timer.intervalId = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.timer.startTime) / 1000);
            this.timer.remaining = Math.max(0, this.timer.duration - elapsed);
            
            this.updateTimerDisplay();
            
            if (this.timer.remaining <= 0) {
                this.expireTimer();
            }
        }, 1000);
    }
    
    resetTimer() {
        if (this.timer.intervalId) {
            clearInterval(this.timer.intervalId);
        }
        
        this.timer.startTime = null;
        this.timer.remaining = this.timer.duration;
        this.timer.isActive = false;
        this.timer.isExpired = false;
        this.timer.intervalId = null;
        
        this.updateTimerDisplay();
        this.enableCountingButtons();
    }
    
    expireTimer() {
        clearInterval(this.timer.intervalId);
        this.timer.isExpired = true;
        this.timer.isActive = false;
        
        this.updateTimerDisplay();
        this.finishEvaluation();
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.remaining / 60);
        const seconds = this.timer.remaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('timer-display');
        timerElement.textContent = timeString;
        
        if (this.timer.isExpired) {
            timerElement.classList.add('expired');
        } else {
            timerElement.classList.remove('expired');
        }
    }
    
    disableCountingButtons() {
        const countButtons = document.querySelectorAll('.count-button');
        countButtons.forEach(button => {
            button.style.opacity = '0.5';
            button.style.pointerEvents = 'none';
        });
    }
    
    enableCountingButtons() {
        const countButtons = document.querySelectorAll('.count-button');
        countButtons.forEach(button => {
            button.style.opacity = '';
            button.style.pointerEvents = '';
        });
    }
    
    emailResults() {
        const emailContent = this.generateEmailContent();
        const subject = encodeURIComponent("[PCIT Intermediary]");
        const body = encodeURIComponent(emailContent);
        const mailtoUrl = `mailto:RACHEL.4.WILSON@cuanschutz.edu?subject=${subject}&body=${body}`;
        
        window.location.href = mailtoUrl;
    }
    
    
    showCombinedModal() {
        // Populate summary section
        const summaryList = document.getElementById('summary-list');
        summaryList.innerHTML = '';
        
        Object.keys(this.counts).forEach(id => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <span>${this.labels[id]}</span>
                <span>${this.counts[id]}</span>
            `;
            summaryList.appendChild(resultItem);
        });
        
        // Reset form
        document.getElementById('days-practiced').value = '';
        document.getElementById('ecbi-score').value = '';
        document.getElementById('did-not-collect').checked = false;
        document.getElementById('did-not-administer').checked = false;
        document.getElementById('days-practiced').disabled = false;
        document.getElementById('ecbi-score').disabled = false;
        document.getElementById('validation-error').style.display = 'none';
        
        document.getElementById('combined-modal').classList.add('show');
    }
    
    hideCombinedModal() {
        document.getElementById('combined-modal').classList.remove('show');
    }
    
    toggleDaysInput(isChecked) {
        const input = document.getElementById('days-practiced');
        input.disabled = isChecked;
        if (isChecked) {
            input.value = '';
        }
    }
    
    toggleScoreInput(isChecked) {
        const input = document.getElementById('ecbi-score');
        input.disabled = isChecked;
        if (isChecked) {
            input.value = '';
        }
    }
    
    validateForm() {
        const daysInput = document.getElementById('days-practiced');
        const scoreInput = document.getElementById('ecbi-score');
        const didNotCollect = document.getElementById('did-not-collect').checked;
        const didNotAdminister = document.getElementById('did-not-administer').checked;
        
        const daysValid = didNotCollect || (daysInput.value !== '' && !isNaN(daysInput.value));
        const scoreValid = didNotAdminister || (scoreInput.value !== '' && !isNaN(scoreInput.value));
        
        if (!daysValid || !scoreValid) {
            const errorDiv = document.getElementById('validation-error');
            errorDiv.textContent = 'Please fill in each field or check the corresponding checkbox.';
            errorDiv.style.display = 'block';
            return false;
        }
        
        document.getElementById('validation-error').style.display = 'none';
        return true;
    }
    
    processCombinedForm() {
        if (!this.validateForm()) {
            return;
        }
        
        // Store the question answers
        const daysInput = document.getElementById('days-practiced');
        const scoreInput = document.getElementById('ecbi-score');
        
        this.questionAnswers.daysPracticed = document.getElementById('did-not-collect').checked ? null : parseInt(daysInput.value);
        this.questionAnswers.didNotCollect = document.getElementById('did-not-collect').checked;
        this.questionAnswers.ecbiScore = document.getElementById('did-not-administer').checked ? null : parseInt(scoreInput.value);
        this.questionAnswers.didNotAdminister = document.getElementById('did-not-administer').checked;
        
        // Copy to clipboard and send email
        this.copySessionDataToClipboard();
        this.emailResults();
        
        // Hide modal
        this.hideCombinedModal();
    }
    
    generateSessionData() {
        const timestamp = new Date().toLocaleString();
        const sessionDuration = this.timer.duration - this.timer.remaining;
        const minutes = Math.floor(sessionDuration / 60);
        const seconds = sessionDuration % 60;
        const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Output just the behavioral counts, one per line
        let data = '';
        const countKeys = Object.keys(this.counts);
        
        // Add all the behavioral counts in order
        countKeys.forEach((id, index) => {
            data += this.counts[id];
            
            // Add an empty line after the first count
            if (index === 0) {
                data += '\n\n';
            }
            // Add newline after all except the last count
            else if (index < countKeys.length - 1) {
                data += '\n';
            }
        });
        
        return data;
    }
    
    showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        // Set message and style
        toast.textContent = message;
        toast.className = 'toast';
        
        if (isError) {
            toast.classList.add('error');
        }
        
        // Show the toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    async copySessionDataToClipboard() {
        console.log('copySessionDataToClipboard called');
        const sessionData = this.generateSessionData();
        console.log('Session data generated:', sessionData);
        
        try {
            // Check if clipboard API is available
            if (!navigator.clipboard) {
                throw new Error('Clipboard API not available');
            }
            
            await navigator.clipboard.writeText(sessionData);
            console.log('Successfully copied to clipboard');
            this.showToast('Session data copied to clipboard!');
            
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            
            // Fallback: try older execCommand method
            try {
                const textArea = document.createElement('textarea');
                textArea.value = sessionData;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                if (success) {
                    console.log('Successfully copied using execCommand fallback');
                    this.showToast('Session data copied to clipboard!');
                } else {
                    throw new Error('execCommand copy failed');
                }
            } catch (fallbackErr) {
                console.error('Fallback copy also failed:', fallbackErr);
                this.showToast('Failed to copy to clipboard', true);
                
                // As a last resort, show the data in an alert
                alert('Clipboard copy failed. Here is your session data:\n\n' + sessionData);
            }
        }
    }
    
    generateEmailContent() {
        const homeworkAnswer = this.questionAnswers.didNotCollect ? 'no' : 'yes';
        const questionnaireAnswer = this.questionAnswers.didNotAdminister ? 'no' : 'yes';
        
        return `Questionnaire: ${questionnaireAnswer}
Asked about homework: ${homeworkAnswer}
Did coding analysis: yes`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CounterApp();
});