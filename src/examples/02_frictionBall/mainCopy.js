;(function() {
    var $ball = $('.ball');
    var $body = $('body');

    // $storyWrapper.on('mousedown', startDrag);
    // $storyWrapper.on('mouseup', stopDrag);
    // $storyWrapper.on('mousemove', dragging);

    var isDragging = false;
    var winW = $(window).width();
    var winH = $(window).height();

    $(window).resize(function() {
        winW = $(window).width();
        winH = $(window).height();
    });

    var ball;
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

    window.onload = init;

    function init() {
        ball = new Ball(50, '#666666', false, m, true);
        ball.pos2D = new Vector2D(500, 500);
        ball.velo2D = new Vector2D(0, 0);

        mass = ball.mass;
        vmag = ball.velo2D.length();
        ke = 0.5 * mass * vmag * vmag;

        t0 = new Date().getTime();
        t = 0;
        // startAnim();

        $ball.on('mousedown', mouseDown);
        $body.add($ball).on('mouseup', mouseUp)
        $body.add($ball).on('mousemove', mouseMove);
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
        ball.pos2D = ball.pos2D.addScaled(ball.velo2D, dt);
        checkBallPos();
        $ball.css('transform', 'translate3d(' + ball.x + 'px, ' + ball.y + 'px,0)');
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
        ball.vx = vmag;
    }

    function mouseDown(evt) {
        stopAnimate();
        t0 = new Date().getTime();
        ball.pos0 = ball.pos2D;
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

        var x = evt.pageX;
        var y = evt.pageY;

        var oldPos = ball.pos2D;
        ball.pos2D = new Vector2D(x - innerVector.x, y - innerVector.y);

        // Смена направления для обнуления начального положения и времени.
        // Скорость в данный момент равна 0.
        var isChangeDirection = ball.pos2D.isChangeDirection(oldPos, direction);
        // if (isChangeDirection) {
        //     direction = (direction === 'right') ? 'left' : 'right';

        //     t0 = new Date().getTime();
        //     ball.pos0 = ball.pos2D;
        // }

        checkBallPos();
        $ball.css('transform', 'translate3d(' + ball.x + 'px, ' + ball.y + 'px,0)');
    }

    function getVelo() {
        ball.vx = (ball.pos2D.x - ball.pos0.x) / ((t1 - t0) * 0.001);
        ball.vy = (ball.pos2D.y - ball.pos0.y) / ((t1 - t0) * 0.001);
        t0 = new Date().getTime();

        if (ball.vx >= 0) {
            isPositive = true;
        } else {
            isPositive = false;
        }

        vmag = ball.velo2D.length();
        vmag = (isPositive) ? vmag : -vmag;
        ke = 0.5 * mass * vmag * vmag;
        startAnim();
    }

    function checkBallPos() {
        ball.pos2D = ball.pos2D.setBoundaries({minX: 0, maxX: winW}, {minY: 0, maxY: winH}, ball.radius);
    }
}());


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
    var k = 0.5;

    var powerLossFactor = 1;
    var powerApplied = 50;
    var ke;
    var vmag;
    var mass;
    var isPositive = false;
    var direction = 'secondSide';

    window.onload = init;

    function init() {
        obj = new Obj({
            m: m,
            $el: $obj,
            radius: 100
        });

        obj.pos2D = new Vector2D(10, 10);
        obj.velo2D = new Vector2D(0, 0);

        mass = obj.mass;
        vmag = obj.velo2D.length();
        ke = 0.5 * mass * vmag * vmag;

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

    function mouseDown(evt) {
        stopAnimate();
        t0 = new Date().getTime();
        obj.pos0 = obj.pos2D;
        isDragging = true;
        innerVector = new Vector2D(evt.offsetX, 0);
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

        var x = evt.pageX;
        var y = evt.pageY;

        var oldPos = obj.pos2D;
        obj.pos2D = new Vector2D(x - innerVector.x, 0);

        // console.log(obj.pos2D);
        // Смена направления для обнуления начального положения и времени.
        // Скорость в данный момент равна 0.
        // if (obj.pos2D.isChangeDirection(oldPos, direction, 'x')) {
        //     direction = (direction === 'firstSide') ? 'secondSide' : 'firstSide';

        //     t0 = new Date().getTime();
        //     obj.pos0 = obj.pos2D;
        // }

        checkObjPos();
        obj.changeStyles();
    }

    function getVelo() {
        var objSubtract = obj.pos2D.subtract(obj.pos0);

        obj.velo2D = objSubtract.multiply((t1 - t0) * 0.001);
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

    function checkObjPos() {
        obj.pos2D.setBoundaries({minX: 0, maxX: winW}, {minY: 0, maxY: winH}, obj.radius);
    }
}());



