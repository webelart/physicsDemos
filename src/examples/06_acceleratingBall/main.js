;(function () {
    var $obj = $('.Ball');

    var obj;
    var wall;
    var floor;
    var mass = 10;
    var g = 10;
    var vfac = 0.7;
    var k = 0.2;
    var t0;
    var dt;
    var force;
    var acc;
    var animId;
    var winW = $.Window.width();
    var winH = $.Window.height();
    var floorH = 40;

    init();
    window.onload = initAnim;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: mass,
            radius: 100
        });

        obj.pos = new Vector(winW / 2 - obj.radius, 0);
        floor = new Vector(winW / 2 - obj.radius, winH - floorH);
        obj.changeStyles();
    }

    function initAnim() {
        t0 = new Date().getTime();
        animFrame();
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function stopAnimate() {
        cancelAnimationFrame(animId);
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.004 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {
            dt = 0;
        }
        move();
    }

    function move() {
        moveObject();
        calcForce();
        updateAccel();
        updateVelo();
    }

    function moveObject() {
        obj.pos = obj.pos.addScaled(obj.velo, dt);
        obj.changeStyles();
    }

    function calcForce() {
        force = new Vector(0, obj.mass * g - k * obj.vy);
    }

    function updateAccel() {
        acc = force.divide(obj.mass);
    }

    function updateVelo() {
        obj.velo = obj.velo.addScaled(acc, dt);
    }
}());
