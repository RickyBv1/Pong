const gameZone = document.getElementById("gameZone");
let ball;
const messageElement = document.getElementById("message");
const instructionsElement = document.getElementById("instructions")
gameStatus = "PAUSE";

class Pallette {
  element;
  y = 0;
  speed = 15;
  movement;
  tall = 200;
  width = 20;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "pallette";
    gameZone.children[0].appendChild(this.element);
    this.resetPosition();
  }

  up() {
    if (!this.movement) {
      this.movement = setInterval(() => {
        this.y -= this.speed;
        if (this.y < 0) {
          this.y = 0;
          this.freeze();
        }
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  down() {
    if (!this.movement) {
      this.movement = setInterval(() => {
        this.y += this.speed;
        const limit = document.body.clientHeight - this.tall;
        if (this.y > limit) {
          this.y = limit;
          this.freeze();
        }
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  freeze() {
    clearInterval(this.movement);
    this.movement = undefined;
  }

  resetPosition() {
    this.y = document.body.clientHeight / 2 - this.tall / 2
    this.element.style.top = this.y + "px";
  }

}

class Ball {
  x;
  y;
  xd = -10;
  yd = -10; //"d" means differential
  width = 30;
  movement;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "ball";
    gameZone.appendChild(this.element);
    this.resetPosition();
    this.move();
    messageElement.classList = "hidden";
    instructionsElement.classList.toggle("hidden" ,true);
  }

  resetPosition() {
    this.x = document.body.clientWidth / 2 - this.width / 2;
    this.element.style.left = this.x + "px";
    this.y = document.body.clientHeight / 2 - this.width / 2;
    this.element.style.top = this.y + "px";
  }

  move() {
    if (!this.movement) {
      this.movement = setInterval(() => {
        //horizontal movement
        this.x += this.xd;

        //pallette impact
        //pallette p1
        if (
          this.x < 0 + p1.width &&
          this.y + this.width / 2 > p1.y &&
          this.y + this.width / 2 < p1.y + p1.tall
        ) {
          this.xd = this.xd * -1;
        }
        //pallette p2
        if (
          this.x + this.width > document.body.clientWidth - p2.width &&
          this.y + this.width / 2 > p2.y &&
          this.y + this.width / 2 < p2.y + p2.tall
        ) {
          this.xd = this.xd * -1;
        }

        //add a point
        if (this.x < 0 || this.x > document.body.clientWidth - this.width) {
          board.add(this.x < 100 ? 2 : 1);
        }
        this.element.style.left = this.x + "px";

        //vertical movement
        this.y += this.yd;
        if (this.y < 0 || this.y > document.body.clientHeight - this.width) {
          this.yd = this.yd * -1;
        }
        this.element.style.top = this.y + "px";
      }, 20);
    }
  }

  delete() {
    clearInterval(this.movement);
    gameZone.removeChild(this.element);
    ball = undefined;
  }
}

class Board {

    p1Score = 0;
    p2Score = 0;
    maxScore = 2;

    constructor() {
        this.element = document.createElement("p");
        this.element.id = "board";
        gameZone.appendChild(this.element);
        this.updateText();
      }

      updateText() {
        this.element.textContent = this.p1Score + " - " + this.p2Score;
      }

      add(p){
        if(p === 1) this.p1Score++
        else this.p2Score++
        this.updateText();
        ball.delete();
        p1.resetPosition();
        p2.resetPosition();
        messageElement.textContent = 'press "space" to continue';
        messageElement.classList.toggle("hidden", false);
        this.gameStatus = "PAUSE";
        if(this.p1Score >= this.maxScore) {
          this.win(1)
        } else if(this.p2Score >= this.maxScore) {
          this.win(2)
        }
      }

      win(p) {
        messageElement.textContent = 'Player ' + p + ' win!'
        messageElement.classList.toggle("spark", true);
        gameStatus = "END"
      }

      reset() {
        this.p1Score = 0;
        this.p2Score = 0;
        this.updateText();
        messageElement.classList.toggle("spark", false);
      }

}

document.addEventListener("keydown", (e) => {
  console.log(e);
  switch (e.key) {
    case "w":
      p1.up();
      break;
    case "s":
      p1.down();
      break;
    case "ArrowUp":
      p2.up();
      break;
    case "ArrowDown":
      p2.down();
      break;
    case " ":
      if(gameStatus === "END") board.reset();
      if(!ball) ball = new Ball();
      gameStatus = "PLAY";
      break;
  }
});

document.addEventListener("keyup", (e) => {
  console.log(e);
  switch (e.key) {
    case "w":
    case "s":
      p1.freeze();
      break;

    case "ArrowUp":
    case "ArrowDown":
      p2.freeze();
      break;
  }
});

const p1 = new Pallette();
const p2 = new Pallette();
const board = new Board();
