;(function () {
    var $obj = $('.ball');
    var $center = $('.center');

    var obj;
    var center;
    var winW = $(window).width();
    var winH = $(window).height();
    var obj;
    var displ;
    var center = new Vector(0.5 * winW, 0.5 * winH);
    var m = 1;
    var kSpring = 1;
    var t0;
    var dt;
    var acc;
    var force;
    var animId;
    var cDamping = 0;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: m
        });
        obj.pos = new Vector(400, 50);
        obj.velo = new Vector(200, 0);

        t0 = new Date().getTime();
        animFrame();
    };

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.001 * (t1 - t0);
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
        displ = obj.pos.subtract(center);
        force = displ.multiply(-kSpring);
    }

    function updateAccel() {
        acc = force.multiply(1);
    }

    function updateVelo() {
        obj.velo = obj.velo.addScaled(acc, dt);
    }

}());

