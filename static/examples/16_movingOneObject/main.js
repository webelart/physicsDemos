;(function () {
    var $obj = $('.ball');
    var $objs;

    var sizeEl = 50;
    var obj;
    var animId;
    var allInHome;
    var cursorForceZoomed = 50000;
    var damping = 0.85;
    var inHome = 0;
    var kSpring = 1;
    var m = 1;
    var acc;
    var dt;

    var displObj;
    var displCursor;
    var homeSin;
    var homeCos;
    var homeForce;
    var homeDistance;
    var homeDistanceReverse;
    var cursorForce;
    var cursorDistance;

    var cursorPos = new Vector(-1, -1);

    var winW = $(window).width();
    var winH = $(window).height();
    var t0 = 0;

    window.onload = events();

    function events() {
        $.Window.resize(updateResize);
        startMove();
    }

    function updateResize() {
        winW = $(window).width();
        winH = $(window).height();

        clearAndCreateEls();
        createEls();
    }

    function clearAndCreateEls() {
        $.Body.off('mousemove');
        $.Body.off('mouseleave');
        stopAnimate();
    }

    function startMove() {
        setInfo();

        $.Body
            .on('mousemove', mouseMove)
            .on('mouseleave', mouseEnd);

        animFrame();
    }

    function setInfo() {
        obj = new Obj({
            $el: $obj,
            mass: m
        });
        obj.pos = new Vector(0.5 * winW, 0.5 * winH);
        obj.home = new Vector(0.5 * winW, 0.5 * winH);
        obj.velo = new Vector(0, 0);
        obj.changeStyles();
        obj.force = new Vector(0, 0);
        obj.acc = new Vector(0, 0);
    }

    function mouseMove(evt) {
        cursorPos = new Vector(evt.pageX, evt.pageY);
        allInHome = false;
    }

    function mouseEnd() {
        cursorPos = new Vector(-1, -1);
        allInHome = false;
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function stopAnimate() {
        cancelAnimationFrame(animId);
    }

    function start() {
        if (timer) {
            return;
        }

        animFrame();
    }

    function move() {
        inHome = 0;

        calcForce();
        updateAccel();
        updateVelo();
        moveObjs();
        checkObj();

        allInHome = inHome == 1;
    }

    function onTimer() {
        if (!allInHome) {
            var t1 = new Date().getTime();
            dt = 0.007 * (t1 - t0);
            t0 = t1;

            if (dt > 2) {
                dt = 0;
            }
            move();
        }
    }

    function moveObjs() {
        obj.pos = obj.pos.addScaled(obj.velo, dt);

        // Обновление стилей
        obj.changeStyles();
    }

    function calcForce() {
        displObj = obj.pos.subtract(obj.home);

        cursorForce = new Vector(0, 0);

        if (cursorPos.x >= 0) {
            displCursor = obj.pos.subtract(cursorPos);
            cursorDistance = displCursor.length();
            if (cursorDistance > 1 && cursorDistance <= cursorForceZoomed) {
                cursorForce = displCursor.multiply(cursorForceZoomed / (cursorDistance * cursorDistance));
            }
        }

        // Обновление скорости
        var restoring = displObj.multiply(-kSpring);
        obj.force = Vector.add([restoring, cursorForce]);
    }

    function updateAccel() {
        obj.acc = obj.force.multiply(1 / m);
    }

    function updateVelo() {
        obj.velo = obj.velo.addScaled(obj.acc, dt);
        obj.velo = obj.velo.multiply(damping);
    }

    function checkObj() {
        if (Math.abs(obj.x) < 0.5 &&
            Math.abs(obj.y) < 0.5 &&
            Math.abs(obj.vx) < 0.5 &&
            Math.abs(obj.vy) < 0.5) {

            obj.velo = new Vector(0, 0);
            obj.pos = new Vector(obj.hx, obj.hy);
            inHome++;
        }
    }
}());
