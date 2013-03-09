var Ball = function(x, y, tx, ty) {
	var x = x,
			y = y,
			tx = tx, // Target x
			ty = ty, // Targut y
			vx, // Velocity x
			vy, // Velocity y
			id;
			
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var getTx = function() {
		return tx;
	};	

	var getTy = function() {
		return ty;
	};

	var getVx = function() {
		return vx;
	};

	var getVy = function() {
		return vy;
	};
			
	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setTx = function(newX) {
		tx = newX;
	};

	var setTy = function(newY) {
		ty = newY;
	};

	var setVx = function(newX) {
		vx = newX;
	};

	var setVy = function(newY) {
		vy = newY;
	};	

	return {
		getX: getX,
		getY: getY,
		getTx: getTx,
		getTy: getTy,
		getVx: getVx,
		getVy: getVy,
		setX: setX,
		setY: setY,
		setTx: setTx,
		setTy: setTy,
		setVx: setVx,
		setVy: setVy,		
		id: id
	}
};

exports.Ball = Ball;
