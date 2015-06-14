;(function () {
    $.Body = $('body');
    $.Window = $(window);
    $.Document = $(document);

    $.isTouch = 'ontouchstart' in document.documentElement;

    if ($.isTouch) {
        document.addEventListener(
            'touchmove',
            function (e) {
                e.preventDefault();
            },
            false
        );
    }
}());
