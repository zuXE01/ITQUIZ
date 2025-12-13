let questions = [];
let questionElement = document.getElementById('question');
let multipleChoice = Array.from(document.querySelectorAll('.choice-text'));
let progress = document.getElementById('progressText')
const scoreDisplay = document.getElementById('score');
let score = 0;
let currentQuestionIndex = 0;   

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
            if (rawText === currentQ.correct_answer) {
                alert('correct');
                score++
                scoreDisplay.innerText = `${score}`;

            } else {
                alert('wrong');
            }

            if (score === 60) {
                alert('you win');
            }
            currentQuestionIndex++;
            

            displayQuestion()
        };
    });
}

getData();