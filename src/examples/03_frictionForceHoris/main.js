;(function () {
    var $obj = $('.Story-wrapper');
    var $body = $('body');

    var isDragging = false;
    var winW = $(window).width();
    var winH = $(window).height();
    var objW = $obj.width();

    $(window).resize(function () {
        winW = $(window).width();
        winH = $(window).height();
        objW = $obj.width();
    });

    var obj;
    var m = 1;
    var t;
    var t0;
    var pos0;
    var dt;
    var animId;
    var force;
    var acc;
    var g = 10;
    var k = 0.5;

    var powerLossFactor = 1;
    var powerApplied = 50;
    var ke;
    var vmag;
    var mass;
    var isPositive = false;
    var direction = 'right';
    var shiftedX = 0;
    var oldPageX = 0;

    window.onload = init;

    function init() {
        obj = new Obj(objW, winH, m, true);
        obj.pos2D = new Vector2D(0, 0);
        obj.velo2D = new Vector2D(0, 0);

        mass = obj.mass;
        vmag = obj.velo2D.length();
        ke = 0.5 * mass * vmag * vmag;

        t0 = new Date().getTime();
        t = 0;
        // startAnim();

        $obj.on('mousedown', mouseDown);
        $obj.add($body).on('mouseup', mouseUp);
        $obj.on('mousemove', mouseMove);
    }

    function startAnim() {
        animId = requestAnimationFrame(startAnim);
        onTimer();
    }

    function stopAnimate() {
        cancelAnimationFrame(animId);
    }

    var firstStep = 0;
    function mouseDown(evt) {
        stopAnimate();
        t0 = new Date().getTime();
        obj.pos0 = obj.pos2D;
        isDragging = true;
        innerVector = new Vector2D(evt.pageX, evt.pageY);
        firstStep = obj.x;
    }

    function mouseUp() {
        if (!isDragging) {
            return false;
        }
        t1 = new Date().getTime();
        getVelo();
        isDragging = false;
    }

    function mouseMove(evt) {
        if (!isDragging) {
            return;
        }

        var pageX = firstStep + evt.pageX - innerVector.x;
        var oldPos = obj.pos2D;

        shiftedX += (pageX - oldPageX);
        obj.pos2D = new Vector2D(shiftedX, 0);

        // Смена направления для обнуления начального положения и времени.
        // Скорость в данный момент равна 0.
        if (obj.pos2D.isChangeDirection(oldPos, direction, 'x')) {
            direction = (direction === 'secondSide') ? 'firstSide' : 'secondSide';

            t0 = new Date().getTime();
            obj.pos0 = obj.pos2D;
        }

        checkObjPos();
        $obj.css('transform', 'translate3d(' + obj.x + 'px, 0px,0)');
        oldPageX = pageX;
    }

    function checkObjPos() {
        if (obj.x > 0) {
            obj.x = 0;
        } else if (obj.x < -objW + winW) {
            obj.x = -objW + winW;
        }
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.001 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {dt = 0;}; // fix for bug if user switches tabs
        t += dt;
        move();
    }

    function move() {
        moveObject();
        applyPower();
        updateVelo();
    }

    function moveObject() {
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
        checkObjPos();
        $obj.css('transform', 'translate3d(' + obj.x + 'px, 0px,0)');
    }

    function applyPower() {
        ke -= powerLossFactor * vmag * vmag * dt;

        if (Math.round(ke) <= 1) {
            stopAnimate();
        }
    }

    function updateVelo() {
        vmag = Math.sqrt(2 * ke / mass);
        vmag = (isPositive) ? vmag : -vmag;
        obj.vx = vmag;
    }

    function getVelo() {
        obj.vx = (obj.pos2D.x - obj.pos0.x) / ((t1 - t0) * 0.001);
        t0 = new Date().getTime();

        if (obj.vx >= 0) {
            isPositive = true;
        } else {
            isPositive = false;
        }

        vmag = obj.velo2D.length();
        vmag = (isPositive) ? vmag : -vmag;
        ke = 0.5 * mass * vmag * vmag;
        startAnim();
    }
}());

