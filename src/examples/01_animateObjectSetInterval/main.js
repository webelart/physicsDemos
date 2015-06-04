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
    ball.x = size.r + size.shift;
    ball.y = size.h - size.r - size.shift;
    var vx = 2;

    ball.draw(ctx);

    var methods = {
        startAnimate: function() {
            this.timer = setInterval(this.onEachStep, 1000 / 60);
        },
        stopAnimate: function() {
            clearInterval(this.timer);
        },
        onEachStep: function() {
            ball.x += vx;
            if (ball.x > size.w + 2 * size.r) {
                ball.x = -2 * size.r;
            }

            ball.clear(ctx, size.w, size.h);
            ball.draw(ctx);
        }
    };

    methods.startAnimate();
}());