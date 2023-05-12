var question = document.querySelector('#question');
var choices = Array.from(document.querySelectorAll('.choice-text'));
var scoreText = document.querySelector('#score');
var startButton = document.querySelector('#start-button');
var containerGame = document.querySelector('.container-game');
var containerHome = document.querySelector('.container-home');
var countdown = document.querySelector('.countdown');
var containerEnd = document.querySelector('.container-end');
var homeHeading = document.querySelector('.home-heading');
var homeParagraph = document.querySelector('.home-p');

var currentQuestion = {};
var acceptingAnswers = true;
var score = 0;
var questionCounter = 0;
var availableQuestions = [];
var score_points = 20;
var max_questions = 5;
var timer;
var timeCount;

// Arrays used to display questions and choices

var questions = [
  {
    question: 'Commonly used data types DO NOT include:',
    choice1: 'Strings',
    choice2: 'Booleans',
    choice3: 'Alerts',
    choice4: 'Numbers',
    answer: 3,
  },
  {
    question:
      'The condition in an if / else statement is enclosed within _____.',
    choice1: 'Quotes',
    choice2: 'Curly Brackets',
    choice3: 'Parentheses',
    choice4: 'Square Brackets',
    answer: 3,
  },
  {
    question: 'Arrays in JavaScript can be used to store _____.',
    choice1: 'Numbers and Strings',
    choice2: 'Other Arrays',
    choice3: 'Booleans',
    choice4: 'All of the Above',
    answer: 4,
  },
  {
    question:
      'String values must be enclosed within _____ when being assigned to variables.',
    choice1: 'Commas',
    choice2: 'Curly Brackets',
    choice3: 'Quotes',
    choice4: 'Parentheses',
    answer: 3,
  },
  {
    question:
      'A very useful tool used during development and debugging for printing content to the debugger is:',
    choice1: 'JavaScript',
    choice2: 'terminal / bash',
    choice3: 'for loops',
    choice4: 'console.log',
    answer: 4,
  },
];

getNewQuestion = () => {
  //Called when the availableQuestions or max_questions equals to zero
  if (availableQuestions.length === 0 || questionCounter >= max_questions) {
    //Stores the most recent score
    localStorage.setItem('mostRecentScore', score);
    //Shows the end container and hides the game container
    containerEnd.classList.remove('hidden'),
      containerGame.classList.add('hidden');
    return;
  }

  /* The current question number is displayed out of the max_questions */

  questionCounter++;
  progressText.innerText = `Question ${questionCounter} of ${max_questions}`;

  /* Creates an question from the Array and displaying on the choice container */

  var questionsIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionsIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    var number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  availableQuestions.splice(questionsIndex, 1);

  acceptingAnswers = true;
};

// startGame function sets the beginning of the game as it sets up questions, timer value, beginning score and displays the question
startGame = () => {
  questionCounter = 0;
  score = 0;
  timeCount = 60;
  availableQuestions = [...questions];
  getNewQuestion();
};

// loseGame function changes the heading and paragraphs in the home container, notifying the user that the game has ended and displays the score
function loseGame() {
  homeHeading.textContent = 'GAME OVER PRESS START TO RESTART';
  homeParagraph.textContent = `Your final score was: ${score}`;
  containerGame.classList.add('hidden'),
    containerHome.classList.remove('hidden');
  clearInterval(timer);
  timeCount = 60;
}

// eventListener for the start button. it calls the startGame function and starts the timer
startButton.addEventListener('click', startGame());
startButton.addEventListener('click', function startTimer() {
  timer = setInterval(counter, 1000);
  function counter() {
    timeCount--;
    countdown.textContent = timeCount;
    if (timeCount <= 0) {
      clearInterval(timer);
      loseGame();
    }
  }
});

// function to deduct the time every time a wrong answer is selected
function onWrongAnswer() {
  timeCount -= 5;
  countdown.textContent = timeCount;
}

// When the start button is clicked, the game starts and displays the game container and hides the home container
startButton.addEventListener('click', function () {
  containerGame.classList.remove('hidden'),
    containerHome.classList.add('hidden');
});

// For each choice in every question, the right answer is selected by the answer object. When the right answer is selected, the question is marked as correct and the user's score is incremented by 20 and highlights green. When the wrong answer is selected, the question is marked as incorrect and the timer is deducted by 5 seconds and highlights red.
choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    var selectedChoice = e.target;
    var selectedAnswer = choice.dataset['number'];

    var classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(score_points);
    }

    if (classToApply === 'incorrect') {
      onWrongAnswer();
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 500);
  });
});

// function to increment the user's score
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

var userName = document.querySelector('#username');
var saveScoreBtn = document.querySelector('#saveScoreBtn');
var finalScore = document.querySelector('#finalScore');
var mostRecentScore = localStorage.getItem('mostRecentScore');
var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
var MAX_HIGH_SCORES = 5;

// Displays the current score on the page
finalScore.innerText = mostRecentScore;

// When there is nothing in the form, the button is disabled
userName.addEventListener('keyup', (e) => {
  saveScoreBtn.disabled = !userName.value;
});

// Saves the mostRecentScore and userName to the local storage
saveHighScore = (e) => {
  e.preventDefault();

  var score = {
    score: mostRecentScore,
    name: userName.value,
  };

  highScores.push(score);

  highScores.sort((a, b) => {
    return b.score - a.score;
  });

  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
  finalScore.innerText = mostRecentScore;
  window.location.reload();
  return;
};

// Displays the high scores on the end container
var highScoresList = document.querySelector('.highScoresList');
var highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join('');
