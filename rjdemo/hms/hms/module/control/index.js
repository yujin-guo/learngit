define(['text!module/control/index.html', 'text!module/control/header.html', 'common','css!module/control/style/control.css'], function(tpl, header) {
	var controller = function() {
		//登录身份验证
		common.getData("/store/api/identity", null, callbackValidate, true);

		function callbackValidate(d) {
			if(d.code == "0000") {

				$.cookie('id', d.user.id, {
					path: '/'
				});
				$.cookie('username', d.user.realName, {
					path: '/'
				});
				$.cookie('organization', d.user.organization.name, {
					path: '/'
				});
				$.cookie("orgId", d.user.organization.id, {
					path: '/'
				});
				$.cookie('userEmail', d.user.email, {
					path: '/'
				});
				var permission_list = d.user.permissions;
				var new_arr = [];
				for(var i = 0; i < permission_list.length; i++) {
					var items = permission_list[i].name;
					if($.inArray(items, new_arr) == -1) {
						new_arr.push(items);
					}
				}
				window.userPermissions = new_arr;
				var a = JSON.stringify(new_arr);
				$.cookie("permissions", a, {
					path: "/"
				});

				userPermissions = JSON.parse($.cookie("permissions"));
				appView.html(_.template(header));
				$('#right-container').html(tpl);

				//头处理
				$(".infomation").html("欢迎来到" + $.cookie("organization") + "采购管理系统");
				var hospitalId = $.cookie("orgId");
				var hospitalImg=location.protocol+'//'+location.host+'/cms/file/downLoad?type=image&category=ORG_LOGO&about='+ hospitalId +'&serial=1';
				$(".logo-pur img").prop("src", hospitalImg);
				$(".logo-pur img").prop("alt", $.cookie("organization"));

				$(".header-console-title").append('<a href="' + jump.demo.purchaser + '">采购首页</a>');

				/*一级导航信息*/
				$(".nav-li").on("click", ".nav-icon-title", function() {
					$(".list-active").removeClass("list-active").addClass("li-hover-null");
					$(this).parent().removeClass("li-hover-null").addClass("list-active");
				});

				/*伸缩图标*/
				var flag = true;
				$(".nav-show-hide-icon").click(function() {
					if(flag == true) {
						$(this).parent().parent("ul").css({
							"width": "50px"
						});
						$(".content").css({
							"left": "221px"
						});
						$(this).css({
							"background-position": "-665px -60px"
						});
						flag = false;
					} else {
						$(this).parent().parent("ul").css({
							"width": "180px"
						});
						$(".content").css({
							"left": "350px"
						});
						$(this).css({
							"background-position": "-665px -108px"
						});
						flag = true;
					}
				});

				//头部人名
				$(".purchaser-name").html($.cookie("username"));

				/*退出登录*/
				$("#out-login").unbind().on("click", function() {
					common.getOutFun();
				});

			} else if(d.code == "1020") {
				common.getOutFun();
			}
		}
	};
	return controller;
});