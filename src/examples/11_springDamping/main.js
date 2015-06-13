;(function () {
    var $ball = $('.ball');

    var winW = $(window).width();
    var winH = $(window).height();
    var ball;
    var displ;
    var center = new Vector2D(0.5 * winW, 0.5 * winH);
    var m = 1;
    var kSpring = 10;
    var t0;
    var dt;
    var acc;
    var force;
    var animId;
    var cDamping = 0.5;

    window.onload = init;

    function init() {
        ball = new Ball(50, '#0000cc', false, m, 0);
        ball.pos2D = new Vector2D(400, 400);

        // Добавляем скорость по координате х и объект движется по орбите.
        ball.velo2D = new Vector2D(300, 0);

        var attractor = new Ball(4, '#000000');
        attractor.pos2D = center;

        t0 = new Date().getTime();
        animFrame();
    };

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }
    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.001 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {dt = 0;};
        move();
    }
    function move() {
        moveObject(ball);
        calcForce();
        updateAccel();
        updateVelo(ball);
    }

    function moveObject(obj) {
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
        $ball.css('transform', 'translate3d(' + obj.x + 'px, ' + obj.y + 'px, 0)');
    }
    function calcForce() {
        displ = ball.pos2D.subtract(center);
        var restoring = Forces.spring(kSpring, displ);
        var damping = Forces.damping(cDamping, ball.velo2D);
        force = Forces.add([restoring, damping]);
    }
    function updateAccel() {
        acc = force.multiply(1 / m);
    }
    function updateVelo(obj) {
        obj.velo2D = obj.velo2D.addScaled(acc, dt);
    }

}());

