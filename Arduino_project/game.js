let serialPort;
let road1;
let road2;
let road3;
let startScreen;
let endScreen;
let bgSound;
let crashSound;
let gameoverSound;

let inputX = false;
let inputY = false;
let inputButton = false;
let gameOver = false;
let gameNotPlayed = true;

let score = 0;
let frames = 0;
let carsLimit = 3;
let border = 40;
let oncomingMaxSpeed = 10;
let oncomingMinSpeed = 6;
let passingMaxSpeed = 5;
let passingMinSpeed = 3;

let lanes = [75, 185, 315, 425];
let currentCars = [];

let mainCar = {
    x: 285,
    y: 666,
    width: 62,
    height: 134
}

let cars = {

    car2: {
        x: 0,
        y: 0,
        width: 60,
        height: 130,
        speed: 5
    },

    car3: {
        x: 0,
        y: 0,
        width: 71,
        height: 130,
        speed: 5
    },

    car4: {
        x: 0,
        y: 0,
        width: 71,
        height: 135,
        speed: 5
    },

    car5: {
        x: 0,
        y: 0,
        width: 67,
        height: 130,
        speed: 5
    },

    car6: {
        x: 0,
        y: 0,
        width: 69,
        height: 131,
        speed: 5
    },

    car7: {
        x: 0,
        y: 0,
        width: 76,
        height: 169,
        speed: 5
    },

    car8: {
        x: 0,
        y: 0,
        width: 83,
        height: 233,
        speed: 5
    },

    car9: {
        x: 0,
        y: 0,
        width: 98,
        height: 184,
        speed: 5
    }
};

//  car class
class Car {
    //  gets referencce from 'cars' object
    constructor(carRef) {
        this.x = carRef.x;
        this.y = carRef.y;
        this.width = carRef.width;
        this.height = carRef.height;
        this.speed = carRef.speed;
        this.image = carRef.image;
        this.lane = null;
    }

    //  sets horizontal position for a car
    setX(x) {
        this.x = x;
    }

    //  sets vertical position
    setY(y) {
        this.y = y;
    }

    //  sets speed (duh)
    setSpeed(speed) {
        this.speed = speed;
    }

    //  sets lane (from 0 to 3)
    setLane(lane) {
        this.lane = lane;
    }

    //  changes vertical position so that car "moves" down the road
    move() {
        this.y += this.speed;
    }
}

function preload() {
    road1 = loadImage('assets/final/IMG_0796.jpg');
    road2 = loadImage('assets/final/IMG_0797.jpg');
    road3 = loadImage('assets/final/IMG_0798.jpg');
    startScreen = loadImage('assets/final/start.jpg');
    endScreen = loadImage('assets/final/game_over.jpg');
    mainCar.image = loadImage('assets/final/1.png');
    cars.car2.image = loadImage('assets/final/2.png');
    cars.car3.image = loadImage('assets/final/3.png');
    cars.car4.image = loadImage('assets/final/4.png');
    cars.car5.image = loadImage('assets/final/5.png');
    cars.car6.image = loadImage('assets/final/6.png');
    cars.car7.image = loadImage('assets/final/7.png');
    cars.car8.image = loadImage('assets/final/8.png');
    cars.car9.image = loadImage('assets/final/9.png');

    bgSound = loadSound('assets/mp3/bg.mp3');
    crashSound = loadSound('assets/mp3/crash.mp3');
    gameoverSound = loadSound('assets/mp3/gameover.mp3');
}


function setup() {
    createCanvas(500, 800);

    serial = new p5.SerialPort();
    serial.list();
    serial.open('COM5');
    serial.on('data', gotData);

    textSize(40);
    fill('#000000');

    //  makes sound quieter
    bgSound.amp(0.3);
    crashSound.amp(0.3);
    gameoverSound.amp(0.3);
}


