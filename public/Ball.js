var Ball = function(x, y) {

	var x = x,
			y = y,
			id,
			move = 20;
	
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var update = function(keys) {
		
	};

	// Draw player
	var draw = function(ctx) {
		ctx.beginPath();
		ctx.arc(95,50,40,0,2*Math.PI);
		ctx.stroke();
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw
	}
};