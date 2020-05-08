"use strict";

const url = 'ws://localhost:8080';
let connection = new WebSocket(url);
let loaded = false;
var stateObj;

connection.onopen = () => {
	connection.send(JSON.stringify({ command: "load", parameters: ["Song1", "temp.lot"] }));
};

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = (e) => {
	stateObj = JSON.parse(e.data);
	if (!loaded) {
		loaded = true;
		connection.send(JSON.stringify({ command: "setActiveGroup", parameters: ["part1"] }));
		
		connection.send(JSON.stringify({ command: "play", parameters: [""] }));
		drawables[0].stopInstruments();
	}
};

let first = true;

let speed = 3;

let canvas;
let context;

let drawables = [];
let player;

let keyLeft = false;
let keyRight = false;
let keyDown = false;
let keyUp = false;

class Drawable {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = 15;
	}

	draw () {
		context.lineWidth = 3;
		context.fillStyle = (this.hasOwnProperty("color") ? this.color : "#000000");
		context.strokeStyle = "#000000";
		let r = this.radius;
		context.beginPath();
		context.arc(this.x, this.y, r, 0, Math.PI * 2, false);
		context.stroke();
		context.fill();
	}
}

class Emitter extends Drawable {
	constructor(x, y, synthId, hitbox) {
		super(x, y);
		this.synthId = synthId;
		this.radius = 25;
		this.hitbox = hitbox;
	}

	draw(groupName) {
		super.draw();

		context.globalAlpha = 0.1;
		let res = this.hitbox.draw();
		context.globalAlpha = 1.0;

		if (res[0]) {			//enter
			connection.send(JSON.stringify({ command: "setInstrumentPlay", parameters: [groupName, ""+this.synthId] }));
		} else if (res[1]) {	//leave
			connection.send(JSON.stringify({ command: "removeInstrument", parameters: [""+this.synthId] }));
		}
	}

	stopInstruments() {
		connection.send(JSON.stringify({ command: "removeInstrument", parameters: [""+this.synthId] }));
	}
}

class Rectangle extends Drawable {
	constructor(x, y, bx, by) {
		super(x, y);
		this.bx = bx;
		this.by = by;
		this.playerInside = false;
	}

	draw () {
		this.oldPlayerInside = this.playerInside;

		this.playerInside = this.pointInside(player.x, player.y);

		context.fillStyle = (this.hasOwnProperty("color") ? this.color : "#000000");
		context.fillRect(this.x, this.y, this.bx, this.by);

		return [this.playerInside && this.oldPlayerInside !== this.playerInside, 
		(!this.playerInside) && this.oldPlayerInside !== this.playerInside];
	}

	pointInside(x, y) {
		return (x >= this.x && x <= this.x + this.bx && y >= this.y && y <= this.y + this.by);
	}
}

class GroupZone extends Rectangle {
	constructor(x, y, bx, by, groupName, emitters, transition) {
		super(x, y, bx, by);
		this.groupName = groupName;
		this.transition = transition;

		this.emitters = emitters;

		this.emitters.forEach(emitter => emitter.color = this.color);
	}

	stopInstruments() {
		this.emitters.forEach(emitter => emitter.stopInstruments());
	}

	draw() {
		let ret = super.draw();

		if (ret[0] === true) {
			connection.send(JSON.stringify({ command: "setActiveGroup", parameters: [this.groupName] }));
			this.stopInstruments();
		}

		this.emitters.forEach(emitter => emitter.draw(this.groupName));
	}
}


$(document).ready(function () { init(); });

function moveLeft() {
	if (player != undefined) {
		if (player.x > 0) {
			player.x = player.x - speed;
		}
	}
}

function moveUp() {
	if (player != undefined) {
		if (player.y > 0) {
			player.y = player.y - speed;
		}
	}
}

function moveRight() {
	if (player != undefined) {
		if (player.x < canvas.width) {
			player.x = player.x + speed;
		}
	}
}

function moveDown() {
	if (player != undefined) {
		if (player.y < canvas.height) {
			player.y = player.y + speed;
		}
	}
}

$(document).keydown(function(e) {
	switch(e.which) {
		case 37: 	//left
			keyLeft = true;
			break;

		case 38: 	//up
			keyUp = true;
			break;

		case 39: 	//right
			keyRight = true;
			break;

		case 40: 	//down
			keyDown = true;
			break;
	}
});

$(document).keyup(function(e) {
	switch(e.which) {
		case 37: 	//left
			keyLeft = false;
			break;

		case 38: 	//up
			keyUp = false;
			break;

		case 39: 	//right
			keyRight = false;
			break;

		case 40: 	//down
			keyDown = false;
			break;

		case 13:
			connection.send(JSON.stringify({ command: "stop", parameters: [""] }));
			break;
	}
});

function init() {
	canvas = $('#canvas1')[0];
	context = canvas.getContext('2d');

	player = new Drawable(canvas.width / 2 - 45, canvas.height / 2 - 45);
	player.radius = 4;

	drawables[0] = new GroupZone(0, 0, canvas.width / 2, canvas.height / 2,
		"part1",
		[new Emitter(35, 35, 0, new Rectangle(5, 5, 200, 320)),
		new Emitter(445, 165, 1, new Rectangle(80, 95, 415, 180)),
		new Emitter(320, 60, 2, new Rectangle(120, 35, 250, 135))],
		true
	);
	drawables[0].color = "#eb81b0";
	drawables[0].playerInside = true;



	// drawables[1] = new GroupZone(canvas.width / 2, 0, canvas.width, canvas.height / 2,
	// 	"part1",
	// 	[new Emitter(canvas.width / 2 + 100, 15, 0, "#000000"),
	// 	new Emitter(canvas.width / 2 + 15, 100, 1, "#000000")],
	// 	true
	// );
	// drawables[1].color = "#83eb81";
	// // drawables[2] = new Rectangle(0, canvas.height / 2, 0, canvas.height);
	// // drawables[2].color = "#eb81e0";
	// drawables[2] = new GroupZone(0, canvas.height / 2, canvas.width, canvas.height,
	// 	"part1",
	// 	[new Emitter(100, canvas.height / 2 + 15, 0, "#000000"),
	// 	new Emitter(15, canvas.height / 2 + 100, 1, "#000000")],
	// 	true
	// );
	// drawables[2].color = "#9381eb";

	setInterval(draw, 15);
}

function draw() {
	if (keyLeft) {moveLeft();}
	if (keyRight) {moveRight();}
	if (keyDown) {moveDown();}
	if (keyUp) {moveUp();}

	context.clearRect(0, 0, canvas.width, canvas.height);

	if (loaded && drawables != undefined && context != undefined) {
		drawables.forEach(drawable => {
			if (typeof drawable.draw === "function") {drawable.draw();}
		});
	}

	player.draw();
}
