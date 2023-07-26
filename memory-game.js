"use strict";

//Stuff to do:
//Styling.
//Decrement score with each wrong guess.
//Save Score?



/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];
let score = 100; //decrements as you guess. Determines finish message
let scoreDisplay = document.querySelector('#score');
let bestScore = localStorage.getItem('bestScore') || 0;

function modifyScore(){
  //decrements score on wrong guess and updates score display.
  score = (score > 0) ? score - 5 : 0;
  scoreDisplay.textContent = 'Score: ' + score;
}


function shuffle(items) {
  /** Shuffle array items in-place and return shuffled array. */
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.classList.add(color);
    card.classList.add('unflipped');
    card.addEventListener('click', handleCardClick);

    gameBoard.appendChild(card);
  }
}

/** Flip a card face-up. */
function flipCard(card) {
  card.classList.remove('unflipped');
}


/** Flip a card face-down. */
function unFlipCard(card) {
  let cb = () => {
    card.classList.add('unflipped');
    firstFlip = true;
    firstCard = null;
    resumeFlips();
  };
  setTimeout(cb, FOUND_MATCH_WAIT_MSECS);
  pauseFlips();
}

function pauseFlips(){
  let cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.removeEventListener('click', handleCardClick);
  });
}

function resumeFlips(){
  let cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    if (![...card.classList].includes('finished')){
      card.addEventListener('click', handleCardClick);
    }
  });
}


let firstCard;
let firstColor;
let firstFlip = true;

function handleCardClick(evt) {

  if (firstFlip){
    firstCard = evt.target;
    firstColor = firstCard.classList[1];
    flipCard(firstCard);
    firstFlip = false;
  } else {
    let secondCard = evt.target;
    let secondColor = secondCard.classList[1];
    if (secondCard == firstCard){
      console.log('probably should choose another card');
    } else {
      flipCard(secondCard);
      if (firstColor === secondColor){
        //They stay flipped, remove event listeners.
        firstCard.removeEventListener('click', handleCardClick);
        secondCard.removeEventListener('click', handleCardClick);
        firstCard.classList.add('finished');
        secondCard.classList.add('finished');
        firstFlip = true;
        firstCard = null;
      } else {
        unFlipCard(firstCard);
        unFlipCard(secondCard);
        modifyScore();
      }

    }
  }

  checkIfDone();
}

function checkIfDone(){
  //check if all cards are matched, if so finish game.
  let cards = document.querySelectorAll('.card');

  let allDone = true;
  cards.forEach(card => {
    if (![...card.classList].includes('finished')){
      allDone = false;
    }
  });

  if (allDone){
    console.log('got here');
    finishGame();
  }
}
function finishGame(){
  let finishScreen = document.querySelector('#finish');
  finishScreen.classList.remove('hide');

  let finishMessage = document.querySelector('#finish-message');
  let bestScoreMessage = document.querySelector('#best-score');

  bestScore = bestScore ? Math.max(score, bestScore) : score;
  localStorage.setItem('bestScore', bestScore);

  bestScoreMessage.textContent = "Best Score: " + bestScore;
  if (score > 80){
    finishMessage.textContent = "Excellent Job!"
  } else if (score > 60) {
    finishMessage.textContent = "Pretty good!"
  } else {
    finishMessage.textContent = "Not bad."
  }

  let restartButton = document.querySelector('#restart');
  restartButton.addEventListener('click', restartGame);
}

///Restart Game Functions
function restartGame(){
  let finishScreen = document.querySelector('#finish');
  finishScreen.classList.add('hide');
  clearBoard();
  startGame();
}
function clearBoard(){
  let gameBoard = document.getElementById("game");
  while (gameBoard.lastChild){
    gameBoard.removeChild(gameBoard.lastChild);
  }
}
function startGame(){
  score = 100;
  scoreDisplay.textContent = 'Score: ' + score;
  const colors = shuffle(COLORS);
  createCards(colors);
  startButton.classList.add('hide');
}


let startButton = document.querySelector('#start');
startButton.addEventListener('click', startGame);