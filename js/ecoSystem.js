function Vector(x, y){
	this.x = x;
	this.y = y;
}
Vector.prototype.plus = function(other){
	return new Vector(this.x+other.x,this.y+other.y);
}//使用坐标偏移量实现动作

function Map(width,height){
	this.space = new Array(width, height);
	this.width = width;
	this.height = height;
}

Map.prototype.isInsie = function(vector){
	return vector.x >= 0 && vector.x <= this.width 
	&& vector.y >= 0 && vector.y <= this.height;
};

Map.prototype.get = function(vector){
	return this.space[vector.x + this.width * vector.y];
};

Map.prototype.set = function(vector, value){
	this.space[vector.x + this.width * vector.y] = value;
};

var direction = {
	'n' : new Vector(0, 1),
	's' : new Vector(0, -1),
	'e' : new Vector(1, 0),
	'w' : new Vector(-1, 0),
	'ne' : new Vector(1, 1),
	'nw' : new Vector(-1, 1),
	'se' : new Vector(1, -1),
	'sw' : new Vector(-1, -1)
};

function randomElement(array){
	return array[Math.floor(Math.random() * array.length)];
}

var directionNames = 'n s e w ne nw se sw'.split(' ');

function movableCritter(){
	this.direction = randomElement(directionNames);
};

movableCritter.prototype.act = function(view){
	if (view.look(this.direction) != ' ')
	this.direction = view.find(' ') || 's';
	return {type : 'move', direction: this.direction}
}

function elementFromChar(legend, ch){
	if (ch == ' ') var element = new legend[ch]();
	element.oringinChar = ch;
	return element;
}
function World(){};
