define(['text!module/home/tpl.html', 'text!module/header/search.html', 'text!module/header/navigation.html', 'common', 'js/scroller', 'css!module/home/style/style.css?', 'js/scroller', 'domready!'], function(tpl, searchHtml, navHtml, common) {
	var controller = function() {
		//获取数据
		//common.postData('url',{},function(r){});
		var baseUrl = common.serverBaseUrl;
		//公告部分
		var annoucement_url = cmsUrl + urls.allUrls.getInformation;
		var annoucement_val = "";
		var param = {};

		function announce(r) {
			if(r.resultCode == "0000") {
				if(r.entities == null) {
					r.entities = [];
				}
				for(var i = 0; i < r.entities.length; i++) {
					r.entities[i].publishTime = convertTime(r.entities[i].publishTime);
					annoucement_val += "<a  href='#infodetails/" + r.entities[i].id + "/" + r.entities[i].publishTime + "' class='home-header-link'>" + r.entities[i].title + "</a>";
				};

				$('#announce_title').after(annoucement_val);
				$(".header-main-nav-cell").eq(1).addClass("header-main-nav-select");
			} else if(r.resultCode == "1020") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.message,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		};
		var url = baseUrl + urls.allUrls.getAllCate,
			callback = function(r) {
				if(r.code == "0000") {
					var data = {
						search: searchHtml,
						arr: r.list
					};
					appView.html(_.template(tpl, data));
					eventBind();
				} else if(r.code == "1020") {
					common.getOutFun();
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false
					}).width(320).show();
				}
			};

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
				$.cookie('orgId', d.user.organization.id, {
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
				
				$("#header-username").html($.cookie('username'));

			} else if(d.code === "1020") {
				common.getOutFun();
			}
		}
		
		//从Hms跳回来的身份验证
		common.getData("/store/api/identity", null, callbackValidate, true);

		common.postData(url, {
			flag: 1
		}, callback, false);

		//时间转换
		var mydate = new Date();

		function convertTime(number) {
			mydate.setTime(number);
			var y = mydate.getFullYear(),
				m = mydate.getMonth() + 1,
				d = mydate.getDate(),
				h = mydate.getHours(),
				min = mydate.getMinutes(),
				s = mydate.getSeconds();
			m = m < 10 ? "0" + m : m;
			d = d < 10 ? "0" + d : d;
			h = h < 10 ? "0" + h : h;
			min = min < 10 ? "0" + min : min;
			s = s < 10 ? "0" + s : s;
			return y + "-" + m + "-" + d;
		};

		function eventBind() {
			//购物车数量
			$("#basketNum").html($(".basket-num").html());
			//商品分类导航加载
			common.nav(0).search();

			//右边banner的点击事件
			$('.home-banner-cell').click(function() {
				var _index = $(this).index(),
					_h = 480,
					_top = 100;
				if(_index == 0) {
					_top = 0;
				} else {
					_top += _h * _index;
				}

				$(window).scrollTop(_top);
			});

			//通知公告加载
			common.postData(annoucement_url, param, announce, true);
		}
	}
	return controller;
});