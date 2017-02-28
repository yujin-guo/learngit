(function (window) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');
    /*
     * 文件依赖
     */
    var config = {
        baseUrl: baseUrl,
        paths: {
            jquery: 'js/libs/jquery',
            underscore: 'js/libs/underscore',
            backbone:'js/libs/backbone',
            text: 'js/libs/text',
            css: 'js/libs/css',
            domready:'js/libs/domReady',
            common:'js/common'
        },
        shim: {
            underscore: {
                exports: '_'
            },
            jquery: {
                exports: '$'
            },
            director: {
                exports: 'Router'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            }
        }
    };

    require.config(config);

    //暴露必要的全局变量
    require(['jquery', 'underscore','backbone','js/urls','common','js/login'], function($, _,Backbone,URL,common,login){
    	login();//小登录
        window.$ = $;
        window._ = _;
        window.URL = URL;
        window.common = common;
        window.Backbone = Backbone;
        Backbone.history.start();
    });


})(window);
