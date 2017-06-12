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
    get_state: function () {
        var _this = this;
        $.ajax({
            type: 'GET',
            url: 'admin/index.php?c=luckdraw&m=init',
            data: {random: Math.random()},
            dataType: 'json',
            timeout: 5000,
            success: function (ret) {
                if (ret.code == 0) {
                } else if (ret.code == 1) {
                    location.href = ret.locatioin;
                    return false;
                } else if (ret.code == 4) {
                    $('#score .tel').val(ret.o_phone);
                    $('#score .address').val(ret.o_address);
                    _this.showResult(ret.o_level);
                    return false;
                } else if (ret.code == 5) {
                    _this.showMsgtip(' 您今天的抽奖次数已用完，明天再来吧');
                    return false;
                } else {
                    _this.showMsgtip(ret.msg);
                }
            },
            error: function (xhr, type) {
                alert('Ajax error!')
            }
        });
    },
    showMsgtip: function(msg){
        $('#msgtip p').html(msg);
        $('#msgtip').addClass('active');

        $('#msgtip .ok').on('click', function(){
            $('#msgtip').removeClass('active');
        });
    },
    showResult: function (result) {

        var $score = $('#score'),
            $caption = $score.children('.caption'),
            $prizeImg = $score.children('.prize').children('img'),
            $form = $score.children('.form'),
            $tips = $score.children('.tips'),
            $btns = $score.children('.btns');
        var _this = this;
        console.log(result);
        console.log(parseInt(result));
        switch (parseInt(result)) {
            case 1:
                //免费涂刷
                return;
                break;
            case 2:
                $score.addClass('score-first');
                $prizeImg.attr('src', 'img/prize1.png');
                $caption.html('恭喜您获得<b>运动手环！</b>动起来，多回家看看！');
                $tips.html('七个工作日内，会有三棵树工作人员与您联系，<br>沟通具体获奖事宜及后续操作，请留意您的电话。');
                break;
            case 3:
                $score.addClass('score-second');
                $prizeImg.attr('src', 'img/prize2.png');
                $caption.html('恭喜您获得<b>三棵树绿色加湿器！</b><br>家乡的气息还记得？回去感受吧！');
                $tips.html('七个工作日内，会有三棵树工作人员与您联系，<br>沟通具体获奖事宜及后续操作，请留意您的电话。');
                break;
            case 4:
                $score.addClass('score-third');

                $prizeImg.attr('src', 'img/prize3.png');
                $caption.html('恭喜您获得了三棵树天猫旗舰店<br><b>【以10抵1000兑换券】，</b>让您省钱又有面儿！');
                $tips.html('在2017年6月30日前，凭此截图，给到天猫旗舰店客服，即可<br>以10元购买面值1000元的现金抵用券，具体可与客服联系。');
                $form.hide();
                $btns.children('.submit').hide();
                break;
            case 5:
                _this.showMsgtip('就差一点');
                return;
                break;
            case 6:
                _this.showMsgtip('再接再厉');
                return;
                break;
            default:
                break;
        }
        $score.addClass('active');
        $('#draw').removeClass('active');
    },
    init: function () {
        /**
         一级奖 240deg 运动手环
         二级奖 0deg   加湿器
         三级奖 120deg 优惠券
         未中奖 60deg  再接再厉
         未中奖 300deg 就差一点
         **/
        var _this = this;
        var angleArr = [240, 0, 120, 60, 300];
        $("#lotteryStart").on('click', function () {
            var $this = $(this);
            $(this).attr('disabled', true);

            $.ajax({
                type: 'GET',
                url: 'admin/index.php?c=luckdraw',
                data: {random: Math.random()},
                dataType: 'json',
                timeout: 3000,
                success: function (ret) {
                    if (ret.code == 0) {
                        $this.css({"transform": "rotate(0deg)", "transition": "all 0s"});
                        setTimeout(function () {
                            $('#lotteryStart').css("transition", "all " + ret.p_duration + "s").css("transform", "rotate(" + ( ret.angles + 360*3 * ret.p_baseanimate) + "deg)");
                        }, 100);

                        setTimeout(function () {
                            console.log('transitionend');
                            $this.attr('disabled', false);
                            _this.showResult(ret.level);
                        }, ret.p_duration * 1000 + 500);
                    } else if (ret.code == 4) {
                        _this.showResult(ret.level);
                    } else if (ret.code == 5) {
                        _this.showMsgtip(ret.msg);
                        // alert(ret.msg);
                    } else {
                        _this.showMsgtip(ret.msg);
                        // alert(ret.msg);
                    }
                },
                error: function (xhr, type) {
                    _this.showMsgtip('Ajax error!')
                }
            })

            return false;

            // var result = angleArr[Math.floor(Math.random() * (angleArr.length))];
            // result = 120
            //
            // var ret = {};
            // ret.angles = 120;
            // ret.p_duration = 1;
            // ret.p_baseanimate = 1;
            // $(this).css({"transform": "rotate(0deg)", "transition": "all 0s"});
            // setTimeout(function () {
            //     $('#lotteryStart').css("transition", "all " + ret.p_duration + "s").css("transform", "rotate(" + ( ret.angles + 360 * ret.p_baseanimate) + "deg)");
            // }, 100);
            //
            // $(this).off('transitionend');
            // $(this).on('transitionend', function () {
            //     setTimeout(function () {
            //         $(this).attr('disabled', false);
            //         _this.showResult(result);
            //     }, 500)
            // })
        });


        $('#score .submit').on('click', function () {
            var tel = $('#score .tel').val();
            var address = $('#score .address').val();
            var reg = /^1[0-9]{10}$/;
            if (tel == '' || !reg.test(tel)) {
                _this.showMsgtip('手机号错误：<br>请输入正确的手机号码！');
                return;
            }
            if (address == '') {
                _this.showMsgtip('地址：<br>请填写您的邮寄地址，方便我们给您寄送礼品。');
                return;
            }

            $.ajax({
                type: 'POST',
                url: 'admin/index.php?c=luckdraw',
                data: {
                    tel: tel,
                    address: address,
                    random: Math.random()
                },
                dataType: 'json',
                timeout: 3000,
                success: function (ret) {
                    if (ret.code == 0) {
                        //如果提交成功
                        $('#score').removeClass('active');
                        $('#success').addClass('active');
                    } else {
                        _this.showMsgtip(ret.msg);
                    }
                },
                error: function (xhr, type) {
                    _this.showMsgtip('Ajax error!')
                }
            })


        });
        $('.share').on('click', function () {
            $('#popshare').addClass('active');
        });
        $('#popshare').on('click', function () {
            $(this).removeClass('active');
        });
    }
}

processor.fixViewport('fixed', 750);
window.onload = function () {
    processor.get_state();
    processor.init();
}