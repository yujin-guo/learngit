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
			pagination: 'js/libs/jquery.pagination',
			cookie: 'js/libs/jquery.cookie',
			domready: 'js/libs/domReady',
			myalert: 'js/libs/dialog-min',
			jump:'../config'
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
			pagination: {
				deps: ['jquery'],
				exports: 'pagination'
			},
			cookie: {
				exports: 'cookie'
			},
			myalert: {
				deps: ['jquery'],
				exports: 'myalert'
			},
			jump: {
				exports: 'jump'
			}
		}
	};
	require.config(config);
	/*引入全局变量*/
	require(['jquery', 'js/router', 'underscore', 'backbone','js/urls', 'common', 'pagination', 'cookie',  'myalert','jump'], function($, router, _, Backbone, urls, common, pagination, cookie, myalert,jump) {
		window.appView = $('#container');
		window.$ = $;
		window._ = _;
		window.urls = urls;
		window.common = common;
		window.cookie = cookie;
		window.baseUrl = common.serverBaseUrl;
		window.bidUrl = common.bidBaseUrl;
		window.pagination = pagination;
		window.myalert = myalert;
		window.jump=jump;
		Backbone.history.start();

		//左侧导航下拉
		$(".nav-common-event").on("click", function() {
			var ulElement = $(this).nextAll(".next-ul-nav");
			if(ulElement.hasClass("show")) {
				ulElement.removeClass("show");
				$(this).removeClass("my-price-icon02");
				$(this).addClass("my-price-icon01");
			} else {
				ulElement.addClass("show");
				$(this).removeClass("my-price-icon01");
				$(this).addClass("my-price-icon02");
			}
		});

		$(".index-link").on("click", function() {
			$(".index-link").removeClass("home-active").addClass("hover-flag");
			$(this).removeClass("hover-flag").addClass("home-active");
		});

		//显示用户名
		$("#per-name").html($.cookie('username'));
		$("#outLogin").on("click", function() {
			common.getOutFun();
		});

	});
})(window);