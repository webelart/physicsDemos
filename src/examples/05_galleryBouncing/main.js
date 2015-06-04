;(function() {
    var $ball = $('.Story-introduction');

    var ball;
    var wall;
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
        ball = new Ball(winH, '#666666', m, 0, true);
        ball.pos2D = new Vector2D(0, -winH);
        wall = new Wall(new Vector2D(0, winH), new Vector2D(winW, winH));

        initAnim();
        $ball.on('mousedown', mouseDown);
        $ball.on('mouseup', mouseUp);
        $ball.on('mousemove', mouseMove);
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
        moveObject(ball);
        checkBounce(ball);
        calcForce(ball);
        updateAccel();
        updateVelo(ball);
    }

    function mouseDown(evt) {
        isDragging = true;
        stopAnimate();
        lastCoord = evt.clientY;
    }

    function mouseUp() {
        isDragging = false;
        if (Math.abs(ball.y) < winH / 2) {
            slideToUp = false;
        } else {
            slideToUp = true;
        }

        ball.vy = 0;

        animFrame();
    }

    function mouseMove(evt) {
        if (!isDragging) {
            return;
        }

        var y = evt.clientY;

        if (y < lastCoord) {
            ball.y -= (lastCoord - y);
        } else {
            ball.y += (y - lastCoord);
        }

        $ball.css('transform', 'translate3d(0px,' + ball.y + 'px,0)');

        lastCoord = y;
    }

    function moveObject(obj) {
        if (!isDragging) {
            obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
            $ball.css('transform', 'translate3d(0px,' + obj.y + 'px,0)');

            if (slideToUp && Math.abs(obj.y) > winH) {
                stopAnimate();
            }
        }
    }

    function checkBounce(obj) {
        if (Math.abs(winH - obj.y) < obj.radius) {
            var distp = obj.pos2D.subtract(wall.p1);

            var L = obj.radius - distp.length();
            var vrel = obj.velo2D.length();
            obj.pos2D = obj.pos2D.addScaled(obj.velo2D, -L / vrel);

            var normalVelo = obj.velo2D.project(distp);

            var tangentVelo = obj.velo2D.subtract(normalVelo);

            normalVelo.scaleBy(-vfac);

            obj.velo2D = normalVelo.add(tangentVelo);

            if (Math.round(Math.abs(obj.vy)) < 1) {
                stopAnimate();
            }
        }
    }

    function calcForce(obj) {
        force = new Vector2D(0, m * g - k * obj.vy);
        if (slideToUp) {
            force.negate();

        }
        // force = Forces.constantGravity(m, g);
    }

    function updateAccel() {
        acc = force.multiply(1 / m);
    }

    function updateVelo(obj) {
        obj.velo2D = obj.velo2D.addScaled(acc, dt);
    }

    function stop() {
        cancelAnimationFrame(animId);
    }
}());

