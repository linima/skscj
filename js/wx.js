/**
 * Created by gx1727 on 2016-03-25.
 */


(function ($, window, document) {
    'use strict';
    var is_load_jweixin = false; // 是否已加载js库文件

    //加载js库文件
    var load_jweixin = function () {
        if (!is_load_jweixin) {
            var b = document.createElement("script");
            var url = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
            b.type = "text/javascript";
            b.src = url;
            b.onload = function () {
                is_load_jweixin = true;
                load_wx_config('jssdk.php');
            }
            document.body.appendChild(b);

        }
    };

    var load_wx_config = function (wx_config_url) {
        if (typeof wx != 'undefined') {

            $.getJSON(wx_config_url, {loc_url: location.href.split('#')[0]}, function (config, status) {
                if (status == 'success') {
                    wx.config({
                        debug: false,
                        appId: config.appId,
                        timestamp: config.timestamp,
                        nonceStr: config.nonceStr,
                        signature: config.signature,
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'checkJsApi'
                        ]
                    });
                    init_wx(wxConfig);
                }
            });
        }
    }

    //启动
    load_jweixin();

    var init_wx = function (wxConfig) {
        wx.ready(function () {
            if (typeof processor === 'object' && typeof processor.initMusic === 'function') {
                processor.initMusic();
            }
            //分享朋友圈
            wx.onMenuShareTimeline({
                title: wxConfig.timeLineTitle, // 分享标题
                link: wxConfig.link, // 分享链接
                imgUrl: wxConfig.img, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    wxConfig.shareTimelineSuccess();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            //发送给朋友
            wx.onMenuShareAppMessage({
                title: wxConfig.appMessageTitle, // 分享标题
                desc: wxConfig.appMessageDesc, // 分享描述
                link: wxConfig.link, // 分享链接
                imgUrl: wxConfig.img, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户确认分享后执行的回调函数
                    wxConfig.shareAppMessageSuccess();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    };
}($, window, document));