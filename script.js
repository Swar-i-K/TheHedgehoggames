let hedgehogs = [];
let images = [];
let hgbImage;

function preload() {
  // Load the six hedgehog images and hgb.png
  try {
    images.push(loadImage('hg.png'));
    images.push(loadImage('hg2.png'));
    images.push(loadImage('hg5.png'));
    images.push(loadImage('hg6.png'));
    images.push(loadImage('hg7 (1).png'));
    images.push(loadImage('hg7 (2).png'));
    hgbImage = loadImage('hgb.png');
    console.log(`Loaded ${images.length} main images and hgb.png`);
  } catch (e) {
    console.error('Error loading images:', e);
  }
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
      // Toggle image to hgb.png on click
      hedgehog.toggleImage();
      // Mark for potential dragging
      hedgehog.isClicked = true;
      hedgehog.clickX = mouseX;
      hedgehog.clickY = mouseY;
      hedgehog.offsetX = mouseX - hedgehog.x;
      hedgehog.offsetY = mouseY - hedgehog.y;
    }
  }
}

function mouseDragged() {
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isClicked) {
      // Start dragging only if mouse moves significantly
      let dx = mouseX - hedgehog.clickX;
      let dy = mouseY - hedgehog.clickY;
      if (sqrt(dx * dx + dy * dy) > 5) {
        hedgehog.isDragging = true;
      }
    }
  }
}

function mouseReleased() {
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isDragging || hedgehog.isClicked) {
      hedgehog.isDragging = false;
      hedgehog.isClicked = false;
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
    this.isClicked = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.isToggled = false;
    this.toggleTime = 0;
    // Select image: use imgIndex if provided, else random
    this.originalImgIndex = imgIndex !== undefined ? imgIndex : floor(random(images.length));
    this.img = images[this.originalImgIndex];
    // Log the image assigned to this hedgehog
    console.log(`Hedgehog assigned image: ${this.img.src}`);
  }

  toggleImage() {
    if (!this.isToggled) {
      this.img = hgbImage;
      this.isToggled = true;
      this.toggleTime = millis();
      console.log(`Toggled to hgb.png at ${this.toggleTime}ms: ${this.img.src}`);
    }
  }

  update() {
    // Check toggle timer even during dragging
    if (this.isToggled && millis() - this.toggleTime > 2000) {
      this.img = images[this.originalImgIndex];
      this.isToggled = false;
      console.log(`Reverted to original image at ${millis()}ms: ${this.img.src}`);
    }

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
