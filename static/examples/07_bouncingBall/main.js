
;(function () {
    var $obj1 = $('.Ball1');
    var $obj2 = $('.Ball2');

    var obj1;
    var obj2;
    var floor1;
    var floor2;
    var mass = 20;
    var g = 10;
    var keLoss = 0.7;
    var k = 0.1;
    var t0;
    var dt;
    var force1;
    var acc1;
    var force2;
    var acc2;
    var animId;
    var winW = $.Window.width();
    var winH = $.Window.height();
    var isDragging = false;
    var floorH = 40;

    init();
    window.onload = initAnim;

    function init() {
        obj1 = new Obj({
            $el: $obj1,
            mass: mass,
            radius: 50
        });

        obj2 = new Obj({
            $el: $obj2,
            mass: mass,
            radius: 50
        });

        obj1.pos = new Vector(winW / 2 - obj1.radius + 100, obj1.radius);
        obj2.pos = new Vector(winW / 2 - obj2.radius - 100, obj2.radius);

        floor1 = new Vector(0, winH - floorH);
        floor2 = new Vector(0, winH - floorH);

        obj1.changeStyles();
        obj2.changeStyles();
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
        dt = 0.07; /* По сути время представляет собой константу,
                      которая при стабильной работе компьютера, без задержек равна примерно 17 = 1000/60 (60 кадров в секунду).
                      Т.е. величина как мы видим постоянная. В примерах взято число, т.к. если вдруг компьютер не стабилен, то при
                      четком расчете времени анимация прыгает, а если число, то она просто задерживается (тоже не хорошо, но выглядет менее заметно). В примере 01_movingBall
                      показан в комментариях также код рассчета времени */
        move();
    }

    function move() {
        moveObject();
        calcForce();
        updateAccel();
        updateVelo();
        checkBounce();
    }

    function moveObject() {
        obj1.pos = obj1.pos.addScaled(obj1.velo, dt);
        obj1.changeStyles();

        obj2.pos = obj2.pos.addScaled(obj2.velo, dt);
        obj2.changeStyles();
    }

    function checkBounce() {
        var displ1 = floor1.subtract(obj1.pos);
        if (displ1.y - obj1.radius <= 0) {
            var floorPos = floor1.y - obj1.radius;
            // Корректируем скорость
            // Находим величину смещения
            var deltaS = obj1.y - floorPos;
            // Находим дистанцию на которую нужно вернуть объект в соответствии
            // с вектором скорости, который задает нам направление. ;)
            var deltaSVec = obj1.velo.transfer(deltaS);

            var vcor = 1 - acc1.dotProduct(deltaSVec) / obj1.velo.lengthSquared();
            obj1.velo = obj1.velo.multiply(vcor);

            obj1.y = floorPos;
            obj1.vy *= -keLoss;

            if (obj1.velo.length() < 2) { // Проверка скорости, значение выбрано экспериментально
                stopAnimate();
            }
        }

        var displ2 = floor2.subtract(obj2.pos);
        if (displ2.y - obj2.radius <= 0) {
            obj2.vy *= -keLoss;
        }
    }

    function calcForce() {
        force1 = new Vector(0, obj1.mass * g - k * obj1.vy);
        force2 = new Vector(0, obj2.mass * g - k * obj2.vy);
    }

    function updateAccel() {
        acc1 = force1.multiply(1 / obj1.mass);
        acc2 = force2.multiply(1 / obj2.mass);
    }

    function updateVelo() {
        obj1.velo = obj1.velo.addScaled(acc1, dt);
        obj2.velo = obj2.velo.addScaled(acc2, dt);
    }
}());
