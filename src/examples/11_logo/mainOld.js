;(function() {
    var $body = $('body');

    var $container = $('.Logos');
    var $logos = $('.Logos-item');
    var $covers = $logos.find('.Logos-cover');

    var count = $covers.length;
    var centres = [];
    var firstPosition;
    var changingCenter;
    var checkMoving = false;
    var cDamping = 0.7;
    var velo = new Vector2D(10, 10);
    var kSpring = 1;
    var $choosenCover;
    var $choosenParent;

    window.onload = init;

    function init() {
        events();
        $covers.on('mousedown', mouseDown);
        $body.on('mousemove', mouseMove);
        $body.on('mouseup', mouseUp);
    };

    function events() {
        getCenters();
        $(window).resize(function() {
            getCenters();
        });
    }

    // Находим центры
    function getCenters() {
        for (var i = 0; i < count; i++) {
            var $cover = $covers.eq(i);
            var offsets = $covers.eq(i).offset();
            var coverWH = $cover.width() / 2;
            var coverHH = $cover.height() / 2;

            centres.push({ x: offsets.left + coverWH, y: offsets.top + coverHH});
        }
    }

    function mouseDown(evt) {
        var $this = $(this);
        var index = $covers.index($this);
        var thisCenter = centres[index];

        firstPosition = new Vector2D(evt.pageX, evt.pageY);
        $choosenCover = $this;
        $choosenParent = $this.parents('.Logos-item');
        $choosenParent.css('z-index', 9);

        checkMoving = true;

    }

    function mouseMove(evt) {
        if (!checkMoving) {
            return false;
        }
        var movingVec = new Vector2D(evt.pageX, evt.pageY);
        center = centerClick.subtract(movingVec);
        calcForce();
    }

    function mouseUp(evt) {
        checkMoving = false;
        $choosenParent.css('z-index', 1);
    }

    function calcForce() {
        displ = center;
        var restoring = Forces.spring(kSpring, displ);
        var damping = Forces.damping(cDamping, restoring);

        $choosenCover.css('transform', 'translate3d(' + -damping.x + 'px, ' + -damping.y + 'px, 0)');
    }

}());











