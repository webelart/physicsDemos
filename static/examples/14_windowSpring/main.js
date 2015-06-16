;(function () {
    var $body = $('body');
    var winW = $(window).width();
    var winH = $(window).height();

    // Селекторы
    var $cover = $('.Article');

    var centerCover = getCenter();
    var centerPosition = new Obj(2, 2);

    // Необходимые параметры для первого оттягивания
    var stretchKSpring = 0.8;
    var stretchCDamping = 0.6;
    var stretchFirstPosition;
    var stretchMoving = false;
    var stretchForce;
    var stretchIsFirst = false;
    var stretchLastDispl;

    // Параметры для возвращения
    var obj;
    var m = 1;
    var kSpring = 20;
    var t0;
    var dt;
    var acc;
    var force;
    var animId;
    var cDamping = 10;
    var isMoving = false;

    function getCenter() {
        var offPosition = $cover.offset();
        return new Vector(offPosition.left, offPosition.top);
    }

    window.onload = init;

    function init() {
        obj = new Obj({
            $el: $cover,
            w: $cover.width(),
            h: $cover.height(),
            m: m
        });
        obj.velo = new Vector(0, 0);

        $cover.on('mousedown', mouseDown);
        $cover.on('mousemove', mouseMove);
        $cover.on('mouseup', mouseUp);
    };

    function mouseDown(evt) {
        stretchFirstPosition = new Vector(0, evt.pageY);
        stretchMoving = true;
        stretchIsFirstPos = obj.pos;

        stopAnimate();
    }

    function mouseMove(evt) {
        if (!stretchMoving) {
            return false;
        }

        var stretchMovingPosition = new Vector(0, evt.pageY);
        stretchForce = stretchFirstPosition.subtract(stretchMovingPosition);
        stretchCalcForce();

        if (stretchIsFirst) {
            stretchIsFirst = false;
        }
    }

    function mouseUp() {
        stretchMoving = false;
        t0 = new Date().getTime();
        stretchLastDispl = stretchForce.add(stretchIsFirstPos.multiply(-1));
        animFrame();
    }

    function stretchCalcForce() {
        var displ = stretchForce;
        var damping = getDamping(displ).multiply(-1);

        obj.pos = damping.add(stretchIsFirstPos);

        obj.changeStyles();
    }

    function getDamping(displ) {
        var restoring = displ.multiply(stretchKSpring);
        var damping = restoring.multiply(stretchCDamping);
        return damping;
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function onTimer() {
        var t1 = new Date().getTime();
        // dt = 0.005 * (t1 - t0);
        // t0 = t1;
        dt = 0.08;

        if (dt > 0.2) {
            dt = 0;
        }

        move();
    }

    function move() {
        isMoving = true;
        moveObject(obj);
        calcForce();
        updateAccel();
        updateVelo(obj);
    }

    function moveObject(obj) {
        obj.pos = obj.pos.addScaled(obj.velo, dt);

        if (Math.round(obj.x) === 0 && Math.round(obj.y) === 0) {
            obj.pos = new Vector(0, 0);
            stopAnimate();
        }

        obj.changeStyles();
    }

    function calcForce() {
        displ = obj.pos.subtract(centerPosition);
        var restoring = displ.multiply(-kSpring);
        var damping = obj.velo.multiply(-cDamping);

        force = new Vector(0, 0);
        force.incrementBy(restoring);
        force.incrementBy(damping);

    }

    function updateAccel() {
        acc = force.multiply(1 / m);
    }

    function updateVelo(obj) {
        obj.velo = obj.velo.addScaled(acc, dt);
    }

    function stopAnimate() {
        isMoving = false;
        cancelAnimationFrame(animId);
    }
}());
