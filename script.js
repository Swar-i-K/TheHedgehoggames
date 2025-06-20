let hedgehogs = [];
let hedgehogImg, ballImg;
let imagesLoaded = { hedgehog: false, ball: false };

function preload() {
  try {
    // Load images from the repository root
    hedgehogImg = loadImage('hdghg fc.png', 
      () => {
        console.log('Hedgehog image loaded successfully: hdghg fc.png');
        imagesLoaded.hedgehog = true;
      },
      (err) => console.error('Failed to load hdghg fc.png:', err)
    );
    ballImg = loadImage('hdghg ball.png', 
      () => {
        console.log('Ball image loaded successfully: hdghg ball.png');
        imagesLoaded.ball = true;
      },
      (err) => console.error('Failed to load hdghg ball.png:', err)
    );
    // For testing, uncomment placeholders if images fail
    // hedgehogImg = loadImage('https://placekitten.com/50/50', 
    //   () => { console.log('Hedgehog placeholder loaded'); imagesLoaded.hedgehog = true; },
    //   (err) => console.error('Failed to load hedgehog placeholder:', err)
    // );
    // ballImg = loadImage('https://placekitten.com/50/50?image=2', 
    //   () => { console.log('Ball placeholder loaded'); imagesLoaded.ball = true; },
    //   (err) => console.error('Failed to load ball placeholder:', err)
    // );
  } catch (err) {
    console.error('Error in preload:', err);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 5; i++) {
    hedgehogs.push(new Hedgehog());
  }
  console.log('Image load status:', imagesLoaded);
  console.log('Repository URL: https://swarnaikhan.github.io/TheHedgehoggames/');
  console.log('Check files at: https://github.com/swarnaikhan/TheHedgehoggames');
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
    push();
    translate(this.x, this.y);
    if (this.isBall) {
      if (imagesLoaded.ball) {
        imageMode(CENTER);
        image(ballImg, 0, 0, 50, 50);
      } else {
        fill(255, 0, 0); // Red rectangle fallback
        rectMode(CENTER);
        rect(0, 0, 50, 50);
      }
    } else {
      if (imagesLoaded.hedgehog) {
        imageMode(CENTER);
        image(hedgehogImg, 0, 0, 50, 50);
      } else {
        fill(0, 255, 0); // Green rectangle fallback
        rectMode(CENTER);
        rect(0, 0, 50, 50);
      }
    }
    pop();
  }

  toggleImage() {
    this.isBall = !this.isBall;
    this.toggleTime = millis();
    if (this.isBall) {
      this.vy = -5; // Small upward boost
    }
  }
}
