var Player = function(x, y) {

	var x = x,
			y = y,
      isThrower = false,
			id,
			move = 5;
	
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

    var setThrower = function(status) {
    	isThrower = status;
    };

    var getThrower = function() {
    	return isThrower;
    };

    var getId = function() {
    	return id;
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
        if(x < 5 || y < 5 || y > 470 || x > 635) {
            x = prevX;
            y = prevY;
            return false;
        }
        if(!checkCollision(160, 300, 220, x, y) && !isThrower) {
            x = prevX;
            y = prevY;
            return false;
        };
        if(checkCollision(160, 300, 220, x, y) && isThrower) {
            x = prevX;
            y = prevY;
            return false;
        };
		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx) {
		if (!isThrower) {
			ctx.fillStyle="red";
			ctx.fillRect(x-5, y-5, 10, 10);
		} else {
			ctx.fillStyle="blue";
			ctx.fillRect(x-5, y-5, 10, 10);
		}
		
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
    setThrower: setThrower,
    getThrower: getThrower,
		update: update,
		draw: draw,
		getId: getId
	}
};
