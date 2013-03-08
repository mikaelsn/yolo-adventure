var Ball = function(x, y) {
	var x = x,
			y = y,
			
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

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
	}
};

exports.Ball = Ball;
