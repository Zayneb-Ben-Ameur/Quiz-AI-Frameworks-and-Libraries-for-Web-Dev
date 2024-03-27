document.addEventListener('DOMContentLoaded', function () {
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit');
    const scoreContainer = document.getElementById('score');
    let selectedAnswers = new Array(6);;
    let quizData = [];

    //fct to display all questions
    function displayQuestions() {
        quizData.forEach((question, index) => {
            let questionDiv = document.createElement('div');
            questionDiv.classList.add('question-container');
            questionDiv.id = `question-container-${index}`;
            questionDiv.innerHTML = `
                <h3>Question ${index + 1}: ${question.question}</h3>
                <ul id="options-${index}"></ul>
            `;
            quizContainer.appendChild(questionDiv);
            let optionsUl = document.getElementById(`options-${index}`);
            
            question.options.forEach((option, optionIndex) => {
                let li = document.createElement('li');
                li.textContent = option;
                li.addEventListener('click', function() {
                    selectedAnswers[index] = optionIndex;
                    //highlight the selected option
                    //remove highlight from other options
                Array.from(optionsUl.children).forEach(child => {
                    child.classList.remove('selected');
                });
                //highlight the selected option maraokhra
                li.classList.add('selected');
                });
                optionsUl.appendChild(li);
            });
        });
    }

    //load quiz data from JSON file
    fetch('quizData.json')
        .then(response => response.json())
        .then(data => {
            quizData = data;
            displayQuestions();
        })
        .catch(error => console.error('Error loading quiz data:', error));
            
    //fct to calculate score
function calculateScore() {
    let score = 0;
    quizData.forEach((question, index) => {
        if (selectedAnswers[index] === question.answer) {
            score++;
        } else {
            let optionsUl = document.getElementById(`options-${index}`);
            Array.from(optionsUl.children).forEach((li, optionIndex) => {
                if (optionIndex === question.answer) {
                    li.classList.add('correct-answer'); //if you want to mark the correct answers after submission
                }
            });
        }
    });
    return score;
}

//fct to check if all questions have been answered
function allQuestionsAnswered() {
    for (let i = 0; i < quizData.length; i++) {
        const questionContainer = document.getElementById(`question-container-${i}`);
        if (selectedAnswers[i] === undefined) {
            questionContainer.classList.add('unanswered');
            return false; //immediately return false if a question is unanswered
        }
    }
    return true; //all questions answered
}
    //fct to show the results
    function showResults() {
        let score = calculateScore();
        scoreContainer.textContent = `Votre score est ${score} sur ${quizData.length}.`;
        scoreContainer.classList.add('score-notice');
        submitButton.style.display = 'none';
        quizData.forEach((question, index) => {
            const optionsUl = document.getElementById(`options-${index}`);
            Array.from(optionsUl.children).forEach((li, optionIndex) => {
                li.classList.add('disabled');
                //highlight incorrect answers
                if (selectedAnswers[index] !== question.answer) {
                    if (optionIndex === selectedAnswers[index]) {
                        li.classList.add('incorrect-answer');
                    }
                }
            });
        });
    }

    //fct to show the custom alert
    function showCustomAlert(message) {
        const customAlertBox = document.getElementById('custom-alert');
        customAlertBox.textContent = message;
        customAlertBox.classList.add('active');
        setTimeout(() => {
            customAlertBox.classList.remove('active');
        }, 5000);
    }

    //event listener for the submit button
submitButton.addEventListener('click', function() {
    //clear any previous messages
    const additionalContent = document.getElementById('additional-content');
    additionalContent.textContent = ''; 
    additionalContent.classList.remove('alert-message');

    let allAnswered = true;
    for (let i = 0; i < quizData.length; i++) {
        if (selectedAnswers[i] === undefined) {
            const questionContainer = document.getElementById(`question-container-${i}`);
            questionContainer.classList.add('unanswered');
            allAnswered = false;
        } else {
            const questionContainer = document.getElementById(`question-container-${i}`);
            questionContainer.classList.remove('unanswered');
        }
    }

    //if not all questions are answered, display a message
    if (!allAnswered) {
        additionalContent.textContent = 'Veuillez répondre à toutes les questions avant de soumettre.';
        additionalContent.classList.add('alert-message');
        //do not show results if not all questions are answered
        return;
    }
    //show results if all questions are answered
    showResults();
});

    //load all questions
    displayQuestions();
});
