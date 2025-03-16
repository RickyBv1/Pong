const gameZone = document.getElementById("gameZone");
let ball;
const helpMargin = 10;
const messageElement = document.getElementById("message");
let gameStatus = "PLAY";
const audioScore = new Audio("audio/score.mp3");
const audioHit = new Audio("audio/hit.mp3");
const instructionsElement = document.getElementById("instructions");

class Pallette {
  y;
  x;
  tall = 200;
  width = 20;
  element;
  cpu;
  movement;
  speed = 15;

  constructor(id) {
    this.element = document.createElement("div");
    this.element.classList = "pallette";
    this.element.id = id;
    this.element.style.height = this.tall + "px"
    this.element.style.width = this.width + "px"
    gameZone.appendChild(this.element)
    this.resetPosition();
  }

  down() {
    if (!this.movement) {
      this.movement = setInterval(() => {
        this.y += this.speed;
        if (this.y > document.body.clientHeight - this.tall)
          this.y = document.body.clientHeight - this.tall;
        this.element.style.top = this.y + "px"
      }, 10);
    }
  }

  up() {
    if (!this.movement) {
      this.movement = setInterval(() => {
        this.y += this.speed * -1;
        if(this.y < 0) this.y = 0;
        this.element.style.top = this.y + "px";
      }, 10);
    }
  }

  freeze() {
    if(this.movement) {
      clearInterval(this.movement);
      this.movement = false;
    }
  }

  toggleCPU(disable = false) {
    if (!this.cpu && disable === false) {
      this.freeze();
      this.cpu = setInterval(() => {
        if(ball) {
          const palletteCenter = this.y + this.tall / 2;
          this.freeze();
          if(
            Math.abs(ball.y + this.width / 2 - palletteCenter) < 
            this.width / 2
          ) {}
          else if (ball.y + this.width / 2 < palletteCenter) {
            this.up();
          } else {
            this.down();
          }
        } else this.resetPosition();
      }, 20);
    } else {
      clearInterval(this.movement);
      this.movement = false;
      clearInterval(this.cpu);
      this.cpu = false;
    }
  }

  resetPosition() {
    this.freeze();
    this.y = document.body.clientHeight / 2 - this.tall / 2;
    this.element.style.top = this.y + "px";
  }

  getCenter() {
    return this.y + this.tall / 2;
  }
}

class Ball {
  x;
  y;
  width = 50;
  xd = -15;
  yd = 0; //"d" means differential
  element;
  movement;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "ball";
    gameZone.appendChild(this.element);
    this.element.style.width = this.width + "px";
    this.resetPosition();
    this.move();
  }

  move() {
    if (!this.movement) {
      this.movement = setInterval(() => {
        this.x += this.xd;
        this.y += this.yd;

        //Pallettes
        //Pallette p1
        if (
          this.x < 0 + p1.width &&
          this.getCenter() + helpMargin > p1.y &&
          this.y - this.width / 2 - helpMargin < p1.y + p1.tall
        ) {
          this.yd += this.yVariation(p1);
          this.xd = this.xd * -1;
          this.x += this.xd;
          audioHit.play();
        }
        //pallette p2
        else if (
          this.x > document.body.clientWidth - p2.width - this.width &&
          this.getCenter() + helpMargin > p2.y &&
          this.y - this.width / 2 - helpMargin < p2.y + p1.tall
        ) {
          this.yd += this.yVariation(p2);
          this.xd = this.xd * -1;
          this.x += this.xd;
          audioHit.play();
        }

        //add a point
        else if(
          this.x < 0 ||
          this.x > document.body.clientWidth - this.width
        ) {
          if(this.x < 100) addPoint(2);
          else addPoint(1);
          this.resetPosition();
          
        }

        //vertical movement
        if(this.y < 0 || this.y > document.body.clientHeight - this.width) {
          this.yd = this.yd * -1;
          this.y += this.yd
        }

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  delete() {
    clearInterval(this.movement);
    gameStatus = "PAUSE"
    gameZone.removeChild(this.element);
  }

  resetPosition() {
    this.x = document.body.clientWidth / 2 - this.width / 2;
    this.y = document.body.clientHeight / 2 - this.width / 2;
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  yVariation(p) {
    const diffence = this.getCenter() - p.getCenter();
    return diffence / 10;
  }

  getCenter() {
    return this.y + this.width / 2;
  }
}

class Board {
  element;
  p1Score = 0;
  p2Score = 0;
  maxScore = 6;

  constructor() {
    this.element = document.createElement("p");
    this.element.id = "board";
    gameZone.appendChild(this.element);
    this.reset();
  }

  reset() {
    this.p1Score = 0;
    this.p2Score = 0;
    this.updateText();
  }

  updateText() {
    this.element.textContent = this.p1Score + " - " + this.p2Score;
  }

  add(p) {
    if (p === 1) this.p1Score++;
    else this.p2Score++;
    this.updateText();
    if(this.p1Score >= this.maxScore) win(1);
    if(this.p2Score >= this.maxScore) win(2);
  }
}

//Keyboard control
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown":
      if (!p2.cpu) p2.down();
      break;
    case "ArrowUp":
      if (!p2.cpu) p2.up();
      break;
    case "s":
      if (!p1.cpu) p1.down();
      break;
    case "w":
      if (!p1.cpu) p1.up();
      break;
    case "1":
      p1.toggleCPU();
      break;
    case "2":
      p2.toggleCPU();
      break;
    case " ":
      if (!ball) gameStart();
      break;
  }
});

//Stop the pallettes
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowDown":
    case "ArrowUp":
      if (!p2.cpu) p2.freeze();
      break;
    case "w":
    case "s":
      if (!p1.cpu) p1.freeze();
      break;
  }
});

function gameStart() {
messageElement.textContent = "";
if(gameStatus === "END") board.reset();
gameStatus = "PLAY";
ball = new Ball();
board.element.classList.toggle("spark", false);
instructionsElement.classList.toggle("hidden", true);
}

function addPoint(p) {
  ball.delete();
  ball = undefined;
  messageElement.textContent = 'Press "space" to continue';
  audioScore.currentTime = 0;
  audioScore.play();
  board.add(p);
}

function win(p) {
board.element.classList.toggle("spark", true);
p1.toggleCPU(true);
p2.toggleCPU(true);
gameStatus = "END";
messageElement.textContent = "Player N" + p + " win!!";
}

//Execution
const board = new Board();
const p1 = new Pallette("pallette1")
const p2 = new Pallette("pallette2")
