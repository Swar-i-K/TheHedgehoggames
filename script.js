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
  // Log to confirm images loaded
  console.log(`Loaded ${images.length} images`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create one hedgehog for each image
  images.forEach((img, i) => {
    hedgehogs.push(new Hedgehog(random(width), random(height), i));
  });
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
    if (hedgehog.isDragging) {
      hedgehog.isDragging = false;
      // Restore random velocity to resume floating
      hedgehog.vx = random(-9, 9);
      hedgehog.vy = random(-9, 9);
    }
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
  constructor(x, y, imgIndex) {
    this.x = x;
    this.y = y;
    this.vx = random(-9, 9);
    this.vy = random(-9, 9);
    this.size = 150;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    // Select image: use imgIndex if provided, else random
    this.img = images[imgIndex !== undefined ? imgIndex : floor(random(images.length))];
    // Log the image assigned to this hedgehog
    console.log(`Hedgehog assigned image: ${this.img.src}`);
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
