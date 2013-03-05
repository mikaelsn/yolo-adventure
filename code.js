"use strict"

window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(callback, element){
        window.setTimeout(callback, 1000 / 60);
    };
})();

var yolo = {
	defeat: null,
	player: null,
	platform: null,
	domain: {},
	moveable: [],

	init: function() {
		yolo.logic();
		yolo.process();
		requestAnimFrame(yolo.init);
	},

	logic: function() {

		if(Math.random() > 0.95) {
			var y = Math.floor(Math.random() * 9) * 40 + 40;
			var box = new yolo.domain.Box(-40, y, 40, 40, "rgb(0, 0, 255)");
			yolo.moveable.push(box);
		}

		for(var i = 0; i < yolo.moveable.length; i++) {
			box = yolo.moveable[i];
			box.move(3, 0);

			if(box.x > 640) {
				yolo.moveable.splice(yolo.moveable.indexOf(box), 1);
			}

			if(yolo.player.hits(box)) {
				yolo.defeat = "You got burned! #yolo";
			}

		}

	},

	animate: function(context) {
		yolo.platform.width = yolo.platform.width;

		if(yolo.defeat) {
			context.fillStyle = "rgb(0, 255, 255)";
			context.font = "bold 1.5em Verdana";
			context.fillText(yolo.defeat, 220, 180);
			return;
		}

		context.arc(300,220,160,0,2*Math.PI);
		context.stroke();

		for(var i = 0; i < yolo.moveable.length; i++) {
			var box = yolo.moveable[i];
			box.animate(context);
		}

		yolo.player.animate(context);
	},

	process: function () {
		yolo.animate(yolo.platform.getContext("2d"));
	}


}

yolo.domain.Box = function(x, y, width, heigth, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.heigth = heigth;
	this.color = color;
}

yolo.domain.Box.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
}

yolo.domain.Box.prototype.animate = function(context) {
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.heigth);
}

yolo.domain.Box.prototype.hits = function(box) {
    if(box.x + box.width <= this.x) {
        return false;
    }
         
    if(box.x >= this.x + this.width) {
        return false;
    }
     
    if(box.y + box.heigth <= this.y) {
        return false;
    }
     
    if(box.y >= this.y + this.heigth) {
        return false;
    }
     
    return true;
}

$(document).ready(function() {
    yolo.platform = $("#yolo")[0];
     
    var yoloman = new yolo.domain.Box(320, 220, 40, 40, "rgb(0, 255, 0)");
    yolo.player = yoloman;
     
    $(document).keydown(function(eventInformation) {
        keyhandler.keydown(eventInformation.which);
         
        if(keyhandler.up()) {
            yoloman.move(0, -20);
        } else if (keyhandler.down()) {
            yoloman.move(0, 20);
        } else if (keyhandler.left()) {
            yoloman.move(-20, 0);
        } else if (keyhandler.right()) {
            yoloman.move(20, 0);
        }
    });
     
    $(document).keyup(function(eventInformation) {
        keyhandler.keyup(eventInformation.which);
    });
     
    yolo.init();
});