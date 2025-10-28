let blobs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize 8 blobs for better connections
  for (let i = 0; i < 8; i++) {
    const radius = random(40, 90);
    blobs.push({
      x: random(100, width - 200),
      y: height + radius- random(300),
      vx: random(-1, 1) * 0.3,
      vy: -0.7 - random(0.7),
      radius: radius,
      targetRadius: radius,
      opacity: random(0.7, 1.0),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);

  // Update blob positions
  blobs.forEach((blob) => {
    blob.phase += 0.005;
    
    blob.x += blob.vx + sin(blob.phase) * 0.2;
    blob.y += blob.vy;

    // Reset when reaching top
    if (blob.y < -blob.radius - 100) {
      blob.y = height + blob.radius + random(100);
      blob.x = random(100, width - 200);
      blob.targetRadius = random(40, 90);
    }

    // Wrap horizontally
    if (blob.x < -blob.radius) blob.x = width + blob.radius;
    if (blob.x > width + blob.radius) blob.x = -blob.radius;

    // Smooth radius changes
    blob.radius += (blob.targetRadius - blob.radius) * 0.02;
    
    if (random() < 0.008) {
      blob.targetRadius = random(40, 90);
    }
  });

  // Draw connections between nearby blobs
  blobs.forEach((blob1, i) => {
    blobs.forEach((blob2, j) => {
      if (i >= j) return;

      const dx = blob2.x - blob1.x;
      const dy = blob2.y - blob1.y;
      const distance = dist(blob1.x, blob1.y, blob2.x, blob2.y);
      const maxDistance = blob1.radius + blob2.radius + 60;

      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        const midX = (blob1.x + blob2.x) / 2;
        const midY = (blob1.y + blob2.y) / 2;

        // Draw connecting gradient
        const ctx = drawingContext;
        const gradient = ctx.createRadialGradient(
          midX, midY, 0,
          midX, midY, distance / 2
        );
        gradient.addColorStop(0, `rgba(255, 60, 60, ${strength * 0.6})`);
        gradient.addColorStop(1, "rgba(255, 60, 60, 0)");

        ctx.fillStyle = gradient;
        noStroke();
        circle(midX, midY, distance);
      }
    });
  });

  // Draw individual blobs
  blobs.forEach((blob) => {
    push();

    // Soft outer glow
    const ctx = drawingContext;
    const outerGradient = ctx.createRadialGradient(
      blob.x, blob.y, 0,
      blob.x, blob.y, blob.radius * 1.8
    );
    outerGradient.addColorStop(0, `rgba(255, 50, 50, ${blob.opacity * 0.4})`);
    outerGradient.addColorStop(0.5, `rgba(255, 40, 40, ${blob.opacity * 0.2})`);
    outerGradient.addColorStop(1, "rgba(255, 30, 30, 0)");

    ctx.fillStyle = outerGradient;
    noStroke();
    circle(blob.x, blob.y, blob.radius * 1.8 * 2);

    // Main circular blob with gradient
    const blobGradient = ctx.createRadialGradient(
      blob.x - blob.radius * 0.3,
      blob.y - blob.radius * 0.3,
      0,
      blob.x, blob.y, blob.radius
    );
    blobGradient.addColorStop(0, `rgba(255, 90, 90, ${blob.opacity})`);
    blobGradient.addColorStop(0.6, `rgba(230, 50, 50, ${blob.opacity * 0.95})`);
    blobGradient.addColorStop(1, `rgba(200, 30, 30, ${blob.opacity * 0.85})`);

    ctx.fillStyle = blobGradient;
    noStroke();
    circle(blob.x, blob.y, blob.radius * 2);

    pop();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}