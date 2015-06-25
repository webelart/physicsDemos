;(function () {
    var $obj = $('.Story-wrapper');
    var $body = $('body');

    var isDragging = false;
    var winW = $(window).width();
    var winH = $(window).height();
    var objH = $obj.height();

    $(window).resize(function () {
        winW = $(window).width();
        winH = $(window).height();
        objH = $obj.height();
    });

    var obj;
    var m = 1;
    var t;
    var t0;
    var pos0;
    var dt;
    var animId;
    var g = 10;

    var powerLossFactor = 2;
    var ke;
    var vmag;
    var mass;
    var isPositive = {};
    var direction = 'firstSide';
    var shiftedY = 0;
    var oldPageY = 0;

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: m
        });
        obj.pos = new Vector(0, 0);
        obj.velo = new Vector(0, 0);

        ke = new Vector(0, 0.5 * obj.mass * obj.vy * obj.vy);

        t0 = new Date().getTime();
        t = 0;

        $obj.on('mousedown', mouseDown);
        $.Body.add($obj).on('mouseup', mouseUp);
        $.Body.add($obj).on('mousemove', mouseMove);
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

        innerVector = new Vector(evt.pageX, evt.pageY);
        firstStep = obj.y;
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

        var pageY = firstStep + evt.pageY - innerVector.y;
        var oldPos = obj.pos;

        shiftedY += (pageY - oldPageY);
        obj.pos = new Vector(0, shiftedY);

        // Смена направления для обнуления начального положения и времени.
        // Скорость в данный момент равна 0.
        if (obj.pos.isChangeDirection(oldPos, direction, 'y')) {
            direction = (direction === 'secondSide') ? 'firstSide' : 'secondSide';

            t0 = new Date().getTime();
            obj.pos0 = obj.pos;
        }

        checkObjPos();
        obj.changeStyles();
        oldPageY = pageY;
    }

    function checkObjPos() {
        if (obj.y > 0) {
            obj.y = 0;
        } else if (obj.y < -objH + winH) {
            obj.y = -objH + winH;
        }
    }

    function onTimer() {
        dt = 0.017; /* По сути время представляет собой константу,
                      которая при стабильной работе компьютера, без задержек равна примерно 17 = 1000/60 (60 кадров в секунду).
                      Т.е. величина как мы видим постоянная. В примерах взято число, т.к. если вдруг компьютер не стабилен, то при
                      четком расчете времени анимация прыгает, а если число, то она просто задерживается (тоже не хорошо, но выглядет менее заметно). */

        // var t1 = new Date().getTime();
        // dt = t1 - t0;

        // if (dt > 15) {
        //     dt = 15;
        // }

        // t0 = t1;

        // if (dt > 0.2) {
        //     dt = 0; // Фиксит баг когда переходим в другую вкладку.
        // }
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
        obj.velo = new Vector(0, Math.sqrt(2 * ke.y / obj.mass));
        obj.vy = (isPositive.y) ? obj.vy : -obj.vy;
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

