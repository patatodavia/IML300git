let words = [
  {text : "LOREM", x :400, y:40},
  {text : "IPSUM", x :200, y:50},
  {text : "DOLOR", x :300, y:300},
  {text : "SOMETHING", x :200, y:200},
];

function setup() {
  createCanvas(1000, 300);
}

function draw() {
  background("#FF7B07");
  textSize(40);

  for (let word of words) {
    let d = dist(mouseX, mouseY, word.x, word.y)
    
    push();
    if (d<150){
      let pullX = (mouseX - word.x)* 0.7;
      let pullY = (mouseY - word.y)* 0.7;
      translate(pullX, pullY);
    }
    text(word.text, word.x, word.y);
    pop();
  }
  
}