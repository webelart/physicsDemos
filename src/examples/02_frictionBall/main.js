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

    var powerLossFactor = 2;
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
            m: m,
            $el: $obj,
            radius: 100
        });

        obj.pos2D = new Vector2D(0, 0);
        obj.velo2D = new Vector2D(0, 0);

        obj.changeStyles();

        mass = obj.mass;
        vmag = obj.velo2D;
        ke = new Vector2D(0.5 * mass * obj.velo2D.x * obj.velo2D.x, 0.5 * mass * obj.velo2D.y * obj.velo2D.y);

        t0 = new Date().getTime();

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

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.001 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {
            dt = 0;
        };
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
        obj.changeStyles();
    }

    function applyPower() {
        ke = ke.subtract(new Vector2D(powerLossFactor * obj.velo2D.x * obj.velo2D.x * dt,
                                      powerLossFactor * obj.velo2D.y * obj.velo2D.y * dt));

        if (Math.round(ke.x) <= 1 && Math.round(ke.y) <= 1) {
            stopAnimate();
        }
    }

    function updateVelo() {
        obj.velo2D = new Vector2D(Math.sqrt(2 * ke.x / mass), Math.sqrt(2 * ke.y / mass));
        obj.vy = (isPositive.y) ? obj.velo2D.y : -obj.velo2D.y;
        obj.vx = (isPositive.x) ? obj.velo2D.x : -obj.velo2D.x;
    }

    function mouseDown(evt) {
        stopAnimate();
        t0 = new Date().getTime();
        obj.pos0 = obj.pos2D;
        isDragging = true;
        innerVector = new Vector2D(evt.offsetX, evt.offsetY);
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

        var oldPos = obj.pos2D;
        var mousePos = new Vector2D(evt.pageX, evt.pageY);

        obj.pos2D = mousePos.subtract(innerVector);

        checkObjPos();
        obj.changeStyles();
    }

    function getVelo() {
        obj.velo2D = obj.pos2D.subtract(obj.pos0);
        obj.velo2D = obj.velo2D.multiply(1 / ((t1 - t0) * 0.001));

        t0 = new Date().getTime();

        setPositive();

        ke = new Vector2D(0.5 * mass * obj.velo2D.x * obj.velo2D.x,
                          0.5 * mass * obj.velo2D.y * obj.velo2D.y);
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

    function checkObjPos() {
        obj.pos2D = obj.pos2D.setBoundaries({minX: 0, maxX: winW}, {minY: 0, maxY: winH}, obj.radius);
    }
}());

