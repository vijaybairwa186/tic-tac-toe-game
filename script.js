console.log("Welcome to Tic Tac Toe");

let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");
let turn = "X";
let isgameover = false;

const changeTurn = () => {
  return turn === "X" ? "O" : "X";
};

const checkWin = () => {
  let boxtext = document.getElementsByClassName("boxtext");
  let wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  wins.forEach((e) => {
    if (
      boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
      boxtext[e[0]].innerText !== ""
    ) {
      document.querySelector(".info").innerText =
        boxtext[e[0]].innerText + " Won";
      isgameover = true;
      gameover.play();
      document
        .querySelector(".imgbox")
        .getElementsByTagName("img")[0].style.width = "200px";
    }
  });
};

const aiMove = () => {
  if (isgameover) return;
  let emptyBoxes = [];
  let boxes = document.getElementsByClassName("boxtext");

  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === "") {
      emptyBoxes.push(i);
    }
  }

  if (emptyBoxes.length === 0) return;

  let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
  boxes[randomIndex].innerText = "O";
  boxes[randomIndex].style.color = "red";
  audioTurn.play();
  checkWin();
  if (!isgameover) {
    turn = "X";
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
  }
};

let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element) => {
  let boxtext = element.querySelector(".boxtext");
  element.addEventListener("click", () => {
    if (boxtext.innerText === "" && !isgameover && turn === "X") {
      boxtext.innerText = turn;
      boxtext.style.color = "blue";
      audioTurn.play();
      checkWin();
      if (!isgameover) {
        turn = changeTurn();
        document.getElementsByClassName("info")[0].innerText = "AI Thinking...";
        setTimeout(aiMove, 500);
      }
    }
  });
});

document.getElementById("reset").addEventListener("click", () => {
  let boxtexts = document.querySelectorAll(".boxtext");
  Array.from(boxtexts).forEach((element) => {
    element.innerText = "";
    element.style.color = "black";
  });

  turn = "X";
  isgameover = false;
  document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
  document.querySelector(".imgbox").getElementsByTagName("img")[0].style.width =
    "0px";
});
