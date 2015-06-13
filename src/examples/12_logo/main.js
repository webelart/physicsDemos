;(function () {
    var $body = $('body');
    var winW = $(window).width();
    var winH = $(window).height();

    // Селекторы
    var $container = $('.Logos');
    var $logo = $container.find('.Logos-item');
    var $cover = $logo.find('.Logos-cover');

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
    var kSpring = 10;
    var t0;
    var dt;
    var acc;
    var force;
    var animId;
    var cDamping = 0.2;
    var isMoving = false;

    function getCenter() {
        var offPosition = $cover.offset();
        return new Vector2D(offPosition.left, offPosition.top);
    }

    window.onload = init;

    function init() {
        obj = new Obj($cover.width(), $cover.height(), m, 0);
        obj.velo2D = new Vector2D(100, 0);

        $cover.on('mousedown', mouseDown);
        $body.on('mousemove', mouseMove);
        $body.on('mouseup', mouseUp);
    };

    function mouseDown(evt) {
        stretchFirstPosition = new Vector2D(evt.pageX, evt.pageY);
        stretchMoving = true;
        stretchIsFirstPos = obj.pos2D;

        stopAnimate();
    }

    function mouseMove(evt) {
        if (!stretchMoving) {
            return false;
        }

        var stretchMovingPosition = new Vector2D(evt.pageX, evt.pageY);
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

        obj.pos2D = damping.add(stretchIsFirstPos);

        $cover.css('transform', 'translate3d(' + obj.x + 'px, ' + obj.y + 'px, 0)');
    }

    function getDamping(displ) {
        var restoring = Forces.spring(stretchKSpring, displ);
        var damping = Forces.damping(stretchCDamping, restoring);
        return damping;
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.005 * (t1 - t0);
        t0 = t1;

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
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);

        if (Math.round(obj.x) === 0 && Math.round(obj.y) === 0) {
            obj.pos2D = new Vector2D(0, 0);
            stopAnimate();
        }

        $cover.css('transform', 'translate3d(' + obj.x + 'px, ' + obj.y + 'px, 0)');
    }

    function calcForce() {
        displ = obj.pos2D.subtract(centerPosition);

        var restoring = Forces.spring(kSpring, displ);
        var damping = Forces.damping(cDamping, obj.velo2D);

        force = Forces.add([restoring, damping]);

    }

    function updateAccel() {
        acc = force.multiply(1 / m);
    }

    function updateVelo(obj) {
        obj.velo2D = obj.velo2D.add(acc, dt);
    }

    function stopAnimate() {
        isMoving = false;
        cancelAnimationFrame(animId);
    }

}());

