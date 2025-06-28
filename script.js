let hedgehogs = [];
let images = [];

function preload() {
  // Load the six hedgehog images
  images.push(loadImage('hg.png'));
  images.push(loadImage('hg2.png'));
  images.push(loadImage('hg5.png'));
  images.push(loadImage('hg6.png'));
  images.push(loadImage('hg7 (1).png'));
  images.push(loadImage('hg7 (2).png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Start with 5 hedgehogs
  for (let i = 0; i < 5; i++) {
    hedgehogs.push(new Hedgehog(random(width), random(height)));
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
    if (hedgehog.isMouseOver()) {
      hedgehog.isDragging = true;
      hedgehog.offsetX = mouseX - hedgehog.x;
      hedgehog.offsetY = mouseY - hedgehog.y;
    }
  }
}

function mouseReleased() {
  for (let hedgehog of hedgehogs) {
    hedgehog.isDragging = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addHedgehogs() {
  // Add 3 more hedgehogs at random positions
  for (let i = 0; i < 3; i++) {
    hedgehogs.push(new Hedgehog(random(width), random(height)));
  }
}

class Hedgehog {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.size = 50;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    // Randomly select one of the six images
    this.img = images[floor(random(images.length))];
  }

  update() {
    if (!this.isDragging) {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > width - this.size) {
        this.vx *= -1;
      }
      if (this.y < 0 || this.y > height - this.size) {
        this.vy *= -1;
      }

      // Apply some gravity and friction
      this.vy += 0.1;
      this.vx *= 0.99;
      this.vy *= 0.99;
    } else {
      // Drag the hedgehog
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
      this.vx = 0;
      this.vy = 0;
    }

    // Keep within canvas
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);
  }

  display() {
    image(this.img, this.x, this.y, this.size, this.size);
  }

  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.size &&
           mouseY > this.y && mouseY < this.y + this.size;
  }
}
