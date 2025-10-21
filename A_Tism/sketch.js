let bursts = [];
let bulbs = [];

function setup() {
  createCanvas(800, 400);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  
  // Create three different bulbs
  bulbs = [
    { x: 150, y: 150, type: 'incandescent', label: 'INCANDESCENT' },
    { x: 400, y: 150, type: 'fluorescent', label: 'FLUORESCENT' },
    { x: 650, y: 150, type: 'led', label: 'LED' }
  ];
}

function draw() {
  background(255, 240, 200);
  
  // Check for hover and create bursts
  for (let bulb of bulbs) {
    let d = dist(mouseX, mouseY, bulb.x, bulb.y);
    let hoverRadius = 50; // Adjust this to change hover sensitivity
    
    if (d < hoverRadius) {
      let burstChance;
      if (bulb.type === 'incandescent') burstChance = 0.12; // Most bursts
      else if (bulb.type === 'fluorescent') burstChance = 0.04; // Least bursts
      else burstChance = 0.08; // LED - medium bursts
      
      if (random() < burstChance) {
        createBurst(bulb.x, bulb.y, bulb.type);
      }
    }
  }
  
  // Draw and update bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    bursts[i].update();
    bursts[i].display();
    if (bursts[i].isDead()) {
      bursts.splice(i, 1);
    }
  }
  
  // Draw bulbs
  for (let bulb of bulbs) {
    drawBulb(bulb);
  }
}

function drawBulb(bulb) {
  push();
  translate(bulb.x, bulb.y);
  
  // Draw based on bulb type
  if (bulb.type === 'incandescent') {
    // Classic round bulb with thick outline
    strokeWeight(4);
    stroke(0);
    fill(220);
    ellipse(0, 0, 60, 80);
    fill(255, 230, 150);
    ellipse(0, 5, 40, 50);
    // Filament
    noFill();
    strokeWeight(2);
    beginShape();
    vertex(-10, -5);
    vertex(-5, 0);
    vertex(5, 5);
    vertex(10, 0);
    endShape();
    // Base with lines
    strokeWeight(4);
    fill(180);
    rect(-15, 40, 30, 20);
    line(-15, 45, 15, 45);
    line(-15, 52, 15, 52);
  } else if (bulb.type === 'fluorescent') {
    // Tube shape with bold outline
    strokeWeight(4);
    stroke(0);
    fill(220);
    rect(-40, -10, 80, 20, 10);
    fill(200, 240, 255);
    rect(-38, -8, 76, 16, 8);
    // Highlight line
    strokeWeight(2);
    stroke(255);
    line(-35, -5, 30, -5);
    // Ends
    stroke(0);
    strokeWeight(4);
    fill(100);
    rect(-45, -5, 10, 10);
    rect(35, -5, 10, 10);
  } else if (bulb.type === 'led') {
    // Modern LED bulb
    strokeWeight(4);
    stroke(0);
    fill(240);
    ellipse(0, 0, 50, 60);
    fill(255, 250, 200);
    ellipse(0, 0, 35, 45);
    // Heat sink lines - bold
    strokeWeight(3);
    for (let i = -2; i <= 2; i++) {
      line(-20, 35 + i * 6, 20, 35 + i * 6);
    }
  }
  
  // Label with comic font style
  fill(0);
  strokeWeight(0);
  textAlign(CENTER);
  textSize(14);
  textStyle(BOLD);
  text(bulb.label, 0, 85);
  
  pop();
}

function createBurst(x, y, bulbType) {
  let numParticles;
  if (bulbType === 'incandescent') numParticles = int(random(0, 15)); // More particles
  else if (bulbType === 'fluorescent') numParticles = int(random(0, 200)); // Fewer particles
  else numParticles = int(random(0, 5)); // LED - medium
  
  for (let i = 0; i < numParticles; i++) {
    bursts.push(new Burst(x, y));
  }
}

class Burst {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    let angle = random(TWO_PI);
    let speed = random(4, 10);
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.life = 255;
    this.size = random(8, 16);
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.3, 0.3);
    this.style = int(random(3)); // Different burst styles
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.life -= 6;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    
    let alpha = this.life;
    strokeWeight(3);
    stroke(139, 0, 0, alpha); // Dark red outline
    
    if (this.style === 0) {
      // Star burst
      fill(255, 50, 50, alpha);
      star(0, 0, this.size * 0.4, this.size, 4);
    } else if (this.style === 1) {
      // Sharp triangle
      fill(255, 30, 30, alpha);
      triangle(0, -this.size, -this.size * 0.6, this.size * 0.5, this.size * 0.6, this.size * 0.5);
    } else {
      // Jagged burst
      fill(255, 60, 60, alpha);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = (TWO_PI / 6) * i;
        let r = i % 2 === 0 ? this.size : this.size * 0.5;
        vertex(cos(angle) * r, sin(angle) * r);
      }
      endShape(CLOSE);
    }
    
    // White hot center
    fill(255, 255, 200, alpha * 0.8);
    noStroke();
    ellipse(0, 0, this.size * 0.4);
    
    pop();
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI/2; a < TWO_PI - PI/2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}