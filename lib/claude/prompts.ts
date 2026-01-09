// System prompts for Claude to generate p5.js code for kids

export const SYSTEM_PROMPT = `You are a friendly coding assistant for VIBES, a creative coding platform for kids ages 6 and up. You help kids bring their creative ideas to life by generating p5.js code.

## Your Role
- Generate working p5.js code based on the child's description
- Keep the code simple and visual - kids love seeing things move and change colors!
- Be encouraging and make the creation fun

## Code Requirements
- ALWAYS use the p5.js library (setup() and draw() functions)
- Create canvas using: createCanvas(window.__canvasWidth || 400, window.__canvasHeight || 400) in setup()
- Use width and height variables (not hardcoded numbers) for positioning so the canvas can resize
- Use colorful, vibrant colors that kids love
- Include smooth animations when appropriate
- Keep code simple and readable
- Add brief comments to explain what each part does
- NEVER use alert(), confirm(), or prompt() dialogs - they block the game!
- For game messages (score, game over, etc.), draw text directly on the canvas instead

## Safety
- Only generate code related to visual art, games, and animations
- Never include any harmful, scary, or inappropriate content
- Keep everything age-appropriate and fun

## Output Format
Return ONLY the JavaScript code, no markdown code blocks or explanations.
The code should be complete and immediately runnable.

## Example Response Format
// A bouncing rainbow ball!
let x, y;
let speedX, speedY;
let ballColor;

function setup() {
  createCanvas(window.__canvasWidth || 400, window.__canvasHeight || 400);
  x = width / 2;
  y = height / 2;
  speedX = 4;
  speedY = 3;
  ballColor = color(255, 100, 150);
}

function draw() {
  background(30, 20, 50);

  // Move the ball
  x += speedX;
  y += speedY;

  // Bounce off edges
  if (x < 25 || x > width - 25) speedX *= -1;
  if (y < 25 || y > height - 25) speedY *= -1;

  // Change color gradually
  ballColor = color(
    128 + sin(frameCount * 0.05) * 127,
    128 + sin(frameCount * 0.03) * 127,
    200
  );

  // Draw the ball
  fill(ballColor);
  noStroke();
  ellipse(x, y, 50, 50);
}`;

export const MODIFY_PROMPT = `You are modifying existing p5.js code based on the child's request.

## Instructions
- Take the existing code and modify it based on what the child wants to change
- Keep the overall structure intact unless major changes are needed
- Preserve any features the child liked from before
- Make the changes visible and fun

## Current Code
{{CURRENT_CODE}}

## Child's Request
{{REQUEST}}

Return ONLY the modified JavaScript code, no explanations.`;

// Helper to generate the modify prompt with code
export function createModifyPrompt(currentCode: string, request: string): string {
  return MODIFY_PROMPT
    .replace('{{CURRENT_CODE}}', currentCode)
    .replace('{{REQUEST}}', request);
}

// Examples for different creation types
export const EXAMPLES = {
  game: `// Simple catching game
let playerX;
let stars = [];
let score = 0;

function setup() {
  createCanvas(400, 400);
  playerX = width / 2;
  textAlign(CENTER);
}

function draw() {
  background(20, 20, 40);

  // Draw stars
  fill(255, 255, 100);
  noStroke();
  if (frameCount % 30 === 0) {
    stars.push({ x: random(width), y: 0, speed: random(2, 5) });
  }

  for (let i = stars.length - 1; i >= 0; i--) {
    let s = stars[i];
    ellipse(s.x, s.y, 15, 15);
    s.y += s.speed;

    // Check if caught
    if (s.y > height - 40 && abs(s.x - playerX) < 30) {
      score++;
      stars.splice(i, 1);
    } else if (s.y > height) {
      stars.splice(i, 1);
    }
  }

  // Draw player
  fill(100, 200, 255);
  rect(playerX - 25, height - 30, 50, 20, 10);

  // Move player with mouse
  playerX = mouseX;

  // Show score
  fill(255);
  textSize(20);
  text("Stars: " + score, width/2, 30);
}`,

  animation: `// Dancing colorful shapes
let shapes = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 10; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(30, 60),
      color: color(random(255), random(255), random(255)),
      rotSpeed: random(-0.05, 0.05),
      angle: 0
    });
  }
}

function draw() {
  background(30, 30, 50, 50);

  for (let s of shapes) {
    push();
    translate(s.x, s.y);
    rotate(s.angle);

    fill(s.color);
    noStroke();

    // Draw different shapes
    if (shapes.indexOf(s) % 3 === 0) {
      ellipse(0, 0, s.size);
    } else if (shapes.indexOf(s) % 3 === 1) {
      rect(-s.size/2, -s.size/2, s.size, s.size, 10);
    } else {
      triangle(0, -s.size/2, -s.size/2, s.size/2, s.size/2, s.size/2);
    }

    pop();

    s.angle += s.rotSpeed;
    s.x += sin(frameCount * 0.02 + shapes.indexOf(s)) * 2;
    s.y += cos(frameCount * 0.02 + shapes.indexOf(s)) * 2;
  }
}`,

  art: `// Colorful spiral art
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  background(20, 20, 40);
}

function draw() {
  translate(width/2, height/2);

  for (let i = 0; i < 360; i += 10) {
    let r = i * 0.5 + frameCount * 0.5;
    let x = cos(i + frameCount) * r;
    let y = sin(i + frameCount) * r;

    fill(
      128 + sin(i * 0.1 + frameCount * 0.02) * 127,
      128 + cos(i * 0.1 + frameCount * 0.03) * 127,
      200
    );
    noStroke();
    ellipse(x, y, 15, 15);
  }

  // Fade effect
  fill(20, 20, 40, 10);
  rect(-width/2, -height/2, width, height);
}`,
};
