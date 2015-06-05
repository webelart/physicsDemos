;(function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var size = {
        w: canvas.clientWidth,
        h: canvas.clientHeight,
        r: 20,
        shift: 10
    };
    var ball = new Ball(size.r, '#666666', true);
    ball.x = size.w / 2 - size.r + size.shift;
    ball.y = 2 * size.r;
    ball.draw(ctx);

    var vx = 0;
    var vy = 0;
    var g = 0.1;

    var animFunc = undefined;
    startAnimate();
    function startAnimate() {
        animFunc = requestAnimationFrame(startAnimate);
        onEachStep();
    }

    function stopAnimate() {
        cancelAnimationFrame(animFunc);
    }

    var pointStop = size.h - 2 * size.r;
    function onEachStep() {
        vy += g;
        ball.x += vx;
        ball.y += vy;

        // Если касается земли
        if (ball.y > pointStop) {
            vy *= -0.8;
            if (Math.round(vy) === 0) {
                stopAnimate();
            }
        }

        ball.clear(ctx, size.w, size.h);
        ball.draw(ctx);
    }
}());

