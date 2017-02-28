define(['backbone', 'jquery', 'common', 'cookie'], function() {
	var routerMap = {
		'': 'module/home/home.js', //初始化页面
		'newsList': 'module/news/newsList.js', //消息列表
		'newsDetail/*:id': 'module/news/newsDetail.js', //消息详情
		'interest': 'module/interest/interest.js', //我的关注

		"order(/:status)": "module/order/order.js", //订单列表
		"orderdetails/*:id": "module/order/orderdetails.js", //订单详情
		"comment/:orderNo": "module/order/comment.js", //订单评价
		"commentlist": "module/order/commentlist.js", //评价列表
		"presettle": "module/settlement/presettle.js", //待结算列表
		"settlement": "module/settlement/settlement.js", //结算单列表
		'zzsettlement':'module/settlement/ZZsettlement.js',//浙肿结算单列表
		"settlementdetails(/*:id)": "module/settlement/settlementdetails.js", //结算单详情
		"zzsettlementdetails(/*:id)": "module/settlement/ZZsettlementdetails.js", //浙肿结算单详情
		"invoice(/*:ids)":"module/settlement/invoice.js",//接收发票
		"returnlist": "module/returnlist/return.js", //退货单列表
		"returnstepone/*:id": "module/return/returnstepone.js", //退货第一步
		"returnsteptwo/*:id": "module/return/returnsteptwo.js", //退货第二步
		"returnstepthree/*:id": "module/return/returnstepthree.js", //退货第三步
		"returnstepfour/*:id": "module/return/returnstepfour.js", //退货第四步
		"cardlist": "module/card/card.js", //经费卡列表

		/*采购申请*/
		'purcharselist': 'module/purcharse_list/purcharselist.js',
		'purcharsedetail/*:id': 'module/purcharse_list/detail.js',

		/*基本信息*/
		'personal': 'module/purcharse_personal/personal.js',
		'personaledit/*:key': 'module/purcharse_personal/personaledit.js',
		'personalsuccess/*:key': 'module/purcharse_personal/success.js',
		'editpass/*:key': 'module/purcharse_personal/editpass.js',

		/*收货地址*/
		'list': 'module/address/list.js',
		'create/*:key': 'module/address/create.js',

		/*竞价*/
		'newbit(/*:id)': "module/bid_list/newBid.js", //新建竞价（第一步）
		'newbidsec/*:id': "module/bid_list/newBidSecond.js", //新建竞价（第二步）
		'newbidthird/*:id': "module/bid_list/newBidThird.js", //新建竞价（第三步）
		'bidlist(/:status)': "module/bid_list/bidlist.js", //竞价列表
		"biddetails/:id": "module/bid_list/biddetails.js" //竞价详情
	};
	var Router = Backbone.Router.extend({
		routes: routerMap
	});
	var router = new Router();

	/*用on接管路由逻辑*/
	router.on('route', function(route, params) {
		require([route, 'domready!'], function(controller) {
			if($.cookie('id') == undefined || $.cookie('id') == false || $.cookie('id') == '') {
				
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
						ddp();
					} else if(d.code == "1020") {
						$.cookie("saveLoginUrl",window.location.href,{expires:0.004,path:"/"});
						common.getOutFun();
					}
				}
			}else{
				controller.apply(null, params); //每个模块约定都返回controller
				ddp();
			}

			function ddp() {
				userPermissions = JSON.parse($.cookie("permissions"));
                if(($.inArray("采购单查看", userPermissions) == -1)&&($.inArray("订单查看", userPermissions) == -1)&&($.inArray("供应商查看", userPermissions) == -1)&&($.inArray("结算单查看", userPermissions) == -1)&&($.inArray("部门查看", userPermissions) == -1)) {
                    $('.hospital-manage').hide();
                }else{
                    $('.hospital-manage').show();
					$(".hospital-manage").prop("href",jump.demo.hms);   
                }
				if($.inArray("竞价发布", userPermissions) == -1) {
					$('.my-price').hide();
					$('.purchaserBidNav').hide();
				}
				//时时监听购物车数量
				common.postData(baseUrl + urls.allUrls.getCartList, {
					showData: false
				}, function(d) {
					if(d.code == "0000") {
						if(d.total) {
							setTimeout(function() {
								$(".basket-num").html(d.total)
							}, 400);
						}
					} else if(d.code == "1020") {
						common.getOutFun();
					}
				}, true);
			}
		});
	});
	return router;
});