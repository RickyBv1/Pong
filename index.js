const gameZone = document.getElementById("gameZone");

class Pallette {

    element;
    y = 0;
    speed = 10;
    movement;
    tall = 200;

    constructor() {
        this.element = document.createElement("div");
        this.element.classList = "pallette";
        gameZone.appendChild(this.element);
    }

    up() {
        if (!this.movement) {
            this.movement = setInterval(() => {
                this.y -= this.speed;
                if (this.y < 0) {
                    this.y = 0
                    this.freeze();
                };
                this.element.style.top = this.y + "px";
            }, 20)
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
                };
                this.element.style.top = this.y + "px";
            }, 20)
        }
    }

    freeze() {
        clearInterval(this.movement);
        this.movement = undefined;
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
    }

})

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

})

const p1 = new Pallette();
const p2 = new Pallette();