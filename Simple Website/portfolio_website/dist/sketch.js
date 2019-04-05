// Code is heavily inspired by The Coding Train tutorial on YT, hosted by Emilyxxie
// video tutorial link: https://www.youtube.com/watch?v=S1TQCi9axzg&t=1s

var streams = [];
var fadeInterval = 3;
var symbolSize = 14;
var canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');                    // make sure it is behind other elements
  background(0);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream();                      // set starting positions
    stream.generateNumbers(x, random(-300, 900));   // add to stream array
    streams.push(stream);                           // move right by the size of the font for the nex x position
    x += symbolSize
  }

  textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  background(0, 150);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function windowResized(){
    // canvas will resize if expanded after loading, but will not generate more streams
    resizeCanvas(windowWidth, windowHeight);
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;
  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.setToRandom = function() {
    var charType = round(random(0, 1));
    this.value = charType;
  }

  this.rain = function() {
    this.y = (this.y >= width) ? 0 : this.y += this.speed;
  }

}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(windowHeight/symbolSize);
  this.speed = random(2, 7);

  this.generateNumbers = function(x, y) {
    var opacity = 200;
    var first = round(random(0, 4)) == 1;
    for (var i = 0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(x, y, this.speed, first, opacity);
      symbol.setToRandom();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      if (symbol.first) {
        fill(140, 255, 170, symbol.opacity);
      } 
      else {
        fill(0, 255, 70, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      var change = round(random(0, 30));
      if(change == 6){
        symbol.setToRandom();
      }
    });
  }
}