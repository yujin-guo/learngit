/**
 * Created by liumin on 2016/7/8.
 */
(function(window) {
	//配置mainbaseUrl
	var mainbaseUrl = document.getElementById('main').getAttribute('data-baseurl');
	/*
	 * 文件依赖
	 */
	var config = {
		baseUrl: mainbaseUrl,
		paths: {
			jquery: 'js/libs/jquery',
			underscore: 'js/libs/underscore',
			backbone: 'js/libs/backbone',
			text: 'js/libs/text',
			css: 'js/libs/css',
			domready: 'js/libs/domReady',
			common: 'js/common',
			pagination: 'js/libs/jquery.pagination',
			cookie: 'js/libs/jquery.cookie',
			echarts: 'js/libs/echarts.min',
			myalert: 'js/libs/dialog-min',
			jump: '../config'
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

	//暴露必要的全局变量
	require(['jquery', 'underscore', 'backbone', 'js/urls', 'common', 'js/router','pagination', 'cookie', 'myalert', 'jump'], function($, _, Backbone, URL, common, router, pagination, cookie, myalert, jump) {
		window.appView = $('#container');
		window.$ = $;
		window._ = _;
		window.urls = URL;
		window.common = common;
		window.baseUrl = common.serverBaseUrl;
		window.bidUrl = common.bidBaseUrl;
		window.cmsUrl = common.cmsBaseUrl;
		window.pagination = pagination;
		window.cookie = cookie;
		window.myalert = myalert;
		window.Backbone = Backbone;
		window.jump = jump;
		window.bidTime = null; //计时器
		Backbone.history.start();

		//cookie
		common.cookieFun();

		/*退出登录*/
		$("#out").unbind().on("click", function() {
			common.getOutFun();
		});

		if($.cookie("permissions")) {
			userPermissions = JSON.parse($.cookie("permissions"));
			var purchaser_limit = userPermissions.indexOf('采购人中心');
            var hospital_limit1 = userPermissions.indexOf('采购单查看');
            var hospital_limit2 = userPermissions.indexOf('订单查看');
            var hospital_limit3 = userPermissions.indexOf('供应商查看');
            var hospital_limit4 = userPermissions.indexOf('结算单查看');
            var hospital_limit5 = userPermissions.indexOf('部门查看');
			if(purchaser_limit == -1) {
				$("#user-name").prop("href", "403.html");
				$("#user-name").css("color", "#ccc");
				$("#myorder").prop("href", "403.html");
				$("#myorder").css("color", "#ccc");
				$("#cart").prop("href", "403.html");
				$("#cart").css("color", "#ccc");
				$(".header-car-btn").prop("href", "403.html");                     
			}
			if(hospital_limit1 == -1&&hospital_limit2 == -1&&hospital_limit3 == -1&&hospital_limit4 == -1&&hospital_limit5 == -1) {
               $("#hospital-center").hide();                 
			}
		}

		/* 收藏本页 */
		$("#shoucang").bind("click", function() {
			var title = document.title;
			var URL = document.URL;
			try {
				window.external.addFavorite(URL, title); //ie
			} catch(e) {
				try {
					window.sidebar.addPanel(title, URL, ""); //firefox
				} catch(e) {
					dialog({
							title: '提示',
							modal: true,
							content: '加入收藏失败，请使用Ctrl+D进行添加',
							ok: function() {},
							cancel: false,
						}).width(320).show() //chrome opera safari
				}
			}
		});
	});
})(window);
