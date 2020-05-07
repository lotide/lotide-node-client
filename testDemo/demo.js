"use strict";

const url = 'ws://localhost:8080';
const connection = new WebSocket(url);

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
	constructor(x, y, synthName, color) {
		super(x, y);
		this.synthName = synthName;
		this.color = color;
		this.radius = 25;
	}
}

class Rectangle extends Drawable {
	constructor(x, y, bx, by) {
		super(x, y);
		this.bx = bx;
		this.by = by;
	}

	draw () {
		context.fillStyle = (this.hasOwnProperty("color") ? this.color : "#000000");
		context.fillRect(this.x, this.y, this.bx, this.by);
	}

	pointInside(x, y) {
		return (x >= x && x <= bx && y >= y && y <= by);
	}
}

class SynthZone extends Rectangle {
	constructor(x, y, bx, by, groupName) {
		super(x, y, bx, by);
		this.groupName = groupName;
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
	}
});

function init() {
	canvas = $('#canvas1')[0];
	context = canvas.getContext('2d');

	player = new Drawable(canvas.width / 2, canvas.height / 2);
	player.radius = 4;

	drawables[0] = new Rectangle(0, 0, canvas.width / 2, canvas.height / 2);
	drawables[0].color = "#eb9381";
	drawables[1] = new Rectangle(canvas.width / 2, 0, canvas.width, canvas.height / 2);
	drawables[1].color = "#83eb81";
	drawables[2] = new Rectangle(0, canvas.height / 2, 0, canvas.height);
	drawables[0].color = "#eb81e0";
	drawables[3] = new Rectangle(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
	drawables[3].color = "#9381eb";	

	setInterval(draw, 15);
}

function draw() {
	if (keyLeft) {moveLeft();}
	if (keyRight) {moveRight();}
	if (keyDown) {moveDown();}
	if (keyUp) {moveUp();}

	context.clearRect(0, 0, canvas.width, canvas.height);

	if (drawables != undefined && context != undefined) {
		drawables.forEach(drawable => {
			if (typeof drawable.draw === "function") {drawable.draw();}
		});
	}

	player.draw();
}
