;(function () {
    var $obj = $('.ball');
    var $center = $('.center');

    var obj;
    var center;
    var winW = $(window).width();
    var winH = $(window).height();
    var obj;
    var m = 1;
    var kSpring = 5;
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
        obj.pos = new Vector(300, 300);
        obj.velo = new Vector(0, 0);

        center = new Obj({
            $el: $center
        });
        center.pos = new Vector(0.5 * winW, 0.5 * winH);

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
        var displ = obj.pos.subtract(center.pos);
        force = displ.multiply(-kSpring);
    }

    function updateAccel() {
        acc = force.divide(obj.mass);
    }

    function updateVelo() {
        obj.velo = obj.velo.addScaled(acc, dt);
    }

}());

