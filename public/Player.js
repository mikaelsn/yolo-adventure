var Player = function(x, y) {

	var x = x,
			y = y,
            isThrower = false,
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

    var setThrower = function() {
        isThrower = true;
    };

    var unsetThrower = function() {
        isThrower = false;
    };
  

	var update = function(keys) {
		var prevX = x,
				prevY = y;

		if (keys.up) {
			y -= move;
		} else if (keys.down) {
			y += move;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= move;
		} else if (keys.right) {
			x += move;
		};
        if(!checkCollision(160, 300, 220, x, y) && !isThrower) {
            x = prevX;
            y = prevY;
            return false;
        }
        if(checkCollision(160, 300, 220, x, y) && isThrower) {
            x = prevX;
            y = prevY;
            return false;
        }

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		ctx.fillRect(x-5, y-5, 10, 10);
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
