let questions = [];
let questionElement = document.getElementById('question');
let multipleChoice = Array.from(document.querySelectorAll('.choice-text'));
let progress = document.getElementById('progressText')
const scoreDisplay = document.getElementById('score');
let score = 0;
let currentQuestionIndex = 0;   
let timerId = null;

async function getData() {
    const dataUrl = 'https://opentdb.com/api.php?amount=50&category=18&difficulty=medium&type=multiple';

    const response = await fetch(dataUrl);
    const data = await response.json();

    questions = data.results.map(item => ({
        question: item.question, 
        correct_answer: item.correct_answer,
        incorrect_answers: item.incorrect_answers 
    }));
    
    displayQuestion();
}

 function quizTimer(seconds) {
    const timerDisplay = document.getElementById('js-timer');
    if (!timerDisplay) return;

    // Stop any previous timer
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }

    let timer = seconds;
    timerDisplay.innerText = String(timer);

    timerId = setInterval(() => {
        timer--;
        timerDisplay.innerText = String(timer);

        if (timer <= 0) {
            clearInterval(timerId);
            timerId = null;

            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                alert(`Game over! total score: ${score}`);
                return;
            }
            displayQuestion();
        }
    }, 1000);
}



function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function displayQuestion() {
    let currentQ = questions[currentQuestionIndex];
    const cleanText = decodeHTML(currentQ.question);
    questionElement.innerText = cleanText;
    progress.innerText = `${currentQuestionIndex}/50`;
    
    choicesAnswers();

}
function choicesAnswers() {
    let currentQ = questions[currentQuestionIndex];
    const answers = [...currentQ.incorrect_answers, currentQ.correct_answer];

    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    multipleChoice.forEach((button, index) => {
        const rawText = answers[index];
        const cleanAnswer = decodeHTML(rawText);

        button.innerText = cleanAnswer;

        button.onclick = () => {
            if (timerId !== null) {
                clearInterval(timerId);
                timerId = null;
            }

            if (rawText === currentQ.correct_answer) {
                alert('correct');
                score++;
                scoreDisplay.innerText = `${score}`;
            } else {
                alert('wrong');
            }

            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                alert(`you win!: total score:${score}`);
                return;
            }

            displayQuestion();
        };
    });

    // restart timer for this question
    quizTimer(10);
}

getData();