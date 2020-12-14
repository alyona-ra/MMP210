
int xPin = A1;
int yPin = A0;
int buttonPin = 2;
int xPosition = 0;
int yPosition = 0;
int buttonState = 0;

void setup() {

Serial.begin(9600);

pinMode(xPin, INPUT);
pinMode(yPin, INPUT);
pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {

xPosition = analogRead(xPin);
yPosition = analogRead(yPin);
buttonState = digitalRead(buttonPin);

delay(100);
}
