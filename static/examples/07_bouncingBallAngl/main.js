;(function () {
    var $obj = $('.Ball');

    var obj;
    var floor;
    var mass = 20;
    var g = 10;
    var keLoss = 0.7;
    var k = 0.1;
    var t0;
    var dt;
    var force;
    var acc;
    var animId;
    var winW = $.Window.width();
    var winH = $.Window.height();
    var isDragging = false;
    var floorH = 40;

    init();
    window.onload = initAnim;

    function init() {
        obj = new Obj({
            $el: $obj,
            mass: mass,
            radius: 100
        });

        obj.pos = new Vector(0, 0);
        obj.velo = new Vector(20, 0);
        floor = new Vector(0, winH - floorH);

        obj.changeStyles();
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
        obj.pos = obj.pos.addScaled(obj.velo, dt);
        obj.changeStyles();
    }

    function checkBounce() {
        var displ = floor.subtract(obj.pos);
        if (displ.y - obj.radius <= 0) {
            var needPos = floor.y - obj.radius;
            // Корректируем скорость
            // Находим величину смещения
            var deltaS = obj.y - needPos;
            // Находим дистанцию на которую нужно вернуть объект в соответствии
            // с вектором скорости, который задает нам направление. ;)
            var deltaSVec = obj.velo.unit();
            deltaSVec.scaleBy(deltaS);

            var vcor = 1 - acc.dotProduct(deltaSVec) / obj.velo.lengthSquared();
            obj.velo = obj.velo.multiply(vcor);

            obj.y = needPos;
            obj.vy *= -keLoss;
            obj.vx *= keLoss;
        }
    }

    function calcForce() {
        force = new Vector(0, obj.mass * g - k * obj.vy);
    }

    function updateAccel() {
        acc = force.multiply(1 / obj.mass);
    }

    function updateVelo() {
        obj.velo = obj.velo.addScaled(acc, dt);
    }
}());
