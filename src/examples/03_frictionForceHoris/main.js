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

    var powerLossFactor = 2;
    var ke;
    var vmag;
    var mass;
    var isPositive = {};
    var direction = 'right';
    var shiftedX = 0;
    var oldPageX = 0;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: m
        });
        obj.pos = new Vector(0, 0);
        obj.velo = new Vector(0, 0);

        ke = new Vector(0.5 * obj.mass * obj.vx * obj.vx, 0);

        t0 = new Date().getTime();
        t = 0;

        $obj.on('mousedown', mouseDown);
        $.Body.add($obj).on('mouseup', mouseUp);
        $.Body.add($obj).on('mousemove', mouseMove);

        $obj.on('touchstart', mouseDown);
        $.Body.add($obj).on('touchend', mouseUp);
        $.Body.add($obj).on('touchmove', mouseMove);
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
        obj.pos0 = obj.pos;
        isDragging = true;

        var xy = getXY(evt);
        innerVector = new Vector(xy[0], xy[1]);
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

        var xy = getXY(evt);

        var pageX = firstStep + xy[0] - innerVector.x;
        var oldPos = obj.pos;

        shiftedX += (pageX - oldPageX);
        obj.pos = new Vector(shiftedX, 0);

        // Смена направления для обнуления начального положения и времени.
        // Скорость в данный момент равна 0.
        if (obj.pos.isChangeDirection(oldPos, direction, 'x')) {
            direction = (direction === 'secondSide') ? 'firstSide' : 'secondSide';

            t0 = new Date().getTime();
            obj.pos0 = obj.pos;
        }

        checkObjPos();
        obj.changeStyles();
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
        dt = t1 - t0;

        if (dt > 15) {
            dt = 15;
        }

        dt *= 0.001;
        t0 = t1;

        if (dt > 0.2) {
            dt = 0; // Фиксит баг когда переходим в другую вкладку.
        }
        move();
    }

    function move() {
        moveObject();
        applyPower();
        updateVelo();
    }

    function moveObject() {
        obj.pos = obj.pos.addScaled(obj.velo, dt);

        checkObjPos();
        obj.changeStyles();
    }

    function applyPower() {
        var powerLoss = new Vector(powerLossFactor * obj.vx * obj.vx * dt,
                                   powerLossFactor * obj.vy * obj.vy * dt);
        ke = ke.subtract(powerLoss);

        if (Math.round(ke.x) <= 1 && Math.round(ke.y) <= 1) {
            stopAnimate();
        }
    }

    function updateVelo() {
        obj.velo = new Vector(Math.sqrt(2 * ke.x / obj.mass), 0);
        obj.vx = (isPositive.x) ? obj.vx : -obj.vx;
    }

    function getVelo() {
        var displ = obj.pos.subtract(obj.pos0);
        obj.velo = displ.divide((t1 - t0) * 0.001);

        t0 = new Date().getTime();

        setPositive();

        ke = new Vector(0.5 * obj.mass * obj.vx * obj.vx,
                        0.5 * obj.mass * obj.vy * obj.vy);
        startAnim();
    }

    function getXY(evt) {
        var touch;
        if ($.isTouch) {
            touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
        }

        var x = $.isTouch ? touch.pageX : evt.pageX;
        var y = $.isTouch ? touch.pageY : evt.pageX;

        return [x, y];
    }

    function setPositive() {
        if (obj.vy >= 0) {
            isPositive.y = true;
        } else {
            isPositive.y = false;
        }

        if (obj.vx >= 0) {
            isPositive.x = true;
        } else {
            isPositive.x = false;
        }
    }
}());

