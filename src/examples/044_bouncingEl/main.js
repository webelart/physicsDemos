;(function() {
    var $ball = $('.ball');

    var ball;
    var wall;
    var m = 1;
    var g = 300;
    var vfac = 0.7;
    var t0;
    var dt;
    var force;
    var acc;
    var animId;
    var winW = $(window).width();
    var winH = $(window).height();

    window.onload = init;

    function init() {
        ball = new Ball(winH, '#666666', m, 0, true);
        ball.pos2D = new Vector2D(0, -winH);
        wall = new Wall(new Vector2D(0, winH), new Vector2D(winW, winH));

        initAnim();
    }

    function initAnim() {
        t0 = new Date().getTime();
        animFrame();
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function onTimer() {
        var t1 = new Date().getTime();
        dt = 0.0005 * (t1 - t0);
        t0 = t1;
        if (dt > 0.2) {dt = 0;};
        move();
    }

    function move() {
        moveObject(ball);
        checkBounce(ball);
        calcForce();
        updateAccel();
        updateVelo(ball);
    }

    function moveObject(obj) {
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, dt);
        $ball.css('transform', 'translateY(' + obj.y + 'px)')
    }

    function checkBounce(obj) {
        var wdir = wall.dir;

        var ballp1 = wall.p1.subtract(obj.pos2D);
        var ballp2 = wall.p2.subtract(obj.pos2D);

        var proj1 = ballp1.projection(wdir);
        var proj2 = ballp2.projection(wdir);

        var dist = ballp1.addScaled(wdir.unit(), proj1 * (-1));

        var test = ((Math.abs(proj1) < wdir.length()) && (Math.abs(proj2) < wdir.length()));
        if ((dist.length() < obj.radius) &&  test) {
            var normal = wall.normal;

            var deltaS = (obj.radius + dist.dotProduct(normal));

            var displ = obj.velo2D.para(deltaS);
            obj.pos2D = obj.pos2D.subtract(displ);

            var vcor = 1 - acc.dotProduct(displ) / obj.velo2D.lengthSquared();

            var Velo = obj.velo2D.multiply(vcor);

            var normalVelo = dist.para(Velo.projection(dist));

            var tangentVelo = Velo.subtract(normalVelo);

            obj.velo2D = tangentVelo.addScaled(normalVelo, -vfac);

        } else if (Math.abs(ballp1.length()) < obj.radius) {
            bounceOffEndpoint(obj, wall.p1);
        } else if (Math.abs(ballp2.length()) < obj.radius) {
            bounceOffEndpoint(obj, wall.p2);
        }
    }

    function bounceOffEndpoint(obj, pEndpoint) {
        var distp = obj.pos2D.subtract(pEndpoint);
        // move particle so that it just touches the endpoint
        var L = obj.radius - distp.length();
        var vrel = obj.velo2D.length();
        obj.pos2D = obj.pos2D.addScaled(obj.velo2D, -L / vrel);
        // normal velocity vector just before the impact
        var normalVelo = obj.velo2D.project(distp);
        // tangential velocity vector
        var tangentVelo = obj.velo2D.subtract(normalVelo);
        // normal velocity vector after collision
        normalVelo.scaleBy(-vfac);
        // final velocity vector after collision
        obj.velo2D = normalVelo.add(tangentVelo);
    }

    function calcForce() {
        force = Forces.constantGravity(m, g);
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

