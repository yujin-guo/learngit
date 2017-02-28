define(['backbone', 'jquery'], function() {
	var routesMap = {
		'': 'module/login/login.js', //初始页面
		'control': 'module/control/index.js', //控制台页面
		"order(/*:id)": "module/order/order.js", //订单管理
		"orderdetails/:id": "module/order/orderdetails", //订单详情
		'findPassword': 'module/login/find.js', //找回密码
		'control': 'module/control/index.js', //控制台页面
		'account(/*:id)': 'module/account/account.js', //结算管理
		'accountdetails/:id/:status(/:done)': 'module/account/accountdetails', //结算详情
		'purcharseManger(/*:id)': 'module/purchase/list.js', //采购管理
		'purcharseDetail/*:id': 'module/purchase/detail.js', //采购详情
		'product': 'module/product/list.js', //商品管理
		'supply(/*:id)': 'module/supply/supply.js', //供应商管理
		"supplydetails/:supplierCode/:status": 'module/supply/supplydetails.js', //供应商详情
		'approval(/*:id)': 'module/approval/approval.js', //供应商管理(资质认证)
		"approvaldetails/:id/:status": 'module/approval/approvaldetails.js', //供应商资质
		'personal': 'module/my/my.js', //基本信息
		'ctrlPersonal/*:key': 'module/my/ctrlPersonal.js', //修改手机/邮箱/密码
		'member': 'module/member/member.js', //成员管理
		'addMember': 'module/member/addMember.js', //新增成员
		'editMember/*:id': 'module/member/editMember.js', //编辑成员
		'roles': 'module/roles/roles.js', //角色管理
		'rolesCtrl/*:key': 'module/roles/rolesCtrl.js', //新增/编辑角色
		'statistic': 'module/statistic/summary.js', //统计管理（业务量概述）
		'subjectStatistic': 'module/statistic/subject.js', //统计管理（课题组交易统计）
		'supplierStatistic': 'module/statistic/supply.js', //统计管理（供应商交易统计）
		'brandStatistic': 'module/statistic/brand.js', //统计管理（品牌交易统计）
		'systemStatistic': 'module/statistic/system.js', //统计管理（系统使用查询）
		'ratedStatistic': 'module/statistic/rate.js', //统计管理（评价列表）
		'brandlist(/*:id)': 'module/brand/brand.js', //品牌管理
		'branddetail/*:id': "module/brand/detail.js", //品牌详情
		'department': 'module/department/department.js', //部门管理
		'addDepartment/*:key': 'module/department/addDepartment.js', //新增/修改部门
		'dDetail/*:id': 'module/department/dDetail.js', //部门详情
		'addDepartMember/*:key': 'module/department/addMember.js', //新增部门成员(采购/管理)
		'ctrlMainPerson/*:key': 'module/department/mainPerson.js', //新增/更换负责人
		'inviteMember/*:id': 'module/department/inviteMember.js', //邀请成员
		'inviteSuccess': 'module/department/inviteSuccess.js', //邀请成功
		'card/*:key': 'module/card/card.js', //经费卡管理
		'addCard/*:key': 'module/card/addCard.js', //增加/编辑经费卡
		'bid(/*:index)': 'module/bid/bid.js', //竞价管理
		'biddetails/:id': 'module/bid/biddetails.js', //竞价详情
		'config/*:id': 'module/config/config.js', //配置管理
		'cms/*:key': 'module/cms/cms.js', //内容管理
		'newcms/*:key': 'module/cms/new.js', //新建内容
		'column/*:key': 'module/cms/column.js', //栏目管理
		'newcolumn/*:key': 'module/cms/newcolumn.js' //新建栏目
	};
	var Router = Backbone.Router.extend({
		routes: routesMap,
		defaultAction: function() {
			location.hash = 'module1';
		}
	});

	var router = new Router();
	//彻底用on route接管路由的逻辑，这里route是路由对应的value
	router.on('route', function(route, params) {

		require([route], function(controller) {
			if(/#/.test(location.hash)) {
				var h = location.hash.split('#')[1];
				var t = h.split('?')[0] || h.split('/')[0];
			} else {
				t = null;
			}

			if(t !== "findPassword" && t != null && t != '' && t != "cms" && t != "newcms" && t != "cms" && t != "column" && t != "newcolumn") {
				if($.cookie('id') == false || $.cookie('id') == undefined || $.cookie('id') == '') {

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

							controller.apply(null, params); //每个模块约定都返回controller
							dd();
						} else if(d.code == "1020") {
							$.cookie("saveHmsLoginUrl", window.location.href, {
								expires: 0.004,
								path: "/"
							});
							common.getOutFun();
						}
					}

				} else {
					controller.apply(null, params); //每个模块约定都返回controller
					dd();
				}
			} else {
				controller.apply(null, params); //每个模块约定都返回controller
				dd();
			}

			function dd() {
				//头处理
				$(".infomation").html("欢迎来到" + $.cookie("organization") + "采购管理系统");
				var hospitalId = $.cookie("orgId");
				var hospitalImg=location.protocol+'//'+location.host+'/cms/file/downLoad?type=image&category=ORG_LOGO&about='+ hospitalId +'&serial=1';
				$(".logo-pur img").prop("src", hospitalImg);
				$(".logo-pur img").prop("alt", $.cookie("organization"));

				if(t !== "findPassword" && t != null && t != '') {
					$(".header-console-title").append('<a href="' + jump.demo.purchaser + '">采购首页</a>');
				}

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
				$(".purchaser-name").text($.cookie("username"));

				/*退出登录*/
				$("#out-login").unbind().on("click", function() {
					common.getOutFun();
				});
			}
		});
	});
	return router;
});