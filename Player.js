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

  var setThrower = function(status) {
  	isThrower = status;
  };

  var getThrower = function() {
  	return isThrower;
  };

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var getId = function() {
		return id;
	}

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		setThrower: setThrower,
    getThrower: getThrower,		
		id: id
	}
};

exports.Player = Player;
