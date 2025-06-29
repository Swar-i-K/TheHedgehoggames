let hedgehogs = [];
let images = [];
let imagesLoaded = [];
let toggleImg;

function preload() {
  const imagePaths = [
    './hg.png',
    './hg2.png',
    './hg5.png',
    './hg6.png',
    './hg7 (1).png',
    './hg7 (2).png'
  ];
  try {
    imagePaths.forEach((path, i) => {
      images[i] = loadImage(path, 
        () => {
          console.log(`Loaded image: ${path}`);
          imagesLoaded[i] = true;
        },
        (err) => {
          console.error(`Failed to load image: ${path}`, err);
          imagesLoaded[i] = false;
        }
      );
    });
    toggleImg = loadImage('./hgb.png', 
      () => {
        console.log('Loaded toggle image: ./hgb.png');
        imagesLoaded[images.length] = true;
      },
      (err) => {
        console.error('Failed to load toggle image: ./hgb.png', err);
        imagesLoaded[images.length] = false;
      }
    );
    console.log(`Attempted to load ${imagePaths.length + 1} images`);
  } catch (err) {
    console.error('Error in preload:', err);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, P2D); // Use P2D for transparency
  images.forEach((img, i) => {
    if (imagesLoaded[i]) {
      hedgehogs.push(new Hedgehog(random(width), random(height), i));
    }
  });
  console.log('Image load status:', imagesLoaded);
  console.log('Repository URL: https://swar-i-k.github.io/TheHedgehoggames/');
}

function draw() {
  clear(); // Clear canvas to transparent
  for (let hedgehog of hedgehogs) {
    hedgehog.update();
    hedgehog.display();
  }
}

function mousePressed() {
  let anyDragging = false;
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isMouseOver()) {
      hedgehog.isDragging = true;
      hedgehog.offsetX = mouseX - hedgehog.x;
      hedgehog.offsetY = mouseY - hedgehog.y;
      anyDragging = true;
    }
  }
  if (!anyDragging) {
    for (let hedgehog of hedgehogs) {
      if (hedgehog.isMouseOver()) {
        hedgehog.toggleImage();
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
    this.originalImg = images[imgIndex !== undefined ? imgIndex : floor(random(images.length))];
    this.img = this.originalImg;
    this.isToggled = false;
    this.toggleTime = 0;
    console.log(`Hedgehog assigned image: ${this.originalImg.src}`);
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

    // Revert to original image after 2000ms (2 seconds)
    if (this.isToggled && millis() - this.toggleTime > 2000) {
      this.isToggled = false;
      this.img = this.originalImg;
    }
  }

  display() {
    if (this.img && imagesLoaded[images.indexOf(this.originalImg) || images.length]) {
      image(this.img, this.x, this.y, this.size, this.size);
    } else {
      fill(255, 0, 0); // Red rectangle fallback
      rect(this.x, this.y, this.size, this.size);
    }
  }

  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.size &&
           mouseY > this.y && mouseY < this.y + this.size;
  }

  toggleImage() {
    if (!this.isDragging) {
      this.isToggled = true;
      this.img = toggleImg;
      this.toggleTime = millis();
    }
  }
}
