// Global variables
let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let markedQuestions = new Set();
let timeLeft = 1800; // 30 minutes in seconds
let timerInterval = null;

// Debug function
function debug(message, data) {
    console.log(`[DEBUG] ${message}`, data || '');
}

// Error display function
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    console.error(message);
}

// Get question status
function getQuestionStatus() {
    if (markedQuestions.has(currentQuestion)) {
        return 'Marked for Review';
    }
    if (userAnswers[currentQuestion] !== -1) {
        return 'Answered';
    }
    return 'Not Answered';
}

// User database (in real app, this would be in a secure backend)
const users = [
    { username: "student1", password: "pass123" },
    { username: "student2", password: "pass456" }
];

// Questions database
const questionsData = [
    {
        "id": 1,
        "text": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correct": 1,
        "explanation": "Four is the sum of two plus two, which is a basic arithmetic operation."
    },
    {
        "id": 2,
        "text": "What is the capital of France?",
        "options": ["London", "Paris", "Berlin", "Madrid"],
        "correct": 1,
        "explanation": "Paris is the capital and largest city of France."
    },
    {
        "id": 3,
        "text": "Which planet is largest?",
        "options": ["Mars", "Jupiter", "Saturn", "Earth"],
        "correct": 1,
        "explanation": "Jupiter is the largest planet in our solar system."
    }
];

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        window.location.href = 'instructions.html';
    } else {
        alert('Invalid username or password');
    }
}

// Load questions (now uses static data)
async function loadQuestions() {
    try {
        debug('Loading questions...');
        questions = [...questionsData]; // Create a copy of the questions
        
        if (!questions || questions.length === 0) {
            throw new Error('No questions available');
        }
        
        userAnswers = new Array(questions.length).fill(-1);
        debug(`Loaded ${questions.length} questions`);
        
        renderQuestion();
        buildQuestionPalette();
        updateButtonStates();
        startTimer();
        
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions');
    }
}

// Render current question
function renderQuestion() {
    if (!questions || questions.length === 0) {
        showError('No questions available');
        return;
    }

    const container = document.getElementById('question-container');
    if (!container) return;

    const question = questions[currentQuestion];
    
    container.innerHTML = `
        <div class="question-header">
            <h3>Question ${currentQuestion + 1} of ${questions.length}</h3>
            <div class="question-status">${getQuestionStatus()}</div>
        </div>
        <div class="question-text">${question.text}</div>
        <div class="options">
            ${question.options.map((option, index) => {
                const isSelected = userAnswers[currentQuestion] === index;
                return `
                    <div class="option ${isSelected ? 'selected' : ''}" data-index="${index}">
                        <input type="radio" name="answer" value="${index}" ${isSelected ? 'checked' : ''}>
                        <span class="option-text">${option}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Add click handlers for options
    const options = container.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const index = parseInt(option.dataset.index);
            userAnswers[currentQuestion] = index;
            renderQuestion(); // Re-render to update selection
            buildQuestionPalette(); // Update question palette
            updateButtonStates(); // Update navigation buttons
        });
    });

    updateButtonStates();
    buildQuestionPalette();
}

// Setup event listeners
function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const markBtn = document.getElementById('markBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
    if (markBtn) markBtn.addEventListener('click', toggleMarkQuestion);
    if (submitBtn) submitBtn.addEventListener('click', submitExam);
}

// Navigate between questions
function navigate(direction) {
    const newIndex = currentQuestion + direction;
    if (newIndex >= 0 && newIndex < questions.length) {
        currentQuestion = newIndex;
        renderQuestion();
    }
}

// Update button states
function updateButtonStates() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentQuestion === questions.length - 1;
    }
    
    if (submitBtn) {
        const allAnswered = userAnswers.every(answer => answer !== -1);
        submitBtn.disabled = !allAnswered;
    }
}

// Toggle mark for review
function toggleMarkQuestion() {
    if (markedQuestions.has(currentQuestion)) {
        markedQuestions.delete(currentQuestion);
    } else {
        markedQuestions.add(currentQuestion);
    }
    buildQuestionPalette();
}

// Build question palette
function buildQuestionPalette() {
    const palette = document.querySelector('.palette-buttons');
    if (!palette) return;
    
    palette.innerHTML = '';
    
    for (let i = 0; i < questions.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = i + 1;
        btn.className = 'palette-btn';
        
        if (userAnswers[i] !== -1) btn.classList.add('answered');
        if (markedQuestions.has(i)) btn.classList.add('marked');
        if (i === currentQuestion) btn.classList.add('current');
        
        btn.addEventListener('click', () => {
            currentQuestion = i;
            renderQuestion();
        });
        palette.appendChild(btn);
    }
}

// Start exam timer
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    if (!timerDisplay) return;
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset timer
    timeLeft = 1800; // 30 minutes
    
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 30) {
            timerDisplay.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
            return;
        }
        
        timeLeft--;
    }, 1000);
}

// Submit exam
async function submitExam() {
    try {
        debug('Submitting exam...');
        clearInterval(timerInterval);
        
        // Calculate score and prepare detailed results
        let score = 0;
        const questionDetails = questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correct;
            if (isCorrect) score++;
            
            return {
                questionNumber: index + 1,
                questionText: question.text,
                options: question.options,
                userAnswer: userAnswers[index],
                correctAnswer: question.correct,
                isCorrect: isCorrect,
                explanation: question.explanation || 'No explanation provided'
            };
        });
        
        // Save exam data
        const examData = {
            score,
            totalQuestions: questions.length,
            percentage: (score / questions.length) * 100,
            timeSpent: 1800 - timeLeft,
            questionDetails: questionDetails
        };
        
        // Debug logging
        console.log('Exam Data to save:', examData);
        
        // Save to localStorage and verify it was saved
        localStorage.setItem('examData', JSON.stringify(examData));
        const savedData = localStorage.getItem('examData');
        
        // Debug logging
        console.log('Saved Data retrieved:', savedData ? JSON.parse(savedData) : 'No data found');
        
        if (!savedData) {
            throw new Error('Failed to save exam data');
        }
        
        // Ensure data is properly saved before redirecting
        const parsedData = JSON.parse(savedData);
        if (!parsedData.score || !parsedData.totalQuestions || !parsedData.questionDetails) {
            throw new Error('Exam data is incomplete');
        }
        
        // Redirect to scorecard
        console.log('Redirecting to scorecard...');
        window.location.href = 'scorecard.html';
    } catch (error) {
        console.error('Error in submitExam:', error);
        showError('Failed to submit exam: ' + error.message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded, initializing exam...');
    setupEventListeners();
    loadQuestions();
});