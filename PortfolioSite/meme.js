let backgroundImg;
let img1;
let img2;
let img3;
let img4;
let img5;
let img6;

function preload() {
    backgroundImg = loadImage('assets/meme/bg.png');
    img1 = loadImage('assets/meme/1.png');
    img2 = loadImage('assets/meme/2.png');
    img3 = loadImage('assets/meme/3.png');
    img4 = loadImage('assets/meme/4.png');
    img5 = loadImage('assets/meme/5.png');
    img6 = loadImage('assets/meme/6.png');
}

function setup() {
    createCanvas(800, 440);
}

let frames = 0;
let frames2 = 0;

function draw() {
    background(backgroundImg);

//fire
    let animation = [img1, img2, img3, img2];
    image(animation[Math.floor(frames) % animation.length], -2, 0);

//smoke
    let x1 = constrain(map(mouseX, 0, width, -100, 0), -100, 0);
    let animation2 = [img4, img5, img6];
    image(animation2[Math.floor(frames2) % animation2.length], x1, 0, 1000, 440);

    frames += 0.15;
    if (frames > 1000000) frames = 0;

    frames2 += 0.13
    if (frames2 > 1000000) frames2 = 0;

}