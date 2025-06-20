let hedgehogs = [];
let hedgehogImg, ballImg;

function preload() {
  // Load images from the same directory (relative paths for GitHub Pages)
  hedgehogImg = loadImage('hdghg.jpg');
  ballImg = loadImage('hdghg ball.png');
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
      hedgehog.toggleImage();
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
    this.toggleTime = 0;
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

    // Revert image after 50ms
    if (this.isBall && millis() - this.toggleTime > 50) {
      this.isBall = false;
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

  toggleImage() {
    this.isBall = !this.isBall;
    this.toggleTime = millis(); // Record time of toggle
    if (this.isBall) {
      this.vy = -5; // Small upward boost when curling
    }
  }
}
