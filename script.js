// Matter.js module aliases
const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Composites } = Matter;

// Create engine and renderer
const engine = Engine.create();
const world = engine.world;

const canvasContainer = document.getElementById('canvas-container');
const render = Render.create({
  element: canvasContainer,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: '#f0f0f0'
  }
});

// Hedgehog images array
const hedgehogImages = [
  'images/hg.png',
  'images/hg2.png',
  'images/hg5.png',
  'images/hg6.png',
  'images/hg7 (1).png',
  'images/hg7 (2).png'
];

// Function to create a hedgehog
function createHedgehog(x, y) {
  const size = 50 + Math.random() * 50; // Random size between 50 and 100
  const hedgehogImg = hedgehogImages[Math.floor(Math.random() * hedgehogImages.length)];
  
  const hedgehog = Bodies.circle(x, y, size / 2, {
    restitution: 0.8, // Bounciness
    friction: 0.1,
    render: {
      sprite: {
        texture: hedgehogImg,
        xScale: size / 100, // Adjust scale based on image size
        yScale: size / 100
      }
    }
  });
  return hedgehog;
}

// Add initial hedgehogs
const hedgehogs = Composites.stack(100, 0, 5, 2, 20, 20, (x, y) => createHedgehog(x, y));
World.add(world, hedgehogs);

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false }
  }
});
World.add(world, mouseConstraint);

// Keep the mouse in sync with rendering
render.mouse = mouse;

// Add ground
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, {
  isStatic: true
});
World.add(world, ground);

// Add walls
const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
World.add(world, [leftWall, rightWall]);

// Add more hedgehogs periodically
setInterval(() => {
  const newHedgehog = createHedgehog(Math.random() * window.innerWidth, -50);
  World.add(world, newHedgehog);
}, 2000);

// Run the engine and renderer
Engine.run(engine);
Render.run(render);

// Resize canvas on window resize
window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
  Matter.Body.setPosition(leftWall, { x: -50, y: window.innerHeight / 2 });
  Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
});
