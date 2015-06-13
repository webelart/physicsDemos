;(function () {
    var $obj = $('.Story-introduction');

    var obj;
    var floor;
    var m = 10;
    var g = 10;
    var vfac = 0.3;
    var k = 0;
    var t0;
    var dt;
    var force;
    var acc;
    var animId;
    var winW = $(window).width();
    var winH = $(window).height();
    var isDragging = false;
    var slideToUp = false;

    var lastCoord;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: m,
            radius: 100
        });

        obj.pos2D = new Vector2D(0, -winH);
        floor = new Vector2D(0, 0);

        initAnim();
        $obj.on('mousedown', mouseDown);
        $obj.on('mouseup', mouseUp);
        $obj.on('mousemove', mouseMove);
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
        dt = 0.006 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {dt = 0;};
        move();
    }

    function move() {
        moveObject();
        checkBounce();
        calcForce();
        updateAccel();
        updateVelo();
    }

    function mouseDown(evt) {
        isDragging = true;
        stopAnimate();
        lastCoord = evt.clientY;
    }

    function mouseUp() {
        isDragging = false;

        if (Math.abs(obj.y) < winH / 2) {
            slideToUp = false;
        } else {
            slideToUp = true;
        }

        obj.vy = 0;
        animFrame();
    }

    function mouseMove(evt) {
        if (!isDragging) {
            return;
        }

        var y = evt.clientY;

        if (y < lastCoord) {
            obj.y -= (lastCoord - y);
        } else {
            obj.y += (y - lastCoord);
        }

        obj.changeStyles();

        lastCoord = y;
    }

    function moveObject() {
        if (!isDragging) {
            obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
            obj.changeStyles();

            if (slideToUp && Math.abs(obj.y) > winH) {
                stopAnimate();
            }
        }
    }

    function checkBounce() {
        var displ = floor.subtract(obj.pos2D);
        if (displ.y <= 0) {
            obj.y = floor.y;
            obj.vy *= -vfac;
        }
    }

    function calcForce() {
        force = new Vector2D(0, m * g - k * obj.vy);
        if (slideToUp) {
            force.negate();
        }
    }

    function updateAccel() {
        acc = force.multiply(1 / m);
    }

    function updateVelo() {
        obj.velo2D = obj.velo2D.addScaled(acc, dt);
    }

    function stop() {
        cancelAnimationFrame(animId);
    }
}());

