let watchFace, hourHand, minuteHand, secondHand, georgia, scale;

function preload() {
  georgia = loadFont("fonts/georgia.ttf");

  watchFace = loadImage("images/perpetual.png");
  hourHand = loadImage("images/minute-silver.png");
  minuteHand = loadImage("images/minute-silver.png");
  secondHand = loadImage("images/second-silver.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(RADIANS); //stay rad
  imageMode(CENTER);

  scale = min(windowWidth / watchFace.width, windowHeight / watchFace.height);

  // time always starts at time tx was mined, seemed cool
  startTime = new Date(hl.tx.timestamp * 1000);

  frameRate(1);
  pixelDensity(2);

  hl.token.setName(`Farcaster Perpetual #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `The Farcaster Perpetual is expanded with the arrival of new frame mechanics. Offering enhanced legibility, this timepiece carries all the qualities that have made Farcaster – one of the brand’s first Professional watches – a reference throughout the decades.`
  );
}

function draw() {
  clear();
  drawClock(new Date(startTime.getTime() + frameCount * 1000));
  hl.token.capturePreview();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawHand(image, angle, lengthScale, widthScale) {
  push();

  let offsetX = watchFace.width * 0.009 * scale;
  let offsetY = watchFace.height * 0.041 * scale;

  translate(width / 2 + offsetX, height / 2 + offsetY);
  rotate(angle);
  imageMode(CENTER);

  let newWidth = image.width * widthScale * scale;
  let newHeight = image.height * lengthScale * scale;

  image(image, 0, 0, newWidth, newHeight);
  pop();
}

function drawClock(now) {
  image(
    watchFace,
    width / 2,
    height / 2,
    watchFace.width * scale,
    watchFace.height * scale
  );

  let secondsAngle = (now.getSeconds() / 60) * TWO_PI;
  let minutesAngle = (now.getMinutes() / 60) * TWO_PI + secondsAngle / 60;
  let hoursAngle = ((now.getHours() % 12) / 12) * TWO_PI + minutesAngle / 12;

  drawText(`${hl.tx.tokenId}`);

  drawHand(hourHand, hoursAngle, 0.17, 0.25);
  drawHand(minuteHand, minutesAngle, 0.25, 0.25);
  drawHand(secondHand, secondsAngle, 0.28, 0.28);
}

function drawText(content) {
  push();

  // need to calc offsets based on the original watch face
  // dimensions to scale on window resize
  let offsetX = watchFace.width * 0.009 * scale;
  let offsetY = watchFace.height * 0.081 * scale;

  translate(width / 2 + offsetX, height / 2 + offsetY + 20 * scale);

  textFont(georgia);

  textAlign(CENTER, CENTER);
  textSize(10 * scale);
  fill(255, 255, 255, 200);
  noStroke();

  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = 5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "rgba(0, 0, 0, 0.5)";

  text(content, 0, 0);

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = "rgba(0, 0, 0, 0)";

  pop();
}
