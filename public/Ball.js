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

	var update = function(eventInfo) {
		var targetX = tx - x,
				targetY = ty - y,
				dist = Math.sqrt(targetX*targetX+targetY*targetY),

				vx = (targetX/dist)*10,
				vy = (targetY/dist)*10;
                if(Math.abs(tx-x) < 5 &&Math.abs(ty-y) < 5) {
                    console.log("bingo");
                    x = 666;
                    y = 666;
                }
				x += vx;
				y += vy;
	};

	// Draw ball
	var draw = function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "#00FF00"
		ctx.arc(x,y,15,0,2*Math.PI);
		ctx.fill();
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
