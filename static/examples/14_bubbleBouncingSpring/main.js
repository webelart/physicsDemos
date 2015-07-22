;(function () {
    var $container = $('.Squares');
    var $objs;

    var sizeEl = 50;
    var objs = [];
    var animId;
    var allInHome;
    var cursorForceZoomed = 50000;
    var damping = 0.85;
    var inHome = 0;
    var m = 1;
    var kSpring = 1;
    var acc;
    var dt;

    var keLoss = 1;

    var walls = [];
    var lenObjs = 50;
    var maxRadius = 40;
    var minRadius = 10;

    var displObj;
    var displCursor;
    var homeSin;
    var homeCos;
    var homeForce;
    var homeDistance;
    var homeDistanceReverse;
    var cursorForce;
    var cursorDistance;

    var cursorPos = new Vector(-1, -1);

    var winW = $(window).width();
    var winH = $(window).height();
    var t0 = 0;

    window.onload = events();

    function events() {
        createWalls();
        createEls();
        startMove();
    }

    function clearAndCreateEls() {
        $container.empty();
        $.Body.off('mousemove');
        $.Body.off('mouseleave');
        stopAnimate();
    }

    function startMove() {

        $.Body
            .on('mousemove', mouseMove)
            .on('mouseleave', mouseEnd);

        animFrame();
    }

    function createEls() {
        objs = [];

        var hEl = sizeEl;
        var wEl = sizeEl;
        var lenW = winW / wEl + 1;
        var lenH = winH / hEl + 1;
        var num = 0;

        for (var i = 0; i < lenObjs; i++) {
            $obj = $('<div class="Squares-item"></div>');
            radius = getRandomInt(minRadius, maxRadius);

            // Рисуем объект
            obj = new Obj({
                $el: $obj,
                mass: m,
                radius: radius
            });

            obj.pos = new Vector(Math.random() * (winW - 2 * obj.radius) + obj.radius,
                                 Math.random() * (winH - 2 * obj.radius) + obj.radius);

            obj.home = obj.pos;
            obj.velo = new Vector(0, 0);
            obj.force = new Vector(0, 0);
            obj.acc = new Vector(0, 0);

            $container.append($obj);
            $obj
                .width(obj.diameter)
                .height(obj.diameter);

            $obj.css({
                top: -obj.radius,
                left: -obj.radius
            });

            obj.changeStyles();
            objs.push(obj);
        }

        $objs = $container.find('.Squires-item');
    }

    function createWalls() {
        var wall1 = new Floor({b1: new Vector(0, 0), b2: new Vector(winW, 0)});
        walls.push(wall1);

        var wall2 = new Floor({b1: new Vector(winW, 0), b2: new Vector(winW, winH)});
        walls.push(wall2);

        var wall3 = new Floor({b1: new Vector(0, winH), b2: new Vector(winW, winH)});
        walls.push(wall3);

        var wall4 = new Floor({b1: new Vector(0, 0), b2: new Vector(0, winH)});
        walls.push(wall4);
    }

    function mouseMove(evt) {
        cursorPos = new Vector(evt.pageX, evt.pageY);
        allInHome = false;
    }

    function mouseEnd() {
        cursorPos = new Vector(-1, -1);
        allInHome = false;
    }

    function animFrame() {
        animId = requestAnimationFrame(animFrame);
        onTimer();
    }

    function stopAnimate() {
        setTimeout(func, 1000 / fps);
        cancelAnimationFrame(animId);
    }

    function start() {
        if (timer) {
            return;
        }

        animFrame();
    }

    function move() {
        inHome = 0;

        for (var i = objs.length; i--;) {
            var obj = objs[i];

            calcForce(obj);
            updateAccel(obj);
            updateVelo(obj);
            moveObjs(obj);
            checkObj(obj);
        }

        // checkCollision();

        allInHome = inHome == objs.length;
    }

    function checkCollision(obj) {
        for (var i = 0; i < objs.length; i++){
            var obj1 = objs[i];
            for (var j = i + 1; j < objs.length; j++){
                var obj2 = objs[j];
                var dist = obj1.pos.subtract(obj2.pos);

                if (dist.length() < (obj1.radius + obj2.radius)) {
                    // normal velocity vectors just before the impact
                    var normalVelo1 = obj1.velo.project(dist);
                    var normalVelo2 = obj2.velo.project(dist);

                    // tangential velocity vectors
                    var tangentVelo1 = obj1.velo.subtract(normalVelo1);
                    var tangentVelo2 = obj2.velo.subtract(normalVelo2);

                    // move particles so that they just touch
                    var L = obj1.radius + obj2.radius - dist.length();
                    var vrel = normalVelo1.subtract(normalVelo2).length();
                    obj1.pos = obj1.pos.addScaled(normalVelo1, -L / vrel);
                    obj2.pos = obj2.pos.addScaled(normalVelo2, -L / vrel);

                    // normal velocity components after the impact
                    var m1 = obj1.mass;
                    var m2 = obj2.mass;
                    var u1 = normalVelo1.projection(dist);
                    var u2 = normalVelo2.projection(dist);
                    var v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
                    var v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);

                    // normal velocity vectors after collision
                    normalVelo1 = dist.para(v1);
                    normalVelo2 = dist.para(v2);

                    // final velocity vectors after collision
                    obj1.velo = normalVelo1.add(tangentVelo1);
                    obj2.velo = normalVelo2.add(tangentVelo2);

                }
            }
            // checkWallBounce(obj1);
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function checkWallBounce(obj) {
        var hasHitAWall = false;

        for (var i = 0; (i < walls.length && hasHitAWall == false); i++){
            var floor = walls[i];
            var fdispl = floor.displ;
            var fdisplLen = fdispl.length();

            var objb1 = floor.b1.subtract(obj.pos);
            var objb2 = floor.b2.subtract(obj.pos);

            var projb1 = objb1.projection(fdispl);
            var projb2 = objb2.projection(fdispl);
            var fdisplVec = fdispl.transfer(projb1);

            var dist = objb1.subtract(fdisplVec);
            var distLen = dist.length();

            var test = ((Math.abs(projb1) < fdisplLen) && (Math.abs(projb2) < fdisplLen));

            if ((distLen < obj.radius) && test) {
                var angle = Vector.angleBetween(obj.velo, fdispl);
                var loc = dist.dotProduct(obj.velo);
                var n = (loc > 0) ? -1 : 1;

                var deltaS = (obj.radius + distLen * n) / Math.sin(angle);

                var deltaSVec = obj.velo.unit();
                deltaSVec.scaleBy(deltaS);

                obj.pos = obj.pos.subtract(deltaSVec);

                var vcor = 1 - dist.dotProduct(deltaSVec) / obj.velo.lengthSquared();
                var Velo = obj.velo.multiply(vcor);

                var veloProjToDist = Velo.projection(dist);

                var normalVelo = dist.transfer(veloProjToDist);
                var tangentVelo = Velo.subtract(normalVelo);
                obj.velo = tangentVelo.addScaled(normalVelo, -keLoss);
            }
        }
    }

    function onTimer() {
        if (!objs || objs.length == 0) {
            return;
            stopAnimate();
        }
        if (!allInHome) {
            dt = 0.18; /* По сути время представляет собой константу,
                      которая при стабильной работе компьютера, без задержек равна примерно 17 = 1000/60 (60 кадров в секунду).
                      Т.е. величина как мы видим постоянная. В примерах взято число, т.к. если вдруг компьютер не стабилен, то при
                      четком расчете времени анимация прыгает, а если число, то она просто задерживается (тоже не хорошо, но выглядет менее заметно). В примере 01_movingBall
                      показан в комментариях также код рассчета времени */
            move();
        }
    }

    function moveObjs(obj) {
        obj.pos = obj.pos.addScaled(obj.velo, dt);

        // Обновление стилей
        obj.changeStyles();
    }

    function calcForce(obj) {
        displObj = obj.pos.subtract(obj.home);

        cursorForce = new Vector(0, 0);

        if (cursorPos.x >= 0) {
            displCursor = obj.pos.subtract(cursorPos);
            cursorDistance = displCursor.length();
            if (cursorDistance > 1 && cursorDistance <= cursorForceZoomed) {
                cursorForce = displCursor.multiply(cursorForceZoomed / (cursorDistance * cursorDistance));
            }
        }

        // Обновление скорости
        var restoring = displObj.multiply(-kSpring);
        var damping = obj.velo.multiply(-0.9);
        obj.force = Vector.add([restoring, cursorForce, damping]);
    }

    function updateAccel(obj) {
        obj.acc = obj.force.multiply(1 / m);
    }

    function updateVelo(obj) {
        obj.velo = obj.velo.addScaled(obj.acc, dt);
        // obj.velo = obj.velo.multiply(damping);
    }

    function checkObj(obj) {
        if (Math.abs(obj.x) < 0.5 &&
            Math.abs(obj.y) < 0.5 &&
            Math.abs(obj.vx) < 0.5 &&
            Math.abs(obj.vy) < 0.5) {

            obj.velo = new Vector(0, 0);
            obj.pos = new Vector(obj.hx, obj.hy);
            inHome++;
        }
    }
}());
