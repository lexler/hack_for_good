// Version 0.0.67

// Configuration
function getTimerDuration() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('testMode') === 'true') {
        return 30; // 30 seconds for automated tests
    }
    
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    return isLocalhost 
        ? 10      // 10 seconds for localhost testing
        : 60 * 5; // 5 minutes for production
}

const TIMER_DURATION_SECONDS = getTimerDuration();

class CounterApp {
    constructor() {
        this.version = '0.0.67';
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
        this.isSkipCoding = false;
        this.isTeachingSession = null;
        this.timer = {
            startTime: null,
            duration: TIMER_DURATION_SECONDS,
            remaining: TIMER_DURATION_SECONDS,
            isActive: false,
            isExpired: false,
            intervalId: null
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
        
        // Debug: Show if custom labels were loaded
        if (this.labels !== this.defaultLabels) {
            console.log('Custom labels loaded successfully!');
        }
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.bindKeyboardEvents();
        this.updateTimerDisplay();
        this.updateButtonState();
        this.updateButtonLabels();
        this.preventPullToRefresh();
        this.setViewportHeight();
    }
    
    parseCustomLabels() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log('URL search params:', window.location.search);
        const customLabels = {};
        let hasCustomLabels = false;
        
        // Map btn1-btn8 to data-id values (1,2,3,4,6,7,8,9)
        const buttonMapping = {
            'btn1': 1, 'btn2': 2, 'btn3': 3, 'btn4': 4,
            'btn5': 6, 'btn6': 7, 'btn7': 8, 'btn8': 9
        };
        
        for (const [param, dataId] of Object.entries(buttonMapping)) {
            const value = urlParams.get(param);
            console.log(`Checking ${param} (dataId ${dataId}):`, value);
            if (value && value.includes(':')) {
                const [code, ...descriptionParts] = value.split(':');
                const description = descriptionParts.join(':').trim();
                
                if (code && description) {
                    customLabels[dataId] = {
                        code: code.trim(),
                        description: description
                    };
                    hasCustomLabels = true;
                    console.log(`Added custom label for ${dataId}:`, customLabels[dataId]);
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
            console.log('Final custom labels:', customLabels);
            return customLabels;
        }
        
        console.log('No custom labels found, using defaults');
        return null;
    }
    
    updateButtonLabels() {
        const buttons = document.querySelectorAll('.count-button');
        
        buttons.forEach(button => {
            const dataId = parseInt(button.dataset.id);
            const labelData = this.labels[dataId];
            
            if (labelData) {
                const labelElement = button.querySelector('.label');
                const descriptionElement = button.querySelector('.description');
                
                if (labelElement) {
                    labelElement.textContent = labelData.code;
                }
                if (descriptionElement) {
                    descriptionElement.textContent = labelData.description;
                }
            }
        });
    }
    
    setViewportHeight() {
        // Set the app container to the actual viewport height
        const setHeight = () => {
            const app = document.querySelector('.app');
            if (app) {
                app.style.height = `${window.innerHeight}px`;
            }
        };
        
        // Set on load
        setHeight();
        
        // Update on resize or orientation change
        window.addEventListener('resize', setHeight);
        window.addEventListener('orientationchange', setHeight);
    }
    
    preventPullToRefresh() {
        // Prevent all default touch behaviors on the document
        document.body.addEventListener('touchmove', (e) => {
            // Prevent the default behavior for all touch moves
            // This will stop pull-to-refresh but also scrolling
            e.preventDefault();
        }, { passive: false });
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
        
        document.getElementById('skip-coding-btn').addEventListener('click', () => {
            this.startSkipCodingFlow();
        });
    }
    
    incrementCount(id) {
        if (this.timer.isExpired) return; // Don't allow counting when timer expired
        
        if (!this.timer.isActive && this.isStarted) {
            this.startTimer();
        }
        
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
        this.redirectToFinishPage(false);
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
        this.redirectToFinishPage(false);
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
    
    startSkipCodingFlow() {
        this.redirectToFinishPage(true);
    }
    
    redirectToFinishPage(skipCoding) {
        const params = new URLSearchParams();
        
        // Add all counts
        Object.keys(this.counts).forEach(id => {
            params.append(`c${id}`, this.counts[id]);
        });
        
        // Add skip coding flag
        params.append('skip', skipCoding);
        
        // Pass through custom button labels if they exist
        const currentParams = new URLSearchParams(window.location.search);
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
        
        // Redirect to finish evaluation page
        window.location.href = `finish_evaluation.html?${params.toString()}`;
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
            
            // Add newline after all counts
            if (index < countKeys.length - 1) {
                data += '\n';
            }
        });
        
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
    
}

document.addEventListener('DOMContentLoaded', () => {
    new CounterApp();
});