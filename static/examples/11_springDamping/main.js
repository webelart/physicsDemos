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
    var cDamping = 0.7;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: m
        });
        obj.pos = new Vector(200, 200);
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
        // dt = 0.001 * (t1 - t0);
        // t0 = t1;
        dt = 0.016;
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

        obj.force = Vector.add([restoring, damping]);
    }
    function updateAccel() {
        acc = obj.force.multiply(1 / m);
    }
    function updateVelo() {
        obj.velo = obj.velo.addScaled(acc, dt);
    }

}());

