let hedgehogs = [];
let images = [];
let imagesLoaded = [];

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
    console.log(`Attempted to load ${imagePaths.length} images`);
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
    if (this.img && imagesLoaded[images.indexOf(this.img)]) {
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
}
