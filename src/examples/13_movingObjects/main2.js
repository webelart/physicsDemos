;(function () {
    var alignmentEls = {
        template_first: require('./tpls/image_first.hbs'),
        template: require('./tpls/image.hbs'),

        init: function ($el, ops) {
            var base = this;

            base.$el = $el;
            base.ops = ops;

            base.$container = $(ops.$container);

            base.wait = 50;

            base.filler = base.createFiller();
            base.average_images = base.arithmeticalMean();
            base.images_settings = ops.image_settings;

            base.events();
        },

        events: function () {
            var base = this;
            throttleSetSizes = _.throttle(base.setSizes.bind(base, false), base.wait);

            base.generatePixels(true);
            // base.circleUp(true);

            // При ресайзе идет полная перестройка
            $.Window.resize(throttleSetSizes);
            // base.$el.on('start', function () {
            //
            // });
        },

        arithmeticalMean: function () {
            var base = this,
                average = {
                    w: 0,
                    h: 0
                },
                len = base.filler.length;

            for (var i = 0; i < len; i++) {
                average.w += base.filler[i].w;
                average.h += base.filler[i].h;
            }

            average.w /= len;
            average.h /= len;

            average.w = Math.round(average.w);
            average.h = Math.round(average.h);
            
            return average;
        },

        // Создаем набор общий упорядоченный набор доступных картинок
        createFiller: function () {
            var base    = this,
                filler  = [],
                $images = base.$el.find('img'),
                len     = $images.length,
                $image  = undefined;

            for (var i = 0; i < len; i++) {
                $image = $images.eq(i);

                filler[i] = {
                    id:  $image.data('id'),
                    src: $image.attr('src'),
                    w:   $image.data('width'),
                    h:   $image.data('height')
                };
            }

            return filler;
        },

        generatePixels: function (is_first) {
            var base = this;

            base.setSizes();
            base.dispersionObjects(is_first);
            base.animateImages();
        },

        setSizes: function () {
            var base = this;

            base.removeMove();
            if (base.timer_start) clearTimeout(base.timer_start);

            base.win_w = $.Window.width();
            base.win_h = $.Window.height();

            base.win_w = (base.win_w < base.ops.min_w) ? base.ops.min_w : base.win_w;
            base.win_h = (base.win_h < base.ops.min_h) ? base.ops.min_h : base.win_h;

            base.major_axis = (base.win_w >= base.win_h) ? base.win_w : base.win_h;

            base.$container.width(base.win_w).height(base.win_h);

            base.img_sets = base.getImagesSettings();

            var average_w = Math.round(base.average_images.w * base.img_sets.ps),
                average_h = Math.round(base.average_images.h * base.img_sets.ps),
                value     = 0.54,
                old_shift_w = base.shift_w,

                z = 0, k = 0, new_w, new_h,

                ops = {};

            base.shift_w = Math.round(base.win_w / (average_w * value) + 1);
            base.shift_h = Math.round(base.win_h / (average_h * value) + 1);

            var common_html = '';
            var shuffle_filler = _.shuffle(base.filler);

            base.inf_images = [];

            if (base.shift_w * base.shift_h > base.filler.length) {

                var is_w = true,
                    new_shift_w = base.shift_w, new_shift_h = base.shift_h;

                for (var i = 0; i < base.shift_w; i++) {

                    if (is_w && new_shift_w > 5) {
                        new_shift_w -= 1;   
                        is_w = false;
                    } else if (!is_w && new_shift_h > 5) {
                        new_shift_h -= 1;
                    }
                    
                    if (new_shift_w * new_shift_h <= base.filler.length) {
                        base.shift_w = new_shift_w;
                        base.shift_h = new_shift_h;

                        average_w = base.win_w / ((base.shift_w - 1) * value);
                        average_h = base.win_h / ((base.shift_h - 1) * value);
                        break;
                    }
                    
                } 
                base.getNewValues(base.shift_w, base.shift_h, true);
            }
            
            for (var i = 0; i < base.shift_w; i++) {

                for (var j = 0; j < base.shift_h; j++) {

                    new_w = Math.round(shuffle_filler[z].w * base.img_sets.ps),
                    new_h = Math.round((new_w * shuffle_filler[z].h) / shuffle_filler[z].w);

                    ops = {
                        id:     shuffle_filler[z].id,
                        src:    shuffle_filler[z].src,
                        w:      new_w,
                        h:      new_h,
                        half_w: new_w / 2,
                        half_h: new_h / 2,
                        x:      i * average_w * value, 
                        y:      j * average_h * value,
                        zIndex: base.getRandomInt(1, 10),
                    };

                    base.inf_images[k] = ops;
                    base.inf_images[k].is_3d = Modernizr.csstransforms3d;
                    base.inf_images[k].is_trans = Modernizr.csstransforms;
                    base.inf_images[k].prefix = window.prefix.transform;

                    common_html += base.template(base.inf_images[k]);

                    k += 1;
                    z += 1;
                    if (z >= shuffle_filler.length - 1) {
                        z = 0;
                        shuffle_filler = _.shuffle(base.filler);
                    }
                }
            }

            base.$container.empty();
            base.$container.append(common_html);
            base.$images_inners = base.$container.find('.image');

            if (old_shift_w !== undefined) {
                base.timer_start = setTimeout(function () {
                    base.startMove();
                }, 30);
            }

        },

        getNewValues: function (shift_w, shift_h, is_width) {
            var new_shift_w = shift_w - 1;
        },

        createOpsForImages: function (i, new_w, new_h, shuffle_filler, z, x, y) {
            if (new_w) {
                base.inf_images.insert(i, {
                    id:       shuffle_filler[z].id,
                    src:      shuffle_filler[z].src,
                    w:        new_w,
                    h:        new_h,
                    half_w:   new_w / 2,
                    half_h:   new_h / 2,
                    x:        x,
                    y:        y,
                    zIndex:   base.getRandomInt(1, 10),
                    is_3d:    Modernizr.csstransforms3d,
                    is_trans: Modernizr.csstransforms,
                    prefix:   window.prefix.transform
                })
            }
        },

        dispersionObjects: function (is_first) {
            var base = this,
                len  = base.inf_images.length,

                half_w = base.win_w / 2,
                half_h = base.win_h / 2;

            var cur_x = 0,
                cur_y = 0,

                new_coords = undefined,

                value = 1.5,

                generate = 0;

            base.$images_inners.each(function () {
                var $this = $(this);

                cur_x = parseInt($this.data('x'), 10),
                cur_y = parseInt($this.data('y'), 10);

                // Первый квадрант.
                if (cur_x < half_w && cur_y < half_h) {

                    new_coords = base.generateNewCoords( 
                            base.getRandomInt(0, half_w), 
                            base.getRandomInt(0, half_h) - half_h * value, 
                            base.getRandomInt(0, half_w) - half_w * value,
                            base.getRandomInt(0, half_h));

                    base.changeCss($this, new_coords.x, new_coords.y);

                // Второй квадрант.             
                } else if (cur_x < half_w && cur_y >= half_h) {

                    new_coords = base.generateNewCoords( 
                            base.getRandomInt(0, half_w), 
                            base.getRandomInt(half_h, base.win_h) + half_h * value, 
                            base.getRandomInt(0, half_w) - half_w * value,
                            base.getRandomInt(half_h, base.win_h));

                    base.changeCss($this, new_coords.x, new_coords.y);
                    
                // Третий квадрант. 
                } else if (cur_x >= half_w && cur_y < half_h) {

                    new_coords = base.generateNewCoords( 
                            base.getRandomInt(half_w, base.win_w), 
                            base.getRandomInt(0, half_h) - half_h * value, 
                            base.getRandomInt(half_w, base.win_w) + half_w * value,
                            base.getRandomInt(0, half_h));

                    base.changeCss($this, new_coords.x, new_coords.y);

                // Четвертый квадрант.
                } else if (cur_x >= half_w && cur_y >= half_h) {
                    new_coords = base.generateNewCoords( 
                            base.getRandomInt(half_w, base.win_w), 
                            base.getRandomInt(half_h, base.win_h) + half_h * value, 
                            base.getRandomInt(half_w, base.win_w) + half_w * value,
                            base.getRandomInt(half_h, base.win_h));

                    base.changeCss($this, new_coords.x, new_coords.y);
                }
            });
        },

        generateNewCoords: function (val1, val2, val3, val4, val_common) {
            var base = this,
                half_w   = base.win_w / 2,
                half_h   = base.win_h / 2,

                generate = base.getRandomInt(1, 3);

            if (generate === 1) {
                new_x = val1;
                new_y = val2;
            } else if (generate === 2) {
                new_x = val3;
                new_y = val4;
            } else {
                new_x = val3;
                new_y = val2;
            }

            return {
                x: new_x,
                y: new_y
            };
        },

        animateImages: function () {
            var base = this;

            base.$container.addClass(base.ops.animate_class);

            setTimeout(function () {
                imagesLoaded(base.$container, function () {
                    base.removeLoader();
                });
            }, 30);
        },

        returnCoords: function () {
            var base = this,

                cur_x = 0,
                cur_y = 0;

            base.$images_inners.each(function () {
                var $this = $(this);

                cur_x = parseInt($this.data('x'), 10),
                cur_y = parseInt($this.data('y'), 10);

                base.changeCss($this, cur_x, cur_y);
            });
        },

        changeCss: function ($el, x, y) {
            if (Modernizr.csstransforms3d) $el.css(Modernizr.prefixed('transform'), 'translate3d(' + x + 'px,'  + y + 'px, 0)');
            else if (Modernizr.csstransforms) $el.css(Modernizr.prefixed('transform'), 'translateX(' + x + 'px) translateY('  + y + 'px)');
            else $el.css({
                top: x,
                left: y
            });
        },

        removeLoader: function () {
            var base = this,
                $preloading = $('.l-preloading');

            setTimeout(function () {
                $preloading.fadeOut(300, function () {
                    $preloading.remove();
                    base.$el.trigger('start');
                    base.returnCoords();
                });
            }, 1000);

            setTimeout(function () {
                base.$container.removeClass(base.ops.animate_class);
                base.startMove();
            }, 2300);
        },

        startMove: function () {
            var base = this;

            base.inner_zoom = 1;
            base.pixels = [];

            var len = base.inf_images.length;

            base.$images_inners.each(function (i) {
                var $this = $(this);
                base.pixels.push(new base.Pixel($this, $this.data('x'), $this.data('y')));
            });

            $.Body
                .on("mousemove", base.mouseMove.bind(base))
                .on("mouseleave", base.mouseEnd.bind(base))
                .on('touchstart', base.touchStart.bind(base))
                .on('touchmove', base.touchMove.bind(base))
                .on('touchend', base.touchEnd.bind(base));

            base.start();
        },

        removeMove: function () {
            var base = this;

            $.Body
                .unbind("mousemove")
                .unbind("mouseleave")
                .unbind('touchstart')
                .unbind('touchmove')
                .unbind('touchend');

            base.stop();
        },

        setMxMy: function (evt) {
            this.mx = evt.pageX;
            this.my = evt.pageY;
            this.allInHome = false;
        },

        mouseMove: function (evt) {
            this.setMxMy(evt);
        },

        start: function () {
            if (this.timer) return;
            this.timer = setInterval(_.bind(this.onTimer, this), 30);
        },

        stop: function () {
            clearInterval(this.timer);
            this.timer = undefined;
        },

        onTimer: function () {
            if (!this.pixels || this.pixels.length == 0) return;
            if (!this.allInHome) {
                this.movePixels();
            }
        },

        touchStart: function (evt) {
            if (evt.originalEvent.touches.length > 1) return;
            // evt.preventDefault(); evt.stopPropagation();
            evt = evt.originalEvent.touches[0];
            this.setMxMy(evt);
        },

        touchMove: function (evt) {
            evt.preventDefault();
            evt = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
            this.setMxMy(evt);
        },

        mouseEnd: function (evt) {
            evt.preventDefault();
            this.mx = -1;
            this.my = -1;
            this.allInHome = false;
        },

        touchEnd: function (evt) {
            if (evt.originalEvent.touches.length != 0) return;
            evt.preventDefault();
            this.mx = -1;
            this.my = -1;
            this.allInHome = false;
        },

        Pixel: function ($el, homeX, homeY) {
            this.$el = $el;
            this.homeX = parseInt(homeX);
            this.homeY = parseInt(homeY);

            this.x = homeX;
            this.y = homeY;
            this.xVelocity = 1;
            this.yVelocity = 1;
        },

        movePixels: function () {
            var base = this;

            if (!this.pixels || this.pixels.length == 0) return;
            
            var pixels = this.pixels,
                cursorForceZoomed = base.img_sets.radius * this.inner_zoom * this.inner_zoom, 
                i, p, dx, dy, cx, cy,
                homeSin, homeCos, homeForce, homeDistance, homeDistanceReverse,
                cursorSin, cursorCos, cursorForce, cursorDistance, cursorDistanceReverse, cursorDistanceSquared

            console.log(base.img_sets.radius)
            var inHome = 0;
            for (i = pixels.length; i--;) {
                
                p = pixels[i];
                dx = p.homeX - p.x;
                dy = p.homeY - p.y;

                homeDistance = Math.sqrt(dx * dx + dy * dy);
                if (homeDistance < 0.00001) homeDistance = 0.00001;
                homeDistanceReverse = 1 / homeDistance;
                homeSin = dy * homeDistanceReverse;
                homeCos = dx * homeDistanceReverse;

                homeForce = homeDistance * 0.01;
                cursorForce = 0;
                cursorSin = 0;
                cursorCos = 0;

                if (this.mx >= 0) {
                    cx = p.x - this.mx;
                    cy = p.y - this.my;
                    cursorDistanceSquared = cx * cx + cy * cy;
                    if (cursorDistanceSquared > 1 && cursorDistanceSquared <= cursorForceZoomed) {
                        cursorForce = cursorForceZoomed / cursorDistanceSquared;
                        if (cursorForce > 15) cursorForce = 15;
                        cursorDistance = Math.sqrt(cursorDistanceSquared);
                        cursorDistanceReverse = 1 / cursorDistance;
                        cursorSin = cy * cursorDistanceReverse + (i % 10) * 0.01; //some random
                        cursorCos = cx * cursorDistanceReverse + (i % 10) * 0.01;
                    }
                }

                p.xVelocity += homeForce * homeCos + cursorForce * cursorCos;
                p.yVelocity += homeForce * homeSin + cursorForce * cursorSin;
                p.xVelocity *= 0.85;
                p.yVelocity *= 0.85;
                p.x += p.xVelocity;
                p.y += p.yVelocity;
                if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(p.xVelocity) < 0.5 && Math.abs(p.yVelocity) < 0.5) {
                    p.xVelocity = 0;
                    p.yVelocity = 0;
                    p.x = p.homeX + 0.1;
                    p.y = p.homeY + 0.1;
                    inHome++;
                }

                p.x = (p.x > base.win_w + 50) ? base.win_w + 50 : p.x;
                p.y = (p.y > base.win_y + 50) ? base.win_y + 50 : p.y;

                p.x = (p.x < -50) ? -50 : p.x;
                p.y = (p.y < -50) ? -50 : p.y;

                base.changeCss(p.$el, p.x, p.y);
            }
            this.allInHome = inHome == pixels.length;
        },

        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        getImagesSettings: function () {
            var base = this,
                len  = base.images_settings.length,
                settings = base.images_settings[0];

            for (var i = 0; i < len; i++) {

                if (base.major_axis < base.images_settings[0].w_major_axis) {
                    return base.images_settings[i];
                }
                
                if (i < len - 1) {
                    if (base.images_settings[i].w_major_axis <= base.major_axis && base.images_settings[i + 1].w_major_axis > base.major_axis) {
                        return base.images_settings[i];
                    }
                } else {
                    return base.images_settings[i];
                } 
            }

            return settings;
        }

    };

    $.fn.aligmentEls = function (options) {
        var options = $.extend({}, $.fn.aligmentEls.options, options),
            $el = this.first();

        if ($el.data('init-al-els')) return $el;
        $el.data('init-al-els', true);

        var aligment_els = Object.create(alignmentEls);

        aligment_els.init($el, options);

        return $el;
    };

    $.fn.aligmentEls.options = {
        $container: '#container_images',
        animate_class: 'b-curcleup-images-animate',
        addedArea: 100,
        min_h:     ($.MobileDevice) ? 100 : 400,
        min_w:     ($.MobileDevice) ? 300 : 1000,
        image_settings: [
            {
                w_major_axis: 600,
                radius: 50000,
                ps: 0.25
            },
            {
                w_major_axis: 900,
                radius: 320000,
                ps: 0.5
            },
            {
                w_major_axis: 1024,
                radius: 320000,
                ps: 0.6
            },
            {
                w_major_axis: 1280,
                radius: 340000,
                ps: 0.6
            },
            {
                w_major_axis: 1440,
                radius: 420000,
                ps: 0.75
            },
            {
                w_major_axis: 1680,
                radius: 500000,
                ps: 0.8
            }
        ]
    };
}());
