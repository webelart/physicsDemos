;(function () {
    var $cont = $('.container');
    var $obj = $('.ball');
    var winW = $(window).width();
    var winH = $(window).height();
    var obj;
    var t0 = 0;

    var isDragging = false;

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

    var powerLossFactor = 4;
    var powerApplied = 50;
    var ke;
    var vmag;
    var mass;
    var isPositive = {
        x: false,
        y: false
    };

    window.onload = init;

    function init() {
        obj = new Obj({
            mass: m,
            $el: $obj,
            radius: 100
        });

        obj.pos = new Vector(0, 0);
        obj.velo = new Vector(0, 0);

        obj.changeStyles();

        mass = obj.mass;
        vmag = obj.velo;
        ke = new Vector(0.5 * mass * obj.vx * obj.vx, 0.5 * mass * obj.vy * obj.vy);

        t0 = new Date().getTime();

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

    function onTimer() {
        var t1 = new Date().getTime();
        dt = t1 - t0;

        dt = 0.017;
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
        var powerLoss = new Vector(-powerLossFactor * obj.vx * obj.vx * dt,
                                   -powerLossFactor * obj.vy * obj.vy * dt);
        ke = ke.add(powerLoss);

        if (Math.round(ke.x) <= 1 && Math.round(ke.y) <= 1) {
            stopAnimate();
        }
    }

    function updateVelo() {
        obj.velo = new Vector(Math.sqrt(2 * ke.x / mass), Math.sqrt(2 * ke.y / mass));
        obj.vy = (isPositive.y) ? obj.vy : -obj.vy;
        obj.vx = (isPositive.x) ? obj.vx : -obj.vx;
    }

    function mouseDown(evt) {
        stopAnimate();
        t0 = new Date().getTime();
        obj.pos0 = obj.pos;
        isDragging = true;
        innerVector = getXY(evt, 'offset');
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

        var oldPos = obj.pos;
        var mousePos = getXY(evt, 'page');

        obj.pos = mousePos.subtract(innerVector);

        checkObjPos();
        obj.changeStyles();
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

    function getXY(evt, param) {
        var touch;
        if ($.isTouch) {
            touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
        }

        var x = $.isTouch ? touch.pageX : evt[param + 'X'];
        var y = $.isTouch ? touch.pageY : evt[param + 'Y'];

        if ($.isTouch && param === 'offset') {
            x -= obj.$el.offset().left;
            y -= obj.$el.offset().top;
        }

        return new Vector(x, y);
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

    function checkObjPos() {
        obj.pos = obj.pos.setBoundaries({minX: 0, maxX: winW}, {minY: 0, maxY: winH}, obj.radius);
    }
}());