function draw() {

    //  if the game is in a gameOver state and user presses the joystick, everything resets to initial values and gameOver state ends
    if (gameOver && inputButton === 0) {
        score = 0;
        frames = 0;
        currentCars = [];
        mainCar.x = 285;
        mainCar.y = 666;
        gameoverSound.stop();
        bgSound.loop();
        gameOver = false;
    }

    //  if the game hasn't been played a single time, we show a start image and get out from the draw loop 
    if (gameNotPlayed) {
        image(startScreen, 0, 0);

        //  if user presses the joystick, game begins
        if (inputButton === 0) {
            gameNotPlayed = false;
            bgSound.loop();
        }

        return;
    }

    //  get out from the draw loop if the game is over
    if (gameOver) {
        return;
    }

    //  animation of road surface
    let animation = [road1, road2, road3];
    image(animation[Math.floor(frames) % animation.length], 0, 0);
    frames += 0.5;
    if (frames > 1000000) frames = 0;

    //  if array of cars on road is not full -- add another car
    if (currentCars.length < carsLimit) {
        let laneBusy = false;

        //  make an object for a new car
        let t = new Car(getRandomProp(cars));
    
        //  choose a random lane to place car on
        let tempLane = Math.floor(Math.random() * 4);

        //  if there is a car above canvas on the same lane, it means the lane is taken
        for (let j = 0; j < currentCars.length; j++) {
            if (currentCars[j].lane === tempLane && currentCars[j].y < 0) {
                laneBusy = true;
            }
        }

        //  sets position and lane for a car
        t.setX(lanes[tempLane] - t.width / 2);
        t.setLane(tempLane);
        t.setY(0 - t.height - 1);

        //  get all cars from the same lane
        let carsInLane = [];
        for (let j = 0; j < currentCars.length; j++) {
            if (currentCars[j].lane === tempLane) {
                carsInLane.push(currentCars[j]);
            }
        }

        //  get distances traveled for every car in the lane
        let tempDist = [];
        for (let j = 0; j < carsInLane.length; j++) {
            tempDist.push(carsInLane[j].y);
        }

        if (tempDist.length > 0) {
            //  find the upper car
            let obstacle = carsInLane[tempDist.indexOf(Math.min(...tempDist))];
            let speed = obstacle.speed;

            //  if that car haven't reached the bottom of canvas...
            if (obstacle.y < 700) {
                //  for oncoming traffic
                if (tempLane < 2) {
                    //  calculate the time it takes the car to reach the bottom
                    let timeToReachEnd = (height - obstacle.y + obstacle.height) / speed;

                    //  based on that time calculate the speed for the car we spawn, so it won't catch up to the car on the lane..
                    //  ..and won't be drawn on top of that car
                    let speedGoal = height / timeToReachEnd;

                    //  if that speed is more than max allowed -- set max allowed speed
                    if (speedGoal > oncomingMaxSpeed) t.setSpeed(oncomingMaxSpeed);

                    //  if that speed is less than min allowed, it means that obstacle is too close to the top of canvas, so we state that line is currently taken
                    else if (speedGoal < oncomingMinSpeed) laneBusy = true;
                    else t.setSpeed((height + 100) / timeToReachEnd);
                    
                    //  for passing traffic
                } else {
                    let timeToReachEnd = (height - obstacle.y + obstacle.height) / speed;
                    let speedGoal = height / timeToReachEnd;
                    if (speedGoal > passingMaxSpeed) t.setSpeed(passingMaxSpeed);
                    else if (speedGoal < passingMinSpeed) laneBusy = true;
                    else t.setSpeed((height + 100) / timeToReachEnd);
                }
            }

            //  if the lane is free -- just set a random speed
        } else {
            if (tempLane < 2) t.setSpeed(Math.random() * (oncomingMaxSpeed - oncomingMinSpeed) + oncomingMinSpeed);
            else t.setSpeed(Math.random() * (passingMaxSpeed - passingMinSpeed) + passingMinSpeed);
        }

        //  if the lane is busy, don't swapn a car, otherwise -- push a new car to the array of cars on road
        if (!laneBusy) currentCars.push(t);
    }

    //  draw player car
    image(mainCar.image, mainCar.x, mainCar.y);

    //  draw the rest of the cars
    for (let i = 0; i < currentCars.length; i++) {

        //  flip cars 180deg for oncoming traffic
        if (currentCars[i].lane < 2) {
            push();
            translate(currentCars[i].x + currentCars[i].width, currentCars[i].y + currentCars[i].height / 2);
            rotate(PI);
            image(currentCars[i].image, 0, 0);
            pop();
        } else image(currentCars[i].image, currentCars[i].x, currentCars[i].y);
    }

    //  draw score
    textSize(20);
    fill('#FFFFFF');
    text(`Score: ${score}`, 380, 50);
    textSize(40);
    fill('#000000');

    //  detect a collision between player car and other cars
    //  if detected, show gameOver screen, put the game in gameOver state and show score
    for (let i = 0; i < currentCars.length; i++) {
        if (currentCars[i].lane < 2) {
            if (mainCar.x < currentCars[i].x + currentCars[i].width &&
                mainCar.x + mainCar.width > currentCars[i].x &&
                mainCar.y < currentCars[i].y + currentCars[i].height / 2 && mainCar.y + mainCar.height * 1.5 > currentCars[i].y) {
                image(endScreen, 0, 0);
                text(score, width / 2, 300);
                gameOver = true;
                bgSound.stop();
                crashSound.play();
                setTimeout(() => {
                    if (gameOver === true) {
                        gameoverSound.loop();
                    }
                }, 1436);
            }
        } else if (mainCar.x < currentCars[i].x + currentCars[i].width &&
            mainCar.x + mainCar.width > currentCars[i].x &&
            mainCar.y < currentCars[i].y + currentCars[i].height && mainCar.y + mainCar.height > currentCars[i].y) {
            image(endScreen, 0, 0);
            text(score, width / 2, 300);
            gameOver = true;
            bgSound.stop();
            crashSound.play();
            setTimeout(() => {
                if (gameOver === true) {
                    gameoverSound.loop();
                }
            }, 1436);
        }

    }

    //  players car moves in the same direction as joystick
    if (inputX > 700 && mainCar.x <= width - mainCar.width - border) mainCar.x += 8;
    if (inputX < 300 && mainCar.x >= border) mainCar.x -= 8;
    if (inputY > 700 && mainCar.y >= height / 7) mainCar.y -= 15;
    if (inputY < 300 && mainCar.y <= height - mainCar.height) mainCar.y += 5;

    //  moves cars
    for (let i = 0; i < currentCars.length; i++) {
        currentCars[i].move();

        //  if car has reached the bottom of canvas, we replace in with a new one
        if (currentCars[i].y > height + 100) {
            let laneBusy = false;
            let t = new Car(getRandomProp(cars));
            let tempLane = Math.floor(Math.random() * 4);

            //  increase score when car passed the canvas
            score += 1;

            for (let j = 0; j < currentCars.length; j++) {
                if (currentCars[j].lane === tempLane && currentCars[j].y < 0) {
                    laneBusy = true;
                }
            }

            t.setX(lanes[tempLane] - t.width / 2);
            t.setLane(tempLane);
            t.setY(0 - t.height - 1);

            let carsInLane = [];
            for (let j = 0; j < currentCars.length; j++) {
                if (currentCars[j].lane === tempLane) {
                    carsInLane.push(currentCars[j]);
                }
            }

            let tempDist = [];
            for (let j = 0; j < carsInLane.length; j++) {
                tempDist.push(carsInLane[j].y);
            }

            if (tempDist.length > 0) {
                let obstacle = carsInLane[tempDist.indexOf(Math.min(...tempDist))];
                let speed = obstacle.speed;

                if (obstacle.y < 700) {
                    if (tempLane < 2) {
                        let timeToReachEnd = (height - obstacle.y + obstacle.height) / speed;
                        let speedGoal = height / timeToReachEnd;
                        if (speedGoal > oncomingMaxSpeed) t.setSpeed(oncomingMaxSpeed);
                        else if (speedGoal < oncomingMinSpeed) laneBusy = true;
                        else t.setSpeed((height + 100) / timeToReachEnd);
                    } else {
                        let timeToReachEnd = (height - obstacle.y + obstacle.height) / speed;
                        let speedGoal = height / timeToReachEnd;
                        if (speedGoal > passingMaxSpeed) t.setSpeed(passingMaxSpeed);
                        else if (speedGoal < passingMinSpeed) laneBusy = true;
                        else t.setSpeed((height + 100) / timeToReachEnd);
                    }
                }

            } else {
                if (tempLane < 2) t.setSpeed(Math.random() * (oncomingMaxSpeed - oncomingMinSpeed) + oncomingMinSpeed);
                else t.setSpeed(Math.random() * (passingMaxSpeed - passingMinSpeed) + passingMinSpeed);
            }

            if (!laneBusy) currentCars[i] = t;
        }
    }
}

//  gets a random car from 'cars' object
function getRandomProp(obj) {
    let keys = Object.keys(obj);
    return obj[keys[Math.floor(keys.length * Math.random())]];
}

//  funtion executed when data is recieved from arduino
function gotData() {
    let data = trim(serial.readLine());
    if (!data) return;

    //  use regexp to get 3 numeric values: x, y, and button state
    data = data.match(/[0-9]{1,}/g);
    inputX = +data[0];
    inputY = +data[1];
    inputButton = +data[2];
}