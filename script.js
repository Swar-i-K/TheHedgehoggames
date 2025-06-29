let hedgehogs = [];
let images = [];
let buttonHovered = false;

function preload() {
  images.push(loadImage('hg.png'));
  images.push(loadImage('hg2.png'));
  images.push(loadImage('hg5.png'));
  images.push(loadImage('hg6.png'));
  images.push(loadImage('hg7 (1).png'));
  images.push(loadImage('hg7 (2).png'));
  console.log(`Loaded ${images.length} images`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  images.forEach((img, i) => {
    hedgehogs.push(new Hedgehog(random(width), random(height), i));
  });
}

function draw() {
  background(240);

  // Draw button
  const buttonWidth = 200;
  const buttonHeight = 50;
  const buttonX = width / 2 - buttonWidth / 2;
  const buttonY = 20;

  // Check if mouse is over button
  buttonHovered = mouseX > buttonX && mouseX < buttonX + buttonWidth &&
                 mouseY > buttonY && mouseY < buttonY + buttonHeight;

  // Button style
  fill(buttonHovered ? '#1976D2' : '#2196F3'); // Blue, darker when hovered
  noStroke();
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10); // Rounded corners

  // Button text
  fill(255); // White text
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  text('MAKE IT RAIN!', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);

  for (let hedgehog of hedgehogs) {
    hedgehog.update();
    hedgehog.display();
  }
}

function mousePressed() {
  const buttonWidth = 200;
  const buttonHeight = 50;
  const buttonX = width / 2 - buttonWidth / 2;
  const buttonY = 20;

  if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    addHedgehogs();
  } else {
    for (let hedgehog of hedgehogs) {
      if (hedgehog.isMouseOver()) {
        hedgehog.isDragging = true;
        hedgehog.offsetX = mouseX - hedgehog.x;
        hedgehog.offsetY = mouseY - hedgehog.y;
      }
    }
  }
}

function mouseReleased() {
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isDragging) {
      hedgehog.isDragging = false;
      hedgehog.vx = random(-9, 9);
      hedgehog.vy = random(-9, 9);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function addHedgehogs() {
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
    this.img = images[imgIndex !== undefined ? imgIndex : floor(random(images.length))];
    console.log(`Hedgehog assigned image: ${this.img.src}`);
  }

  update() {
    if (!this.isDragging) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width - this.size) {
        this.vx *= -1;
      }
      if (this.y < 0 || this.y > height - this.size) {
        this.vy *= -1;
      }
    } else {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
      this.vx = 0;
      this.vy = 0;
    }
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
