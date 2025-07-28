class CounterApp {
    constructor() {
        this.counts = {
            1: 0, 2: 0, 3: 0, 4: 0,
            6: 0, 7: 0, 8: 0, 9: 0
        };
        this.actionHistory = [];
        this.labels = {
            1: 'LP (labeled praise)',
            2: 'RF (reflect kid)',
            3: 'BD (behavior description)',
            4: 'TA (talk)',
            6: 'UP (unlabeled praise)',
            7: 'NTA (criticism)',
            8: 'QU (question)',
            9: 'CA (command)'
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
        
        document.getElementById('return-btn').addEventListener('click', () => {
            this.hideConfigModal();
        });
        
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undoLastAction();
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
    }
    
    updateDisplay(id) {
        const button = document.querySelector(`[data-id="${id}"]`);
        const countElement = button.querySelector('.count');
        countElement.textContent = this.counts[id];
    }
    
    showConfigModal() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    new CounterApp();
});