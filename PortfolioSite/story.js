let pageNum = 1;
let numPages = 6;

let t;

let img1;
let img2;
let img2_1;
let img3_0;
let img3_1;
let img3_2;
let img3_3;
let img3_4;
let img3_5;
let img3_6;
let img4_0;
let img4_1;
let img4_2;
let img4_3;
let img4_4;
let img4_5;
let img4_6;
let img4_7;
let img4_8;
let img5;
let img6;

let popsound;
let blackhole;
let applause;

let popsoundStarted = false;
let blackholeStarted = false;
let applauseStarted = false;

let frames = 0;

let slider;

let flowers = [];
let flowersNum = 10;

function preload() {
  img1 = loadImage('assets/story/1.jpg');
  img2 = loadImage('assets/story/2.jpg');
  img2_1 = loadImage('assets/story/2_1.png');
  img3_0 = loadImage('assets/story/3_0.jpg');
  img3_1 = loadImage('assets/story/3_1.png');
  img3_2 = loadImage('assets/story/3_2.png');
  img3_3 = loadImage('assets/story/3_3.png');
  img3_4 = loadImage('assets/story/3_4.png');
  img3_5 = loadImage('assets/story/3_5.png');
  img3_6 = loadImage('assets/story/3_6.png');
  img4_0 = loadImage('assets/story/4_0.jpg');
  img4_1 = loadImage('assets/story/4_1.jpg');
  img4_2 = loadImage('assets/story/4_2.jpg');
  img4_3 = loadImage('assets/story/4_3.jpg');
  img4_4 = loadImage('assets/story/4_4.jpg');
  img4_5 = loadImage('assets/story/4_5.jpg');
  img4_6 = loadImage('assets/story/4_6.jpg');
  img4_7 = loadImage('assets/story/4_7.jpg');
  img4_8 = loadImage('assets/story/4_8.jpg');
  img5 = loadImage('assets/story/5.jpg');
  img6 = loadImage('assets/story/6.png');

  popsound = loadSound('assets/story/mp3/pop.mp3');
  blackhole = loadSound('assets/story/mp3/blackhole.mp3');
  applause = loadSound('assets/story/mp3/applause.mp3');
}

function setup() {
  createCanvas(600, 600);

  slider = createSlider(0, 450, 0, 6);
  slider.position(
    75 + document.querySelector('#defaultCanvas0').offsetLeft,
    2 + document.querySelector('#defaultCanvas0').offsetTop
  );
  slider.style('width', '450px');

  for (let i = 0; i < flowersNum; i++) {
    flowers.push({
      x: width / 2 - 150,
      y: height,
      speedX: Math.random() * 6 - 2.5,
      speedY: 3 + Math.random() * 5,
    });
  }

  console.log(
    '%c%s',
    'color: red; font-size: 30px; font-weight: bold;',
    'Hello!'
  );
  console.log('If you see an error below it\'s not me');
}

function draw() {
  if (pageNum == 1) {
    slider.hide();
    slider.value(0);
    image(img1, 0, 0);
  } else if (pageNum == 2) {
    image(img2, 0, 0);

    for (let i = 0; i < flowers.length; i++) {
      image(img2_1, flowers[i].x, flowers[i].y);

      if (flowers[i].y < 0 - 150) {
        flowers[i].y = height;
        flowers[i].x = width / 2 - 150;
      } else {
        flowers[i].y -= flowers[i].speedY;
        flowers[i].x += flowers[i].speedX;
      }
    }

    if (!applauseStarted) {
      applause.play();
      applause.amp(0.5);
      applauseStarted = true;

      setTimeout(() => {
        if (pageNum === 2) pageNum++;
      }, ~~applause.buffer.duration * 1000);
    }
  } else if (pageNum == 3) {
    if (applauseStarted) {
      applause.stop();
    }
    background(img3_0);

    if (!blackholeStarted) {
      blackhole.play();
      blackhole.amp(0.5);
      blackholeStarted = true;
    }

    slider.show();

    if (slider.value() >= 75) {
      image(img3_1, 0, 0);
    }

    if (slider.value() >= 150) {
      image(img3_2, 0, 0);
    }

    if (slider.value() >= 225) {
      image(img3_3, 0, 0);
    }

    if (slider.value() >= 300) {
      image(img3_4, 0, 0);
    }

    if (slider.value() >= 375) {
      image(img3_5, 0, 0);
    }

    if (slider.value() == 450) {
      image(img3_6, 0, 0);
    }
  } else if (pageNum == 4) {
    slider.hide();

    let animation = [
      img4_0,
      img4_1,
      img4_2,
      img4_3,
      img4_4,
      img4_5,
      img4_6,
      img4_7,
      img4_8,
    ];
    image(animation[Math.floor(frames) % animation.length], 0, 0);
    frames += 0.2;
    if (frames > 1000000) frames = 0;

    if (blackholeStarted) {
      blackhole.stop();
    }
  } else if (pageNum == 5) {
    if (!popsoundStarted) {
      popsound.play();
      popsoundStarted = true;
    }
    image(img5, 0, 0);
  } else if (pageNum == 6) {
    background(37);
    image(img6, 0, 0);
  }
}

function mousePressed() {
  t = slider.value();
}

function mouseClicked() {
  let tt = slider.value();
  if (tt === t) {
    if (pageNum < numPages) {
      pageNum++;
    } else {
      pageNum = 1;
      applauseStarted = false;
      blackholeStarted = false;
      popsoundStarted = false;
    }
  }
}

window.addEventListener('resize', () => {
  slider.position(
    75 + document.querySelector('#defaultCanvas0').offsetLeft,
    2 + document.querySelector('#defaultCanvas0').offsetTop
  );
});