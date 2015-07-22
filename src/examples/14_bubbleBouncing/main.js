;(function () {
    var $container = $('.Container');
    var $objs;
    var hoverClass = 'Bubble--hovered';

    var objs = [];
    var lenObjs = 200;
    var maxRadius = 50;
    var minRadius = 5;
    var mass = 1;
    var keLoss = 1;

    var mass = 20;
    var g = 10;
    var k = 0.1;

    var walls = [];

    var winW = $.Window.width();
    var winH = $.Window.height();
    var t0 = 0;
    var dt;

    window.onload = init();

    function init() {
        createBubbles();

        events();

        t0 = new Date().getTime();
        startAnim();
    }

    function events() {
        $objs = $('.Bubble');
        var i = 1;
        var timer;

        $objs.hover(function () {
            var $obj = $(this);

            i += 1;

            timer = setTimeout(function () {
                $obj.addClass(hoverClass);
                $obj.css({
                    zIndex: i
                });
            }, 100);

        }, function () {
            clearTimeout(timer);
            $(this).removeClass(hoverClass);
        });
    }

    function createBubbles() {
        var $obj;
        var obj;
        var radius;
        var imgUrl;

        for (var i = 0; i < lenObjs; i++) {
            createBubble();
        }
    }

    function createBubble() {
        $obj = $('<div class="Bubble"></div>');
        radius = getRandomInt(minRadius, maxRadius);

        // Рисуем объект
        obj = new Obj({
            $el: $obj,
            mass: mass,
            radius: radius
        });

        obj.pos = new Vector(Math.random() * (winW - 2 * obj.radius) + obj.radius,
                             winH + Math.random() * (winH - 2 * obj.radius) + obj.radius);

        obj.velo = new Vector(((Math.random() - 0.5) * 100),
                              ((Math.random() - 0.5) * 100));

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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function startAnim() {
        animId = requestAnimationFrame(startAnim);
        onTimer();
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
        for (var i = 0; i < lenObjs; i++){
            var obj = objs[i];
            moveObject(obj);
            calcForce(obj);
            updateAccel(obj);
            updateVelo(obj);
        }
        checkCollision();
    }

    function moveObject(obj) {
        obj.pos = obj.pos.addScaled(obj.velo, dt);
        obj.changeStyles();
    }

    function checkCollision() {
        for (var i = 0; i < objs.length; i++){
            var obj = objs[i];
            checkCollision(obj);
        }
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

            if (obj1.pos.y < -100) {
                objs.splice(i, 1);
                obj1.$el.remove();
                createBubble();
            }
        }
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

    function calcForce(obj) {
        force = new Vector(0, -(obj.mass * g - k * obj.vy));
    }

    function updateAccel(obj) {
        acc = force.multiply(1 / obj.mass);
    }

    function updateVelo(obj) {
        obj.velo = obj.velo.addScaled(acc, dt);
    }
}());
