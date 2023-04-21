//Getting all element by id and after used it by const variables
const quizSelector = document.getElementById("quiz-selector");
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const quizQuestion = document.getElementById("question");
const answerButtonsContainer = document.getElementById(
  "answer-buttons-container"
);
const nextButton = document.getElementById("next-button");
const quizResultContainer = document.getElementById("quiz-result-container");
const previousButton = document.getElementById("previous-button");

const loadAllQuizzes = async () => {
  const response = await fetch("./quizzes.json");
  const quizzesJSON = await response.json();
  quizzesJSON.forEach((quiz, index) => {
    const quizCard = document.createElement("div");
    quizCard.classList = ["quiz-card"];
    quizCard.innerText = "Quiz " + (index + 1);
    quizCard.addEventListener("click", () => loadQuiz(quiz));
    quizSelector.appendChild(quizCard);
  });
};
loadAllQuizzes();
const loadQuiz = (questions) => {
  const quiz = new Quiz(questions);
  quiz.displayQuestion();
  quiz.nextButton();
  quiz.previousButton();
  quizSelector.style.display = "none";
  quizContainer.style.display = "block";
  nextButton.style.display = "inline-block";
  nextButton.style.float = "left";
  previousButton.style.display = "inline-block";
  previousButton.style.float = "right";
};

class Quiz {
  constructor(questions) {
    this.questions = Quiz.unsortedArray(questions);
    this.currentQuestionIndex = 0;
    this.score = 0;
  }
  displayQuestion() {
    answerButtonsContainer.innerHTML = "";
    const currentQuestion = this.questions[this.currentQuestionIndex];
    questionContainer.innerHTML = currentQuestion.question;
    const answersArray = Quiz.unsortedArray(currentQuestion.answers);
    answersArray.forEach((answer) => {
      const answerButton = document.createElement("button");
      answerButton.classList = ["answer-button"];
      answerButton.innerHTML = answer;
      answerButton.addEventListener("click", this.selectedAnswer.bind(this));
      answerButtonsContainer.appendChild(answerButton);
    });

    console.log(this.currentQuestion);
  }
  nextButton() {
    nextButton.addEventListener("click", () => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.displayQuestion();
      } else {
        this.showUserResult();
      }
    });
  }
  previousButton() {
    previousButton.addEventListener("click", () => {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.displayQuestion();
      } else {
        quizContainer.style.display = "none";
        quizResultContainer.style.display = "none";
        quizSelector.style.display = "flex";
      }
    });
  }
  selectedAnswer(event) {
    const userAnswer = event.target.innerHTML;
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (userAnswer == currentQuestion.correctAnswer) {
      this.score++;
    }
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.displayQuestion();
    } else {
      this.showUserResult();
    }
  }

  showUserResult() {
    quizContainer.style.display = "none";
    quizResultContainer.style.display = "flex";
    quizResultContainer.innerHTML = `
        <h2>Quiz Result</h2>
        <p>Your final score is: ${this.score} out of ${this.questions.length} questions</p>
        <button id="reload-quiz">Reload Quiz</button>
        `;
    const reloadQuizButton = document.getElementById("reload-quiz");
    reloadQuizButton.addEventListener("click", () => {
      quizContainer.style.display = "none";
      quizResultContainer.style.display = "none";
      quizSelector.style.display = "flex";
    });
  }
  static unsortedArray(arr) {
    const getUnsortedArr = [...arr];
    return getUnsortedArr.sort(() => Math.random() - 0.5);
  }
}
