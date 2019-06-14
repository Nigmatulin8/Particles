const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const options = {
	particleColor: '#fcfcfc',
	canvasColor: '#222',

	particleAmount: 20,

	defaultSpeed: 1,
	addedSpeed: 2,

	defaultRadius: 2,
	addedRadius: 2,

	communication: 150
}

let particles = [];

class Particle {
	constructor(posX, posY) {
		this.x = Math.floor(posX) || Math.floor(Math.random() * width);
		this.y = Math.floor(posY) || Math.floor(Math.random() * height);

		this.directionAngle = Math.floor(Math.random() * 360);
		this.speed = options.defaultSpeed + Math.random() * options.addedSpeed;
		this.radius = options.defaultRadius + Math.random() * options.addedRadius;

		this.color = options.particleColor;

		this.direction = {
			x: Math.cos(this.directionAngle) * this.speed,
			y: Math.sin(this.directionAngle) * this.speed
		}
	}

	updateCoords() {
		//Line from 42 to 46 - checking borders and changing direction;
		if(this.x >= width || this.x <= 0)
			this.direction.x *= -1;

		if(this.y >= height || this.y <= 0)
			this.direction.y *= -1;

		//Line from 50 to 54 - coord X and coord Y element position adjustment
		//(the element does not fly off the screen);
		this.x > width ? this.x = width : this.x;
		this.x < 0 ? this.x = 0 : this.x;

		this.y > height ? this.y = height : this.y;
		this.y < 0 ? this.y = 0 : this.y;

		//Coordinate update;
		this.x += this.direction.x;
		this.y += this.direction.y;
	}

	render() {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}
}

function setup() {
	//Filling the array particles[] instances of Particle;
	for(let i = 0; i < options.particleAmount; i++) {
		particles.push(new Particle());
	}

	loop();
}

function loop() {
	//Feld cleaning;
	context.fillStyle = options.canvasColor;
	context.fillRect(0, 0, width, height);

	//Updating the coordinates and drawing particle;
	particles.forEach(particle => {
		particle.updateCoords();
		particle.render();
	});

	//Particle bonding;
	particles.forEach(particle => communicatePoints(particle, particles));

	//Start main loop;
	requestAnimationFrame(loop);
}

function communicatePoints(particle, parent) {
	for(let i = 0; i < parent.length; i++) {
		let distance = distanceCheck(particle.x, particle.y, parent[i].x, parent[i].y);
		let opacity = 1 - distance / options.communication;

		if(opacity > 0) {
			context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
			context.beginPath();
			context.moveTo(particle.x, particle.y);
			context.lineTo(parent[i].x, parent[i].y);
			context.closePath();
			context.stroke();
		}
	}
}

//Calculation of the distance between two points;
const distanceCheck = (x1, y1, x2, y2) => Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
// (x2 - x1)**2 == Math.pow((x2-x1), 2);

canvas.addEventListener('click', e => {
	particles.push(new Particle(e.clientX, e.clientY));
});

canvas.addEventListener('contextmenu', e => {
	e.preventDefault();
	particles.pop();
});

setup();