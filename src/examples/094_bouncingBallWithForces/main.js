;(function() {
    var $ball = $('.ball');
    var $body = $('body');

    var ball;
    var wall;
    var m = 10;
    var g = 10;
    var vfac = 0.7;
    var k = 0;
    var t0;
    var dt;
    var force;
    var acc;
    var animId;
    var winW = $(window).width();
    var winH = $(window).height();
    var isDragging = false;

    window.onload = init;

    function init() {
        ball = new Ball(100, '#666666', m, 0, true);
        ball.pos2D = new Vector2D(0, -10);
        wall = new Wall(new Vector2D(0, winH), new Vector2D(winW, winH));

        initAnim();

        $ball.on('mousedown', mouseDown);
        $body.add($ball).on('mouseup', mouseUp)
        $body.add($ball).on('mousemove', mouseMove);
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

    function mouseDown() {
        console.log('down')
        isDragging = true;
        stopAnimate();
    }

    function mouseUp() {
        console.log('up')
        isDragging = false;
        animFrame();
    }

    function mouseMove(evt) {
        if (!isDragging) {
            return;
        }
        // ball.x = evt.clientX;
        // ball.y = evt.clientY;
        var x = evt.pageX;
        var y = evt.pageY;

        ball.pos2D = new Vector2D(x - ball.radius / 2, y - ball.radius / 2);
        $ball.css('transform', 'translate3d(0px,' + ball.y + 'px,0)')
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.005 * (t1 - t0);
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

    function moveObject(obj) {
        if (!isDragging) {
            obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
            $ball.css('transform', 'translate3d(0px,' + obj.y + 'px,0)');
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
        }
    }

    function calcForce(obj) {
        force = new Vector2D(0, m * g - k * obj.vy);
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

