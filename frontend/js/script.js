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
    { username: "akshat", password: "akshat2005" },
    { username: "ayush", password: "arsi2006" },
    { username: "S.Ranjan", password: "sranjan2007" },
    { username: "satyam", password: "satyam2006" },
    { username: "dwivedi", password: "dwivedi2006" },
    { username: "jimson", password: "mathew" },
    { username: "mayank", password: "sah" },
    { username: "ankit", password: "ankit2007" },
    { username: "amrita", password: "amrita2003" },
    { username: "amresh", password: "amresh2000" }
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
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    console.log('Login attempt for username:', username);

    if (!username || !password) {
        errorMsg.textContent = 'Please enter both username and password';
        errorMsg.style.display = 'block';
        return;
    }

    // Find user (case-insensitive username comparison)
    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
    );

    console.log('User found:', user ? 'yes' : 'no');

    if (user) {
        console.log('Login successful');
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', user.username); // Store original username case
        window.location.href = 'instructions.html';
    } else {
        console.log('Login failed');
        errorMsg.textContent = 'Invalid username or password';
        errorMsg.style.display = 'block';
        // Clear the password field
        document.getElementById('password').value = '';
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
            // If question is unanswered, treat it as incorrect
            const userAnswer = userAnswers[index] === -1 ? null : userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            if (isCorrect) score++;
            
            return {
                questionNumber: index + 1,
                questionText: question.text,
                options: question.options,
                userAnswer: userAnswer,
                correctAnswer: question.correct,
                isCorrect: isCorrect,
                explanation: question.explanation
            };
        });
        
        // Save results to localStorage
        const examData = {
            score,
            totalQuestions: questions.length,
            questionDetails,
            timeSpent: 1800 - timeLeft,
            username: localStorage.getItem('username')
        };
        
        localStorage.setItem('examResults', JSON.stringify(examData));
        
        // Redirect to scorecard
        console.log('Redirecting to scorecard...');
        window.location.href = 'scorecard.html';
    } catch (error) {
        console.error('Error in submitExam:', error);
        showError('Failed to submit exam. Please try again.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded, initializing exam...');
    setupEventListeners();
    loadQuestions();
});