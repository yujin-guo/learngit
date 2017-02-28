define(['backbone', 'jquery'], function() {
	var routerMap = {
		'': 'module/home/home.js', //初始化页面

		'personal': 'module/personal/personal.js', //基本信息
		'personaledit/*:key': 'module/personal/personaledit.js',
		'personalsuccess/*:key': 'module/personal/personalsuccess.js',
		'editpass/*:key': 'module/personal/editpass.js',
		//'passresult/:id':'module/personal/result.js',
		'transactionlist(/*:status)': 'module/transaction/transactionlist.js', //订单列表
		'transactiondetail/*:id': 'module/transaction/detail.js', //订单详情
		'returnlist(/*:status)': 'module/transaction/returnlist.js', //退货列表
		'returndetail/*:id': 'module/transaction/returndetail.js', //退货流程
		'accessment': 'module/transaction/accessment.js', //评价
		'aDetail/:sn':'module/transaction/accessmentDetail.js', //评价详情
		'hospital': 'module/hospital/hospitallist.js', //医院管理
		'hospitaldoing/*:id': 'module/hospital/hospitaldoing.js', //医院详情(审核中)
		'hospitalunpass/*:id': 'module/hospital/hospitalunpass.js', //医院详情(未通过)
		'hospitalunexit/*:id': 'module/hospital/hospitalunexit.js',
		'hospitalpass/*:id': 'module/hospital/hospitalpass.js', //医院详情(已进驻)
		'hospitalapply/*:id': 'module/hospital/hospitalapply.js', //未进驻的医院提交申请
		'waiting': 'module/hospital/applywaiting.js', //医院提交申请

		"add(/:id)(/*:id)": "module/addProduct/add.js", //新增商品
		"success": "module/addProduct/addsuccess.js", //新增商品成功
		"import": "module/import/import.js", //批量导入
		"importconfirm/*:path": "module/import/importconfirm.js", //批量导入确认
		"importsuccess": "module/import/importsuccess.js", //批量导入成功
		"importdesc": "module/import/importDesc.js", //批量导入说明
		"productlist(/:status)": "module/productList/productlist.js", //供应商商品列表
		"productdetails/:id": "module/productList/productdetails.js", //商品详情
		"details/:id":"module/productList/details.js",//商品预览

		"brand": "module/brand/brand.js", //品牌列表
		"agentbrand/:id": "module/brand/agentbrand.js", //品牌详情
		"certification": "module/brand/certificationbrand.js", //品牌申请第一步
		"certificationinfo/*:id": "module/brand/certificationinfo.js", //品牌申请第二步
		"certificationsuccess": "module/brand/certificationsuccess.js", //品牌申请第三步

		"brand": "module/brand/brand.js",
		"credential": "module/credential/credential.js", //企业资质认证
		"credentialFirst": "module/credential/credentialFirst.js", //企业资质认证（未认证）第一步
		"credentialSecond(/*:key)": "module/credential/credentialSecond.js", //企业资质认证（未认证）第二步
		"credentialThird": "module/credential/credentialThird.js", //企业资质认证第三步
		"settleaccount(/:flag)": "module/settleaccount/account.js", //待结算列表
		"accountDetail/*:balanceId": "module/settleaccount/accountDetail.js", //结算单详情
        "settling": "module/settleaccount/settling.js", //结算中列表
        "settleDetail/*:id": "module/settleaccount/settleDetail.js", //汇总单详情
        "modifyInvoice/*:id": "module/settleaccount/addInvoice.js", //填写发票号
		"myBid": "module/bid/bidlist.js", //我的竞价
		"mydone": "module/bid/mydone.js",
		"newslist": "module/news/newsList.js", //消息列表
		"newsdetails/:id": "module/news/newsDetail.js" //消息详情
	}
	var Router = Backbone.Router.extend({
		routes: routerMap
	});
	var router = new Router();

	/*用on接管路由逻辑*/
	router.on('route', function(route, params) {
		require([route], function(controller) {
			if(router.currentController && router.currentController != controller) {
				router.currentController.onRouteChange && router.currentController.onRouteChange();
			}
			router.currentController == controller;
			controller.apply(null, params);

			if($.cookie('id1') == false || $.cookie('id1') == undefined || $.cookie('id1') == '') {

				//登录身份验证
				common.getData("/supp/api/identity", null, callbackValidate, true);

				function callbackValidate(d) {
					if(d.code == "0000") {
						$.cookie('id1', d.user.id, {
							path: '/'
						});
						$.cookie('username1', d.user.fsuppname || d.user.femail, {
							path: '/'
						});
						$.cookie('userEmail1', d.user.femail, {
							path: '/'
						});
						$.cookie('userReal', d.user.fcontactman, {
							path: '/'
						});
						$("#name-provider").html($.cookie('username1'));
					} else if(d.code == "1020") {
						$.cookie("saveSuppLoginUrl", window.location.href, {
							expires: 0.004,
							path: "/"
						});
						common.getOutFun();
					}
				}
			}
		});
	});
	return router;
});