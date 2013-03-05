var keyhandler = (function() {
    var keys = new Array();
    var i = 0;
    while(i < 256) {
        keys[i] = false;
        i = i + 1;
    }
 
    function up() {
        return keys[38] || keys[175] || keys[87];
    }
 
    function down() {
        return keys[40] || keys[176] || keys[83];
    }
 
    function left() {
        return keys[37] || keys[178] || keys[65];
    }
 
    function right() {
        return keys[39] || keys[177] || keys[68];
    }
     
    function keydown(keycode) {
        keys[keycode] = true;
    }    
     
    function keyup(keycode) {
        keys[keycode] = false;
    }
     
    return {
        up: up,
        down: down,
        left: left,
        right: right,
        keydown: keydown,
        keyup: keyup
    };
})()