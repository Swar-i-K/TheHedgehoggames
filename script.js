let hedgehogs = [];
let hedgehogImg, ballImg;

function preload() {
  // Using reliable online placeholder images to avoid fetch errors
  hedgehogImg = loadImage('https://picsum.photos/50/50?random=1');
  ballImg = loadImage('https://picsum.photos/50/50?random=2');
  // To use local images, uncomment the lines below and ensure files are in the same directory
  // hedgehogImg = loadImage('hdghg.jpg');
  // ballImg = loadImage('hdghg ball.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 5; i++) {
    hedgehogs.push(new Hedgehog());
  }
}

function draw() {
  background(240);
  for (let hedgehog of hedgehogs) {
    hedgehog.update();
    hedgehog.display();
  }
}

function mousePressed() {
  for (let hedgehog of hedgehogs) {
    let d = dist(mouseX, mouseY, hedgehog.x, hedgehog.y);
    if (d < 25) {
      hedgehog.toggleState();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Hedgehog {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-3, 3);
    this.vy = random(-3, 3);
    this.isBall = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 25 || this.x > width - 25) {
      this.vx *= -1;
    }
    if (this.y < 25 || this.y > height - 25) {
      this.vy *= -1;
    }

    // Apply gravity when not in ball state
    if (!this.isBall) {
      this.vy += 0.1;
    }
  }

  display() {
    imageMode(CENTER);
    if (this.isBall) {
      image(ballImg, this.x, this.y, 50, 50);
    } else {
      image(hedgehogImg, this.x, this.y, 50, 50);
    }
  }

  toggleState() {
    this.isBall = !this.isBall;
    if (this.isBall) {
      this.vy = -5; // Small upward boost when curling
    }
  }
}
