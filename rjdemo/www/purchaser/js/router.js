/**
 * Created by liumin on 2016/7/11.
 */
define(['backbone', 'jquery'], function() {

	var routesMap = {
		'': 'module/home/controller.js', //初始化页面
		'portal': 'module/door/door.js', //门户首页
		'detailsearch': 'module/search/search.js', //高级搜索
		"supplie/*:id": "module/commodity/supplie_shop.js", //供应商店铺
		"invitelink/*:key": "module/procurment/invitelink.js", //邀请采购人页面
		"purchaser/*:key": "module/procurment/procurment.js", //采购人注册
		"success/*:key": "module/procurment/success.js", //采购人注册成功
		"providerfirst/*:key": "module/procurment/provider.js", //供应商注册
		"providersecond/*:key": "module/procurment/provider_second.js",
		"providerthird/*:key": "module/procurment/provider_third.js",
		"providerforth/*:key": "module/procurment/provider_forth.js",
		"login": "module/login/login.js", //登录
		//"currentlogin":"module/login/login02.js",  //临时的采购人登录
		"commoditylist(/*:key)": "module/commodity/commoditylist.js", //商品列表页面

		/*采购人找回密码*/
		"findpassword": "module/find/password.js",
		"passwordsecond/*:key": "module/find/passwordsecond.js",
		"passwordthird/*:key": "module/find/passwordthird.js",
		"passwordforth": "module/find/passwordforth.js",
		"mobilefirst/*:phone": "module/find/find_mobile_first.js",
		"mobilesecond/*:key": "module/find/find_mobile_second.js",
		"mobilethird": "module/find/find_mobile_third.js",

		/*供应商找回密码*/
		"profindpassword": "module/providerfind/password.js",
		"propasswordsecond/*:key": "module/providerfind/passwordsecond.js",
		"propasswordthird/*:key": "module/providerfind/passwordthird.js",
		"propasswordforth": "module/providerfind/passwordforth.js",
		"promobilefirst/*:phone": "module/providerfind/find_mobile_first.js",
		"promobilesecond/*:key": "module/providerfind/find_mobile_second.js",
		"promobilethird": "module/providerfind/find_mobile_third.js",

		"details/:sn/:id": "module/details/details.js", //商品详情页面
		"cart": "module/cart/cart.js", //生成采购申请单
		"cartapply/*:ids": "module/cart/cartapply.js", //生成采购申请单
		"zzcartapply/*:ids":"module/cart/ZZcartapply.js",//浙肿生成采购申请单
		"information": "module/information/information.js", //信息公告
		"infodetails/:id/:time": "module/information/infodetails.js", //信息详情

		/*竞价频道*/
		"bidlist": "module/bid/list.js", //竞价列表/竞价中/已结束
		"listdetail/*:id": "module/bid/listDetail.js", //竞价详情
		"biddetail/*:id": "module/bid/bidDetail.js", //竞价商品详情（未登录/非供应商/已放弃/未报价/报价成功填写报价）
		"editprice/*:id": "module/bid/editPrice.js", //修改报价

		"help": "module/help/help.js", //帮助中心
		"helpdetails/:id/:time": "module/help/helpdetails.js", //帮助中心详情
		"sms": "module/sms/sms.js", //sms

		"validateMobile": "module/validate/mobile.js", //登录手机验证
		"suppValidateMobile": "module/validateSupp/mobile.js" //供应商登录手机验证
	};

	var Router = Backbone.Router.extend({
		routes: routesMap,
		defaultAction: function() {

			location.hash = '';
		}
	});

	var router = new Router();
	//彻底用on route接管路由的逻辑，这里route是路由对应的value
	router.on('route', function(route, params) {
		require([route], function(controller) {
			controller.apply(null, params); //每个模块约定都返回controller

			//清除竞价计时器
			clearInterval(bidTime);

			if(/#/.test(location.hash)) {
				var h = location.hash.split('#')[1];
				var t1 = /\b.*\?\b/.test(h),
					t2 = /\b.*\/\b/.test(h);
				if(t1) {
					var t = h.split('?')[0];
				} else if(t2) {
					var t = h.split('/')[0];
				} else {
					var t = h;
				}
			} else {
				t = null;
			}
			if(t !== "login" && t !== "/login" && t !== "promobilefirst" && t !== "/promobilefirst" && t !== "promobilesecond" && t !== "promobilethird" && t !== "profindpassword" && t !== "/profindpassword" && t !== "propasswordsecond" && t !== "propasswordthird" && t !== "propasswordforth" && t !== "findpassword" && t !== "/findpassword" && t !== "passwordsecond" && t !== "passwordthird" && t !== "passwordforth" && t !== "mobilefirst" && t !== "mobilesecond" && t !== "mobilethird" && t !== "bidlist" && t !== "listdetail" && t !== "portal" && t !== "providerfirst" && t !== "providersecond" && t !== "providerthird" && t !== "/providerthird" && t !== "providerforth" && t !== "purchaser" && t !== "success" && t !== "invitelink" && t !== "biddetail" && t !== "editprice" && t !== "help" && t !== "helpdetails" && t !== "sms" && t !== "information" && t !== "infodetails" && t !== "suppValidateMobile") {
				//保证用户必须有手机号码
				/*if($.cookie("vm")== undefined || $.cookie("vm")==''||$.cookie("vm").length!=11){
					window.location.href="#validateMobile";
				}*/

				//没有cookie时登录判断的处理
				if($.cookie('id') == undefined || $.cookie('id') == false || $.cookie('id') == '') {
					common.identityFun(controller, params);
				}

				//时时监听购物车数量
				common.postData(baseUrl + urls.allUrls.getCartList, {
					showData: false
				}, function(d) {
					if(d.code == "0000") {
						if(d.total) {
							$(".basket-num").html("(" + d.total + ")");
						}
					} else if(d.code == "1020") {
						common.getOutFun();
					}
				}, true);
			}
			
			$(".header").css("display", "block");
			if(t=="validateMobile" || t=="suppValidateMobile" || t == "login" || t == "/login" || t == "promobilefirst" || t == "/promobilefirst" || t == "promobilesecond" || t == "promobilethird" || t == "profindpassword" || t == "/profindpassword" || t == "propasswordsecond" || t == "propasswordthird" || t == "propasswordforth" || t == "findpassword" || t == "/findpassword" || t == "passwordsecond" || t == "passwordthird" || t == "passwordforth" || t == "mobilefirst" || t == "mobilesecond" || t == "mobilethird" || t == "providerfirst" || t == "providersecond" || t == "providerthird" || t == "/providerthird" || t == "providerforth" || t == "purchaser" || t == "success" || t == "invitelink"){
				$(".header").css("display", "none");
			}
		});
	});

	return router;
});