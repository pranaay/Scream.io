var mic;
var xPos;
var yPos;
var flag;
var sprite1;
var sprite2;
var sprite3;
var esprite1;
var esprite2;
var esprite3;
var things = [];
var users = {};

const socket = io();
socket.on("users", function(info){
	//Get all other users' mouse positions
	users = info;
});

function preload() {
	sprite1 = loadImage('./assets/images/1.png');
	sprite2 = loadImage('./assets/images/2.png');
	sprite3 = loadImage('./assets/images/3.png');

	esprite1 = loadImage('./assets/images/1e.png');
	esprite2 = loadImage('./assets/images/2e.png');
	esprite3 = loadImage('./assets/images/3e.png');
}

function setup() {
  	createCanvas(windowWidth*75/100, windowHeight);
	background(35, 57 , 91);

	xPos = 0;
  	yPos = height/2 - 25;
  
  	flag = 1;

  	// Create an Audio input
  	mic = new p5.AudioIn();

  	// start the Audio Input.
  	// By default, it does not .connect() (to the computer speakers)
  	mic.start();
}

function draw() {

    //Clear the canvas
    background(35, 57 , 91);
    //Remove outline of things
    noStroke();
    console.log(things.length);
    

    background(100);

  	// Get the overall volume (between 0 and 1.0)
  	var vol = mic.getLevel();
  	fill(127);
  	stroke(0);

  	// Draw an ellipse with height based on volume
  	// var h = map(vol, 0, 1, height, 0);
  
	  if(vol>0.1) {
	    xPos+=vol*2;
	  }
	  
	  if(xPos>width-50) {
	    xPos = 0;
	  }

	  if(flag==1) {
	    image(sprite1, xPos, yPos, 50, 50);
	  }
	  if(flag==2) {
	    image(sprite2, xPos, yPos, 50, 50);
	  }
	  if(flag==3) {
	    image(sprite3, xPos, yPos, 50, 50);
	  }

	  if(flag==1 && vol>0.1) {
	    flag = 2;
	  }
	  else if(flag==2 && vol>0.1) {
	    flag = 3;
	  }
	  else if(flag==3 && vol>0.1) {
	    flag = 1;
	  }


    //Loop through all of the objects, and show them
    for(i = things.length - 1; i > -1; i--){
    	var t = things[i];
    	t.show();
    	if(t.gone){
	    	//Remove from the list if out of view as to not lag the browser
	    	things.splice(i,1);
    	}
	};

	//Add new item to the list where the mouse is...
	//things.push(new Thing(xPos,yPos,flag));

	//Now...add all of the other user's mouse positions to the array (FUN!)
	for(var user in users){
		var u = users[user];
		//things.push(new Thing(u.x,u.y,u.flag));
		if(u.flag==1 && u.x!=xPos) {
	    	image(esprite1, u.x, u.y, 50, 50);
	  	}
	  	if(u.flag==2 && u.x!=xPos) {
	    	image(esprite2, u.x, u.y, 50, 50);
	  	}
	  	if(u.flag==3 && u.x!=xPos) {
	    	image(esprite3, u.x, u.y, 50, 50);
	  	}
	};

	//We need to send the server our information so the other players can see it
	socket.emit("info",{"x":xPos,"y":yPos,"flag":flag});

}
