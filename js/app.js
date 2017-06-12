var processor = {
    fixViewport: function (type, width) {
        var docEl = document.documentElement;
        var metaEl = document.querySelector('meta[name="viewport"]');
        var clientWidth = Math.min(docEl.clientWidth, docEl.clientHeight);
        var scale, content;
        
        switch (type) {
            case 'fixed':
                scale = clientWidth / width;
                content = 'width=' + width + ',initial-scale=' + scale + ',maximum-scale=' + scale +
                    ',minimum-scale=' + scale;
                break;
            case 'rem':
                var dpr = window.devicePixelRatio || 1;
                docEl.setAttribute('data-dpr', dpr);
                docEl.style.fontSize = 100 * (clientWidth * dpr / width) + "px";

                scale = 1 / dpr;
                content = 'width=' + clientWidth * dpr + ',initial-scale=' + scale + ',maximum-scale=' + scale +
                    ', minimum-scale=' + scale;
                break;
        }
        
        metaEl.setAttribute('content', content);
    },
    init: function(){
        var _this = this;
        _this.preloader();
        _this.main();
    },
    preloader: function(){
        var _this = this;
        $.imgpreloader({
            paths: [
                'img/loading-logo.png',
                'img/btns.png',
                'img/common-bg.jpg',
                'img/dazhao-txt.png',
                'img/question.png',
                'img/f-question.png',
                'img/m-question.png',
                'img/people-sprite.jpg',
                'img/f-reject.jpg',
                'img/m-reject.jpg',
                'img/reject-txt.png',
                'img/f-bg.jpg',
                'img/m-bg.jpg',
                'img/f1.jpg',
                'img/f2.jpg',
                'img/f3.jpg',
                'img/m1.jpg',
                'img/m2.jpg',
                'img/m3.jpg'
            ]
        }).always(function($allImages, $properImages, $brokenImages){
            setTimeout(function(){
                $('#loading').hide();
                $('#home').addClass('active');

                //判断微信中打开
                var ua = navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i)=="micromessenger") {
                    $.getScript('js/wx.js');
                } else {
                    _this.initMusic();
                }
            }, 500);
        }).progress(function($image, $allImages, $properImages, $brokenImages, isBroken, percentage){
            $('#loading .colorlogo').css({
                'height': percentage+'%'
            })
            $('#loading .percent').html('LOADING '+percentage+'%');
        })
    },
    main: function(){
        var femaleHTML = '<a class="btn btn-baobao" data-video="f1.mp4" data-poster="f1.jpg">人家还是宝宝</a>'+
                       '<a class="btn btn-heidong" data-video="f2.mp4" data-poster="f2.jpg">网络信号黑洞</a>'+
                       '<a class="btn btn-heianliaoli" data-video="f3.mp4" data-poster="f3.jpg">极品黑暗料理</a>';

        var maleHTML = '<a class="btn btn-piqibao" data-video="m1.mp4" data-poster="m1.jpg">我爸脾气暴</a>'+
                       '<a class="btn btn-peigemen" data-video="m2.mp4" data-poster="m2.jpg">我要陪哥们</a>'+
                       '<a class="btn btn-xinku" data-video="m3.mp4" data-poster="m3.jpg">加班太辛苦</a>';
        var $home = $('#home'),
            $sex = $('#sex'),
            $zhizhaoBtn = $sex.find('.btn-zhizhao'),
            $method = $sex.children('.method'),
            $reject = $sex.children('.reject'),
            $bgvideoarea = $sex.children('.bgvideo'),
            $videoarea = $sex.children('.videoarea'),
            $bgvideo = $sex.find('.bg-video'),
            $btnvideo = $sex.find('.btn-video'),
            $dazhao = $sex.find('.btn-dazhao'),
            sex = '';

        $('#home .enter').on('click', function(){
            sex = $(this).data('target');
            var bgvideo = $(this).data('bgvideo');
            var bgposter = $(this).data('poster');
            $bgvideo[0].src = 'media/'+bgvideo;
            $bgvideo[0].poster = 'img/'+bgposter;
            // $bgvideo[0].load();
            $bgvideo[0].play();
            $home.removeClass('active');
            $sex.addClass(sex);
            $sex.addClass('active').children('.page:lt(2)').addClass('active');

            var timer = setInterval(function(){
                var currentTime = $bgvideo[0].currentTime;
                if(currentTime > 0){
                    $bgvideo.next('.loadicon').hide();
                    clearInterval(timer);
                }
            }, 100);

            //背景视频循环播放
            $bgvideo.on('ended', function(){
                this.currentTime = 0;
                this.play();
            })
        });

        //给Ta支招
        $zhizhaoBtn.on('click', function(){
            $(this).parent().removeClass('active');
            var btnsHTML = '';
            if(sex == 'male'){
                $method.html(maleHTML);
                $reject.find('.othermethod').html(maleHTML);
            }else{
                $method.html(femaleHTML);
                $reject.find('.othermethod').html(femaleHTML);
            }
            
            $method.addClass('active');
        });


        $sex.on('click', '[data-video]', function(){
            var $this = $(this);
            var src = $this.data('video');
            var poster = $this.data('poster');
            $videoarea.addClass('active').siblings('.page').removeClass('active');
            $btnvideo[0].src = 'media/' +src;
            $btnvideo[0].poster = 'img/' +poster;

            $bgvideo[0].pause();
            $btnvideo[0].play();

            var timer = setInterval(function(){
                var currentTime = $btnvideo[0].currentTime;
                if(currentTime > 0){
                    $btnvideo.next('.loadicon').hide();
                    clearInterval(timer);
                }
            }, 100);

            var text = $this.text();
            var $btns = $reject.children('.othermethod').children('.btn');
            $btns.each(function(index, el){
                if($(el).text() == text){
                    $(el).hide().siblings('.btn').show();
                    return false;
                }
            })

            $btnvideo.on('ended', function(){
                $reject.addClass('active').siblings('.pages').removeClass('active');
                $videoarea.removeClass('active');
            })
        });

        //放大招相关
        $dazhao.on('click', function(){
            $('#dazhao').addClass('active');
            $reject.removeClass('active');
        });
        //重新支招
        $('#dazhao .btn-jixu').on('click', function(){
            $('#dazhao').removeClass('active');
            $sex.removeClass('active');
            $home.addClass('active');
        });
    },
    initMusic: function(url){
        var $audio = $('#audio');
        var $audioParent = $audio.parent();
        $audio[0].play();
        $audioParent.on('click', function(){
            if(!$audio[0].paused){
                $audio[0].pause();
                $audioParent.removeClass('on');
            }else{
                $audio[0].play();
                $audioParent.addClass('on');
            }
        })
    }
}

processor.fixViewport('fixed', 750);

window.onload=function(){
    processor.init();
}
