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
  createCanvas(windowWidth, windowHeight, P2D);
  images.forEach((img, i) => {
    if (imagesLoaded[i]) {
      hedgehogs.push(new Hedgehog(random(width), random(height), i));
    }
  });
  // Add event listeners for "Get a Prickle!" button
  let prickleButton = document.getElementById('prickleButton');
  prickleButton.addEventListener('click', () => {
    for (let i = 0; i < 7; i++) {
      let imgIndex = floor(random(images.length));
      if (imagesLoaded[imgIndex]) {
        hedgehogs.push(new Hedgehog(random(width), random(height), imgIndex));
      }
    }
    console.log('Get a Prickle: Added 7 hedgehogs (click)');
  });
  prickleButton.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    for (let i = 0; i < 7; i++) {
      let imgIndex = floor(random(images.length));
      if (imagesLoaded[imgIndex]) {
        hedgehogs.push(new Hedgehog(random(width), random(height), imgIndex));
      }
    }
    console.log('Get a Prickle: Added 7 hedgehogs (touch)');
  });
  console.log('Image load status:', imagesLoaded);
  console.log('Repository URL: https://swar-i-k.github.io/TheHedgehoggames/');
}

function draw() {
  clear();
  for (let hedgehog of hedgehogs) {
    hedgehog.update();
    hedgehog.display();
  }
}

function mouseClicked() {
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isMouseOver(mouseX, mouseY) && !hedgehog.isToggled) {
      hedgehog.toggleImage();
      console.log('Mouse clicked, toggling to hgb.png');
      return;
    }
  }
}

function touchStarted() {
  if (touches.length > 0) {
    let x = touches[0].x;
    let y = touches[0].y;
    for (let hedgehog of hedgehogs) {
      if (hedgehog.isMouseOver(x, y) && !hedgehog.isToggled) {
        hedgehog.toggleImage();
        console.log('Touch started, toggling to hgb.png');
        return;
      }
    }
    for (let hedgehog of hedgehogs) {
      if (hedgehog.isMouseOver(x, y)) {
        hedgehog.isDragging = true;
        hedgehog.offsetX = x - hedgehog.x;
        hedgehog.offsetY = y - hedgehog.y;
        console.log('Started dragging hedgehog');
        return;
      }
    }
  }
  return false;
}

function mouseDragged() {
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isDragging) {
      hedgehog.x = mouseX - hedgehog.offsetX;
      hedgehog.y = mouseY - hedgehog.offsetY;
      hedgehog.vx = 0;
      hedgehog.vy = 0;
      console.log('Dragging hedgehog');
    }
  }
}

function touchMoved() {
  if (touches.length > 0) {
    for (let hedgehog of hedgehogs) {
      if (hedgehog.isDragging) {
        hedgehog.x = touches[0].x - hedgehog.offsetX;
        hedgehog.y = touches[0].y - hedgehog.offsetY;
        hedgehog.vx = 0;
        hedgehog.vy = 0;
        console.log('Dragging hedgehog (touch)');
      }
    }
  }
  return false;
}

function mouseReleased() {
  for (let hedgehog of hedgehogs) {
    if (hedgehog.isDragging) {
      hedgehog.isDragging = false;
      hedgehog.vx = random(-9, 9);
      hedgehog.vy = random(-9, 9);
      console.log('Released hedgehog, new velocities set');
    }
  }
}

function touchEnded() {
  mouseReleased();
  return false;
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
    }
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);

    if (this.isToggled && millis() - this.toggleTime > 2000) {
      this.isToggled = false;
      this.img = this.originalImg;
      console.log('Reverted to original image');
    }
  }

  display() {
    imageMode(CORNER);
    if (this.img && (imagesLoaded[images.indexOf(this.originalImg)] || (this.isToggled && imagesLoaded[images.length]))) {
      image(this.img, this.x, this.y, this.size, this.size);
    } else {
      fill(0, 0, 255);
      rect(this.x, this.y, this.size, this.size);
      console.log('Using fallback for image display');
    }
  }

  isMouseOver(x, y) {
    return x >= this.x && x <= this.x + this.size &&
           y >= this.y && y <= this.y + this.size;
  }

  toggleImage() {
    this.isToggled = true;
    this.img = toggleImg;
    this.toggleTime = millis();
    console.log('Toggled to hgb.png');
  }
}
