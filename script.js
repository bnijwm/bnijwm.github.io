let size = 400;
let minBallSize = size * 0.01;
let maxBallSize = size * 0.02;
let maxV = size * 0.003;

const colors = [
  "#EF964E",
  "#E65C19",
  "#CE3C47",
  "#B51B75",
  "#8D1470",
  "#640D6B"
];

let circles = [];
let lines = [];

class Circle {
  constructor(i, x, y, radius, v) {
    this.index = i;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = v;
    this.connections = [];
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x > size + this.radius) {
      this.x = -this.radius;
      this.y = random(size);
    }
    if (this.x < -this.radius) {
      this.x = size + this.radius;
      this.y = random(size);
    }
    if (this.y > size + this.radius) {
      this.y = -this.radius;
      this.x = random(size);
    }
    if (this.y < -this.radius) {
      this.y = size + this.radius;
      this.x = random(size);
    }
    this.connections = [];
  }

  draw() {
      
    let nConnections = this.connections.length;
    if (nConnections > colors.length - 1) nConnections = colors.length - 1;
    stroke(colors[nConnections]);
    fill(colors[nConnections]);
    circle(this.x, this.y, this.radius);
  }
}

function createCircles() {
  circles = [];
  for (let i = 0; i < size / 5; i++) {
    const circle = new Circle(
      i,
      random(size),
      random(size),
      minBallSize + random(maxBallSize),
      {
        x: maxV * -0.5 + random(maxV),
        y: maxV * -0.5 + random(maxV)
      }
    );
    circles.push(circle);
  }
}

function setup() {
  resize();
  const c = createCanvas(size, size);
  c.parent("canvas");
}

function draw() {
  clear();
  for (let i = 0; i < circles.length; i++) {
    circles[i].update();
  }
  detectConnections();
  for (let i = 0; i < circles.length; i++) {
    circles[i].draw();
  }

  for (let i = 0; i < lines.length; i++) {
    const a = circles[lines[i][0]];
    const b = circles[lines[i][1]];
    let nConnections = max(a.connections.length, b.connections.length);
    if (nConnections > colors.length - 1) nConnections = colors.length - 1;
      
    const c = color(colors[nConnections]);
    c.setAlpha(20);
    stroke(c);
    line(a.x, a.y, b.x, b.y);
  }
}

function detectConnections() {
  lines = [];
  for (let a = 0; a < circles.length; a++) {
    for (let b = 0; b < circles.length; b++) {
      if (a === b) continue;
      const d = dist(circles[a].x, circles[a].y, circles[b].x, circles[b].y);
      if (d < size * 0.1) {
        circles[a].connections.push(b);
        circles[b].connections.push(a);
        lines.push([a, b]);
      }
    }
  }
}

function resize() {
  if (windowWidth < 400) {
    size = windowWidth * 0.8;
  } else {
    size = 400;
  }
  minBallSize = size * 0.01;
  maxBallSize = size * 0.02;
  maxV = size * 0.003;
  resizeCanvas(size, size);
  createCircles();
}

function windowResized() {
  resize();
}

requestAnimationFrame(() => {});
