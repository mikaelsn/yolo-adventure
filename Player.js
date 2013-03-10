var Player = function(x, y) {
	var x = x,
            isThrower = false,
			y = y,
			id;
			
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

    var setThrower = function() {
        isThrower = true;
    };

    var unsetThrower = function() {
        isThrower = false;
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
		id: id
	}
};

exports.Player = Player;
