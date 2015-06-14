;(function () {
    var $obj = $('.ball');
    var $center = $('.center');

    var obj;
    var winW = $(window).width();
    var winH = $(window).height();
    var center = new Vector(0.5 * winW, 0.5 * winH);
    var obj;
    var displ;
    var m = 1;
    var kSpring = 10;
    var t0;
    var dt;
    var acc;
    var force;
    var animId;
    var cDamping = 0.3;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: m
        });
        obj.pos = new Vector(400, 400);
        obj.velo = new Vector(0, 0);

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
        if (dt > 0.2) {dt = 0;};
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

        var restoring = displ.multiply(-kSpring);
        var damping = obj.velo.multiply(-cDamping);

        force = new Vector(0, 0);
        force.incrementBy(restoring);
        force.incrementBy(damping);
    }
    function updateAccel() {
        acc = force.multiply(1 / m);
    }
    function updateVelo() {
        obj.velo = obj.velo.addScaled(acc, dt);
    }

}());

