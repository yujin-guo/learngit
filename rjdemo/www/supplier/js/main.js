/*
 create by lijinhua on 2016/7/25
 * */
(function(window) {
	var mainBaseUrl = document.getElementById("main").getAttribute("data-baseurl");
	/*文件依赖*/
	var config = {
		baseUrl: mainBaseUrl,
		paths: {
			jquery: 'js/libs/jquery',
			underscore: 'js/libs/underscore',
			backbone: 'js/libs/backbone',
			text: 'js/libs/text',
			css: 'js/libs/css',
			common: 'js/common',
			cookie: 'js/libs/jquery.cookie',
			pagination: 'js/libs/jquery.pagination',
			urls: 'js/urls',
			myalert: 'js/libs/dialog-min',
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
			'methods': {
				deps: ['jquery'],
				exports: 'method'
			},
			'pagination': {
				deps: ['jquery'],
				exports: 'pagination'
			},
			cookie: {
				exports: 'cookie'
			},
			myalert: {
				deps: ['jquery'],
				exports: "myalert"
			}
		}
	};
	require.config(config);
	/*引入全局变量*/
	require(['jquery', 'js/router', 'underscore', 'backbone', 'urls','common', 'pagination', 'cookie', 'myalert', "js/libs/laydate.dev"], function($, router, _, Backbone, urls, common, pagination, cookie, myalert, laydate) {
		window.appView = $('#container');
		window.$ = $;
		window._ = _;
		window.urls = urls;
		window.common = common;
		window.baseUrl = common.serverBaseUrl;
		window.cookie = cookie;
		window.myalert = myalert;
		window.pagination = pagination;
		Backbone.history.start();

		//导航效果
		$(".left-nav-first>li p").bind("click", function() {
			$(this).toggleClass("selected");
			$(this).next(".left-nav-second").toggle();
		});
		$(".left-nav-second>li a").bind("click", function() {
			$(".left-nav-second>li a,.my-shop").removeClass("active");
			$(this).addClass("active");
		});

		$("#name-provider").html($.cookie('username1'));

		/*退出登录*/
		$("#out-provider").on("click", function() {
			common.getOutFun();
		});
	});

})(window);