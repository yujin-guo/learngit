/**
 * Created by liumin on 2016/7/8.
 */
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
            common:'js/common',
            pagination:'js/libs/jquery.pagination',
            cookie:'js/libs/jquery.cookie',
			myalert:'js/libs/dialog-min',
			upload:'js/libs/ajaxfileupload',
			jump:'config'
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
            },
            pagination:{
            	deps: ['jquery'],
                exports: 'pagination'
            },
            cookie:{
            	deps: ['jquery'],
                exports: 'cookie'
            },
			myalert:{
				deps:['jquery'],
				exports:'myalert'
			},
			upload:{
				deps:['jquery'],
				exports:'upload'
			},
			jump: {
				exports: 'jump'
			}
        }
    };

    require.config(config);

    //暴露必要的全局变量
    require(['jquery','js/router', 'underscore','backbone','pagination','js/urls','common','cookie','myalert','upload','jump'], function($,router, _,Backbone,pagination,urls,common,cookie,myalert,upload,jump){
        window.appView = $('#container');
        window.$ = $;
        window._ = _;
        window.common = common;
        window.urls=urls;
        window.testUrl=common.serverBaseUrl;  //测试地址
        window.bidUrl = common.bidBaseUrl;  //竞价地址
        window.cmsUrl = common.cmsBaseUrl;  //cms地址
		window.myalert=myalert;
		window.upload=upload;
		window.jump=jump;
        Backbone.history.start();
        
    });
})(window);
