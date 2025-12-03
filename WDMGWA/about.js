 let img;

    function setup() {
      createCanvas(800, 600);
      background(255);
      strokeWeight(3);
      stroke(0);
      
      // Load image from file input
      document.getElementById('file-input').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            loadImage(event.target.result, function(loadedImg) {
              img = loadedImg;
              background(255);
              image(img, 0, 0, 800, 600);
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }

    function draw() {
      if (mouseIsPressed) {
        line(mouseX, mouseY, pmouseX, pmouseY);
      }
    }