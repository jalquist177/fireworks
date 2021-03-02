let bg;
let particles = [];
const gravity = .25;
const colors = ['red', 'orange', 'yellow', 'lime', 'cyan', 'magenta', 'white'];
let fireworktime = 120;
let endColor;
let trigger = false;
let timer = 0;
let finale = false;
let sounds=[];

function setup() {
  pixelDensity(1); 
  sounds[0] = loadSound('assets/f1.wav');
  sounds[1] = loadSound('assets/f2.wav');
  sounds[2] = loadSound('assets/f3.wav');
  sounds[3] = loadSound('assets/f4.wav');
  sounds[4] = loadSound('assets/f5.wav');
  sounds[5] = loadSound('assets/f6.wav');
  sounds[6] = loadSound('assets/f7.wav');
  sounds[7] = loadSound('assets/f8.wav');
  sounds[8] = loadSound('assets/f9.wav');
  //sounds[9] = loadSound('assets/f10.aiff');
  createCanvas(1080, 720);
  endColor = color(64, 0);
  bg = loadImage("burn.jpg");
}


function draw() {
	background(bg);
  if (trigger == false){
    timer++;
  }
if (timer % fireworktime > fireworktime/2){
  trigger = true;
  timer = 0;
}

if (trigger){
    particles.push(new Firework(random(width), height));
    trigger = false;
    if (finale){
      fireworktime = 30;
    } else {
      fireworktime = random(120, 500);
    }
}
  

for (var i = 0; i < particles.length; i++) {
	particles[i].step();
  particles[i].draw();
	}
  particles = particles.filter((p) => p.isAlive);

}	

function keyPressed() {
  if (key === " ") {
    finale = true;
    print ("got spacebar");
  } 
}

// function mousePressed() {
//   particles.push(new Firework(mouseX, height));
// }

class Particle {
  constructor(x, y, xSpeed, ySpeed, pColor, size) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.color = pColor;
    this.size = size;
    this.isAlive = true;
    this.trail = [];
    this.trailIndex = 0;
  }

  step() {
    this.trail[this.trailIndex] = createVector(this.x, this.y);
    this.trailIndex++;
    if (this.trailIndex > 10) {
      this.trailIndex = 0;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    this.ySpeed += gravity;

    if (this.y > height) {
      this.isAlive = false;
    }
  }

  draw() {
    this.drawTrail();
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size);

  }

  drawTrail() {
    let index = 0;

    for (let i = this.trailIndex - 1; i >= 0; i--) {
      const tColor = lerpColor(color(this.color), endColor,
        index / this.trail.length);
      fill(tColor);
      noStroke();
      rect(this.trail[i].x, this.trail[i].y, this.size, this.size);
      index++;
    }

    for (let i = this.trail.length - 1; i >= this.trailIndex; i--) {
      const tColor = lerpColor(color(this.color), endColor,
        index / this.trail.length);
      fill(tColor);
      noStroke();
      rect(this.trail[i].x, this.trail[i].y, this.size, this.size);
      index++;
    }
  }
}

class Firework extends Particle {
  constructor(x, y) {
    super(x, y, random(-2, 2), random(-10, -15),
      random(colors), 10);
    this.countdown = random(30, 60);
    this.exploded = false;
    this.randomsounds = Math.floor(random(9));;
  }

  step() {
    super.step();

    this.countdown--;
    if (this.countdown <= 0) {
      if(this.exploded == false){
        this.exploded = true;
        
          sounds[this.randomsounds].play();
          //print("exploded");
         //sounds[random(sounds.length)].play();
      }
      const explosionSize = random(20, 50);
      for (let i = 0; i < explosionSize; i++) {

       

        const speed = random(5, 10);
        const angle = random(TWO_PI);
        const xSpeed = cos(angle) * speed;
        const ySpeed = sin(angle) * speed;

        particles.push(new Particle(this.x, this.y,
          xSpeed, ySpeed,
          this.color, 5
        ));
      }
      this.isAlive = false;
    }
  }
}

