;(function () {
    var $container = $('.Container');
    var $objs;
    var hoverClass = 'Bubble--hovered';

    var objs = [];
    var lenObjs = 14;
    var maxRadius = 200;
    var minRadius = 100;
    var mass = 1;
    var keLoss = 1;

    var walls = [];

    var winW = $.Window.width();
    var winH = $.Window.height();
    var t0 = 0;
    var dt;

    window.onload = init();

    function init() {
        createBubbles();
        createWalls();

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
            $obj = $('<div class="Bubble"></div>');
            radius = getRandomInt(minRadius, maxRadius);
            imgUrl = 'url(img/' + (i + 1) + '.png)';

            // Рисуем объект
            obj = new Obj({
                $el: $obj,
                mass: mass,
                radius: radius
            });

            obj.pos = new Vector(Math.random() * (winW - 2 * obj.radius) + obj.radius,
                                 Math.random() * (winH - 2 * obj.radius) + obj.radius);

            obj.velo = new Vector(((Math.random() - 0.5) * 100),
                                  ((Math.random() - 0.5) * 100));

            $container.append($obj);
            $obj
                .width(obj.diameter)
                .height(obj.diameter);

            $obj.css({
                top: -obj.radius,
                left: -obj.radius,
                backgroundImage: imgUrl
            });

            obj.changeStyles();
            objs.push(obj);
        }
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

        var wall5 = new Floor({b1: new Vector(500, 0), b2: new Vector(0, 500)});
        walls.push(wall5);
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
            checkWallBounce(obj);
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

    // function events() {
    //     startMove();
    // }

    // function clearAndCreateEls() {
    //     $container.empty();
    //     $.Body.off('mousemove');
    //     $.Body.off('mouseleave');
    //     stopAnimate();
    // }

    // function startMove() {
    //     createEls();

    //     $.Body
    //         .on('mousemove', mouseMove)
    //         .on('mouseleave', mouseEnd);

    //     animFrame();
    // }

    // function createEls() {
    //     objs = [];

    //     var hEl = sizeEl;
    //     var wEl = sizeEl;
    //     var lenW = winW / wEl + 1;
    //     var lenH = winH / hEl + 1;
    //     var num = 0;

    //     for (var i = 0; i < lenW; i++) {
    //         for (var j = 0; j < lenH; j++) {
    //             var $obj = $('<div class="Squares-item" style="width: ' + hEl + 'px; height: ' + wEl + 'px;"></div>');

    //             var x = wEl * i;
    //             var y = hEl * j;

    //             $container.append($obj);

    //             // Задаем объект и рисуем положение объекта
    //             var newObj = new Obj({$el: $obj});
    //             newObj.pos = new Vector(x, y);
    //             newObj.home = new Vector(x, y);
    //             newObj.velo = new Vector(0, 0);
    //             newObj.changeStyles();
    //             newObj.force = new Vector(0, 0);
    //             newObj.acc = new Vector(0, 0);

    //             objs.push(newObj);
    //         }
    //     }

    //     $objs = $container.find('.Squires-item');
    // }

    // function mouseMove(evt) {
    //     cursorPos = new Vector(evt.pageX, evt.pageY);
    //     allInHome = false;
    // }

    // function mouseEnd() {
    //     cursorPos = new Vector(-1, -1);
    //     allInHome = false;
    // }

    // function stopAnimate() {
    //     setTimeout(func, 1000 / fps);
    //     cancelAnimationFrame(animId);
    // }

    // function start() {
    //     if (timer) {
    //         return;
    //     }

    //     animFrame();
    // }

    // function move() {
    //     inHome = 0;

    //     for (var i = objs.length; i--;) {
    //         var obj = objs[i];

    //         calcForce(obj);
    //         updateAccel(obj);
    //         updateVelo(obj);
    //         moveObjs(obj);
    //         checkObj(obj);
    //     }

    //     allInHome = inHome == objs.length;
    // }

    // function onTimer() {
    //     if (!objs || objs.length == 0) {
    //         return;
    //         stopAnimate();
    //     }
    //     if (!allInHome) {
    //         dt = 0.18; /* По сути время представляет собой константу,
    //                   которая при стабильной работе компьютера, без задержек равна примерно 17 = 1000/60 (60 кадров в секунду).
    //                   Т.е. величина как мы видим постоянная. В примерах взято число, т.к. если вдруг компьютер не стабилен, то при
    //                   четком расчете времени анимация прыгает, а если число, то она просто задерживается (тоже не хорошо, но выглядет менее заметно). В примере 01_movingBall
    //                   показан в комментариях также код рассчета времени */
    //         move();
    //     }
    // }

    // function moveObjs(obj) {
    //     obj.pos = obj.pos.addScaled(obj.velo, dt);

    //     // Обновление стилей
    //     obj.changeStyles();
    // }

    // function calcForce(obj) {
    //     displObj = obj.pos.subtract(obj.home);

    //     cursorForce = new Vector(0, 0);

    //     if (cursorPos.x >= 0) {
    //         displCursor = obj.pos.subtract(cursorPos);
    //         cursorDistance = displCursor.length();
    //         if (cursorDistance > 1 && cursorDistance <= cursorForceZoomed) {
    //             cursorForce = displCursor.multiply(cursorForceZoomed / (cursorDistance * cursorDistance));
    //         }
    //     }

    //     // Обновление скорости
    //     var restoring = displObj.multiply(-kSpring);
    //     var damping = obj.velo.multiply(-0.9);
    //     obj.force = Vector.add([restoring, cursorForce, damping]);
    // }

    // function updateAccel(obj) {
    //     obj.acc = obj.force.multiply(1 / m);
    // }

    // function updateVelo(obj) {
    //     obj.velo = obj.velo.addScaled(obj.acc, dt);
    //     // obj.velo = obj.velo.multiply(damping);
    // }

    // function checkObj(obj) {
    //     if (Math.abs(obj.x) < 0.5 &&
    //         Math.abs(obj.y) < 0.5 &&
    //         Math.abs(obj.vx) < 0.5 &&
    //         Math.abs(obj.vy) < 0.5) {

    //         obj.velo = new Vector(0, 0);
    //         obj.pos = new Vector(obj.hx, obj.hy);
    //         inHome++;
    //     }
    // }
}());
