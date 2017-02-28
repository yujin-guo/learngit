/**
 * Created by liumin on 2016/7/18.
 */
define(function() {
	var currentProtocol = window.location.protocol;
	var currentHost = window.location.host;
	var absPrefix = currentProtocol + "//" + currentHost;
	var pathPrefix = window.location.pathname.split("/").slice(0,-1).join("/");
	var redirect = encodeURIComponent(absPrefix + pathPrefix + "/slo.html");
	return {
		allUrls: {
			outLogin:'/sso/logout?redirect=' + redirect,  //退出登录
			getSystemNotice:'/api/system/notice/findSystemNotice',  // 首页系统公告
			getProductInfo: '/product/getProductInfo', //商品详情信息
			getShoppingCartList: '/user/getShoppingCartList', //购物车详情
			getCartList:'/api/user/shoppingCart/LoadShoppingCart',  //购物车列表
			getProductList: '/api/product/findProduct', //搜索商品/列表
			getProductCategory: '/api/product/category/findCategory', //商品分类
			getFindPassPicCode: '/api/system/GetCaptcha', //图形验证码
			postEmailLink: '/api/user/buyer/ForgotPasswordByEmail', //采购人找回密码第一步
			setNewPassword: '/api/user/buyer/ResetPassword', //设置新密码
			getPasswordMobile: '/api/user/buyer/ForgotPasswordByMobile',  //采购人手机找回密码第一步
			getSupplierEmailLink:'/api/user/supplier/ForgotPasswordByEmail',  //供应商邮件找回密码第一步
			setSuppNewPass:'/api/user/supplier/ResetPassword',  //供应商设置密码
			getSuppPassMobile:'/api/user/supplier/ForgotPasswordByMobile',  //供应商手机找回密码第一步
			login: '/api/login', //采购人登录
			getMobileCode: '/api/system/PinRequest', //获取手机验证码
			purchaseRegister: '/api/user/buyer/BuyerRegister', //采购人注册
			providerRegister:'/api/user/supplier/SupplierRegister',  //供应商注册
			jumpingEmail:'/api/system/emailJumping',  //邮箱跳转
			checkEmailLink:'/api/system/CheckToken',  //邮箱链接失效判断
			providerActive:'/api/user/supplier/SupplierActivate',  //供应商注册激活
			getDetailSearch:'/api/product/findProductPrecise',  //高级搜索
			getAllCate:'/api/product/category/findAllCategoriesProducts',  //全部分类
			updateInterestSupplier:'/api/user/buyer/updateInterestSupplier',  //关注供应商
			getPublicBidList:'/anonymous/order/item/getProcurements',  //竞价列表
			getListDetail:'/anonymous/order/item/getProcurementInfo',  //竞价列表详情
			getBidCommodityDetail:'/anonymous/order/suppbid/getItemAndBidInfo',//竞价商品详情
			getBidCommodity:'/order/suppbid/getProductInfo',  //获取竞价商品
			getSuppCommodity:'/order/suppbid/findProducts',  //供应商商品列表
			hangUpBid:'/order/suppbid/saveOrUpdateBid',  //供应商提交竞价
			updateBidPrice:'/order/suppbid/updateBidStatus',  //供应商放弃竞价
			fileUPload:'/file/upload',  //供应商报价上传文件
			getInformation:"/notice/online_notices",//信息公告
			getInfoDetail:"/notice/detail/",//信息详情
			deleteFromShoppingCart:"/api/user/shoppingCart/DeleteFromShoppingCart",//删除商品
            getRootlist:"/column/helplist",//帮助中心栏目列表
            getonlinesbycolumn:"/notice/getonlinesbycolumn",//帮助中心二级栏目列表
            noticeDetails:"/notice/detail/",  //帮助中心详情
            validateMoble:"/api/user/buyer/UpdateMobile",  //登录手机验证
            validateMobleSupp:"/api/user/supplier/UpdateMobile",  //供应商登录手机验证
            getFundCard:"/api/order/getDepartmentAndFundCard",  //经费卡列表
            addCard: "/api/user/addFundCard" ,//新增经费卡
            matchFundcard:"/api/user/getFCNums",//经费卡匹配
            loadShoppingCard:'/api/order/loadShoppingCard', //购物车商品详情
            getDeliveryAddress:'/api/user/deliveryAddress/GetDeliveryAddress',  //收货地址
            addDeliveryAddress:"/api/user/deliveryAddress/AddDeliveryAddress", //新增收货地址
            deleteDeliveryAddress:"/api/user/deliveryAddress/DeleteDeliveryAddress",//删除地址
            saveToShoppingCart:"/api/user/shoppingCart/SaveToShoppingCart",  //商品数量增减
            updateInterestProduct:"/api/user/buyer/updateInterestProduct", //商品加入关注
            getPurcharseCenter:"/api/user/buyer/BuyerCenter",  //采购人订单
            getSuppCenter:"/api/user/homepage/HomePageMessage",  //供应商订单
            getUserProject:"/api/order/getUserProjectMsg",//浙肿项目信息
            getUserProjectDetail:"/api/order/getUserProjectDetail"//浙肿项目余额情况
		}
	};
});
