;(function () {
    var $obj = $('.Ball');
    var $floor = $('.Floor');

    var obj;
    var floor;
    var mass = 20;
    var g = 10;
    var keLoss = 0.7;
    var k = 0.5;
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

        // Рисуем объект
        obj = new Obj({
            $el: $obj,
            mass: mass,
            radius: 50
        });

        obj.pos = new Vector(200, 50);
        obj.changeStyles();

        // Рисуем пол
        var b1 = new Vector(100, 300);
        var b2 = new Vector(600, 400);
        floor = new Floor({$el: $floor, b1: b1, b2: b2});

        floor.draw();
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
        var fdispl = floor.displ; // Величина вектора пола
        var fdisplLen = fdispl.length();

        var objb1 = floor.b1.subtract(obj.pos); // Величина вектора b1
        var objb2 = floor.b2.subtract(obj.pos); // Величина вектора b2

        var projb1 = objb1.projection(fdispl); // Проекция вектора b1 на вектор пола
        var projb2 = objb2.projection(fdispl); // Проекция вектора b2 на вектор пола

        // Нужно найти векторную величину проекции
        // Сначала получаем единичный вектор пола
        // Затем умножаем на величину проекции.
        // В целом мы можем использовать только одну величину b1,
        // чтобы найти дистанцию. Операция верна, в доказательство
        // можно рассмотреть подобие треугольников
        var fdisplVec = fdispl.transfer(projb1);

        var dist = objb1.subtract(fdisplVec); // Для нахождения величины, нужно один вектор вычесть из другого.
        var distLen = dist.length();

        // Еще один тест, который говорит нам, что пол ограничен.
        // Т.е. если хоть какая-нибудь проекция больше длины пола,
        // то мяч выходит за его рамки. Если условие убрать,
        // то вектор пола продолжится в бесконечность по обе стороны
        // с заданным направлением.
        var test = ((Math.abs(projb1) < fdisplLen) && (Math.abs(projb2) < fdisplLen));
        // console.log(dist)

        if ((distLen < obj.radius) && test) {

            // Первое, нужно переместить объект на позицию с полом.
            var angle = Vector.angleBetween(obj.velo, fdispl); // Вычисляем угол между векторами, угол в радианах

            // Следующее что нам нужно сделать это репозиционирование объекта
            // Сначала определим location, где находится смещенный центр, если до пола,
            // то величина n = -1, инача 1.
            var loc = dist.dotProduct(obj.velo);
            var n = (loc > 0) ? -1 : 1;

            // Теперь находим расстояние deltaS
            var deltaS = (obj.radius + distLen * n) / Math.sin(angle);

            // Находим дистанцию на которую нужно вернуть объект в соответствии
            // с вектором скорости, который задает нам направление. ;)
            var deltaSVec = obj.velo.unit();
            deltaSVec.scaleBy(deltaS);

            obj.pos = obj.pos.subtract(deltaSVec);
            obj.changeStyles();

            // Находим коэффициент для коррекции скорости и корректируем нашу скорость в соответствии с ним.
            var vcor = 1 - acc.dotProduct(deltaSVec) / obj.velo.lengthSquared();
            var Velo = obj.velo.multiply(vcor);

            // Коррекция скорости после удара.
            var veloProjToDist = Velo.projection(dist);

            var normalVelo = dist.transfer(veloProjToDist);
            var tangentVelo = Velo.subtract(normalVelo);
            // // velocity vector component perpendicular to wall just after impact
            obj.velo = tangentVelo.addScaled(normalVelo, -1);
            obj.changeStyles();
            // stopAnimate();

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

