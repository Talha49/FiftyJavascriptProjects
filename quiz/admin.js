const adminPassword = '321'; // Replace with your desired admin password

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("quiz-form");
    const quizList = document.getElementById("quiz-list");
    const saveBtn = document.getElementById("save-btn");
    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    function renderQuizList() {
        quizList.innerHTML = quizzes.map((quiz, index) => `
            <div class="quiz-item">
                <h3>${quiz.question}</h3>
                <button class="btn edit-btn" data-index="${index}"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `).join('');

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editQuiz);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteQuiz);
        });
    }

    function saveQuiz(e) {
        e.preventDefault();
        const editIndex = document.getElementById("edit-index").value;
        const quizData = {
            question: document.getElementById("question").value,
            options: [
                document.getElementById("option1").value,
                document.getElementById("option2").value,
                document.getElementById("option3").value,
                document.getElementById("option4").value,
            ],
            correct: document.getElementById("correct").value
        };

        if (editIndex === "") {
            quizzes.push(quizData);
        } else {
            quizzes[parseInt(editIndex)] = quizData;
        }

        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        alert('Quiz saved successfully!');
        form.reset();
        document.getElementById("edit-index").value = "";
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Quiz';
        renderQuizList();
    }

    function editQuiz(e) {
        const index = e.target.dataset.index;
        const quiz = quizzes[index];
        document.getElementById("question").value = quiz.question;
        document.getElementById("option1").value = quiz.options[0];
        document.getElementById("option2").value = quiz.options[1];
        document.getElementById("option3").value = quiz.options[2];
        document.getElementById("option4").value = quiz.options[3];
        document.getElementById("correct").value = quiz.correct;
        document.getElementById("edit-index").value = index;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Quiz';
    }

    function deleteQuiz(e) {
        const index = e.target.dataset.index;
        if (confirm("Are you sure you want to delete this quiz?")) {
            quizzes.splice(index, 1);
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            renderQuizList();
        }
    }

    form.addEventListener("submit", saveQuiz);
    renderQuizList();
});

// Password protection for admin route
const inputPassword = prompt("Enter Admin Password:");
if (inputPassword !== adminPassword) {
    alert("Incorrect password! Redirecting to the quiz page.");
    window.location.href = "quiz.html";
}