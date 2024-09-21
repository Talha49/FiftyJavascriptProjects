document.addEventListener("DOMContentLoaded", () => {
    let quizData = JSON.parse(localStorage.getItem('quizzes')) || [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let totalTime = 0;
    const quizElement = document.getElementById("quiz");
    const questionCountElement = document.getElementById("question-count").querySelector("span");
    const timerElement = document.getElementById("quiz-timer").querySelector("span");
    const submitButton = document.getElementById("submit-btn");

    function loadQuiz() {
        if (quizData.length === 0) {
            quizElement.innerHTML = "<p>No quizzes available. Please add quizzes from the admin dashboard.</p>";
            submitButton.style.display = "none";
            return;
        }

        clearTimeout(timer);
        const currentQuizData = quizData[currentQuestionIndex];
        questionCountElement.innerText = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
        quizElement.innerHTML = `
            <h2>${currentQuizData.question}</h2>
            <div class="options">
                ${currentQuizData.options.map((option, index) => `
                    <div class="option">
                        <input type="radio" id="option${index}" name="answer" value="${option}">
                        <label for="option${index}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        startTimer(30);  // 30 seconds per question
    }

    function startTimer(seconds) {
        timerElement.innerText = `${seconds}s`;
        timer = setInterval(() => {
            seconds--;
            totalTime++;
            timerElement.innerText = `${seconds}s`;
            if (seconds <= 0) {
                clearInterval(timer);
                submitAnswer();
            }
        }, 1000);
    }

    function submitAnswer() {
        const answer = document.querySelector('input[name="answer"]:checked');
        if (answer && answer.value === quizData[currentQuestionIndex].correct) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuiz();
        } else {
            showResults();
        }
    }

    function showResults() {
        const averageTime = Math.round(totalTime / quizData.length);
        const percentage = Math.round((score / quizData.length) * 100);
        let performance;
        if (percentage >= 80) performance = "Excellent";
        else if (percentage >= 60) performance = "Good";
        else if (percentage >= 40) performance = "Average";
        else performance = "Needs Improvement";

        quizElement.innerHTML = `
            <div class="ending-screen">
                <h1>Quiz Completed</h1>
                <p><i class="fas fa-trophy"></i> Your Score: ${score} / ${quizData.length}</p>
                <p><i class="fas fa-percentage"></i> Percentage: ${percentage}%</p>
                <p><i class="fas fa-clock"></i> Average Time per Question: ${averageTime} seconds</p>
                <p><i class="fas fa-chart-line"></i> Performance: ${performance}</p>
                <button id="restart-btn" class="btn gradient-btn"><i class="fas fa-redo"></i> Restart Quiz</button>
                <button id="finish-btn" class="btn gradient-btn"><i class="fas fa-times-circle"></i> Finish</button>
            </div>
        `;
        submitButton.style.display = "none";
        document.getElementById("restart-btn").addEventListener("click", restartQuiz);
        document.getElementById("finish-btn").addEventListener("click", finishQuiz);
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        totalTime = 0;
        submitButton.style.display = "block";
        loadQuiz();
    }

    function finishQuiz() {
        showFinishPopup();
    }

    function showFinishPopup() {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Thanks for taking the quiz!</h2>
                <p>We hope you enjoyed it and learned something new.</p>
                <button id="close-popup" class="btn gradient-btn"><i class="fas fa-check"></i> Close</button>
            </div>
        `;
        document.body.appendChild(popup);
        document.getElementById('close-popup').addEventListener('click', () => {
            popup.remove();
            window.location.reload();
        });
    }

    submitButton.addEventListener("click", submitAnswer);
    loadQuiz();

    // Keyboard navigation for options
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.option input');
            if (options[index]) {
                options[index].checked = true;
            }
        } else if (e.key === 'Enter') {
            submitAnswer();
        }
    });
});