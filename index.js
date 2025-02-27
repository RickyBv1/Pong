const gameZone = document.getElementById("gameZone");

class Pallette {
  element;
  y = 0;
  speed = 10;
  movement;
  tall = 200;
  width = 20;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList = "pallette";
    gameZone.appendChild(this.element);
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
          console.log("score");
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
  }
}

class Board {

    p1Score = 0;
    p2Score = 0;

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
      ball = new Ball();
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
let ball = new Ball();
const board = new Board();
