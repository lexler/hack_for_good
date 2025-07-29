// Version 0.0.1

class CounterApp {
    constructor() {
        this.version = '0.0.1';
        this.counts = {
            1: 0, 2: 0, 3: 0, 4: 0,
            6: 0, 7: 0, 8: 0, 9: 0
        };
        this.actionHistory = [];
        this.labels = {
            1: 'TA (talk)',
            2: 'BD (behavior description)',
            3: 'RF (reflect kid)',
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
        
        document.getElementById('results-return-btn').addEventListener('click', () => {
            this.hideResultsModal();
        });
    }
    
    incrementCount(id) {
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
        if (this.actionHistory.length === 0) return;
        
        const lastAction = this.actionHistory.pop();
        this.counts[lastAction]--;
        this.updateDisplay(lastAction);
        this.hideConfigModal();
        this.hapticFeedback(50);
    }
    
    cancelEvaluation() {
        this.counts = {
            1: 0, 2: 0, 3: 0, 4: 0,
            6: 0, 7: 0, 8: 0, 9: 0
        };
        this.actionHistory = [];
        
        Object.keys(this.counts).forEach(id => {
            this.updateDisplay(parseInt(id));
        });
        
        this.hideConfigModal();
    }
    
    finishEvaluation() {
        this.showResults();
        this.hideConfigModal();
    }
    
    showResults() {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';
        
        Object.keys(this.counts).forEach(id => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <span>${this.labels[id]}</span>
                <span>${this.counts[id]}</span>
            `;
            resultsList.appendChild(resultItem);
        });
        
        document.getElementById('results-modal').classList.add('show');
    }
    
    hideResultsModal() {
        document.getElementById('results-modal').classList.remove('show');
    }
    
    hapticFeedback(duration = 30) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CounterApp();
});