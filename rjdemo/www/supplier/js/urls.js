define(function() {
	var currentProtocol = window.location.protocol;
	var currentHost = window.location.host;
	var absPrefix = currentProtocol + "//" + currentHost;
	var loginPathPrefix = window.location.pathname.split("/").slice(0,-2).join("/");
	var redirect = encodeURIComponent(absPrefix + loginPathPrefix + "/supplier/slo.html");
	return {
		allUrls: {
			outLogin:'/sso/logout?redirect=' + redirect,  //退出登录
            homePageMessage:'/api/user/homepage/HomePageMessage', //供应商首页
            accreditationStatus:'/api/user/accreditationStatus', //供应商认证状态
			getProviderPerson:"/api/user/supplier/GetSupplierInfo",  //供应商基本信息详情
            findCategory:"/api/product/category/findCategory", //商品类别
            findOrg:"/api/org/findOrg", //供应商入驻医院
            findAllCategories:"/store/api/product/category/findAllCategories", //商品一二级分类
            getBrandList:"/api/brand/getBrandList", //品牌列表
			getMobileCodeUrl: "/api/system/PinRequest", //获取手机验证码
			editPersonUrl:"/api/user/supplier/UpdateSupplierinfo",  //修改基本信息
			editPasswordUrl:"/api/user/supplier/UpdatePassword",  //修改密码
			getTransactionListUrl:"/api/order/getOrderList",  //订单列表
			getOrderDetail:'/api/order/getOrderInfo',  //订单详情
			updateOrderStatus:'/api/order/updateOrderStatus',  //更新订单状态
			getReturnList:'/api/order/getGoodsReturnList',  //退货列表
			getReturnDetail:'/api/order/getGoodsReturnInfo',  //退货单详情
			updateReturnStatus:'/api/order/updateGoodsReturnStatus',  //更新退货单状态
			getAddressInfo:'/api/order/getAddress',  //获取地址信息
			changeAddress:'/api/order/updateAddressOfOrder',  //订单修改收货地址
			getAccessment:'/api/order/getProductCommentList',  //评价列表
			getAccessmentDetail:'/api/order/getProductCommentBaseInfo',  //评价详情
			getAccDetList:'/api/order/getProComInfoList',  //评价详情里的评价列表
            orgAuthList:'/api/org/orgAuthList', //医院列表
            orgAuthInfo:'/api/org/orgAuthInfo',  //医院入驻信息查询
            orgApp:'/api/org/orgApp', //申请入驻医院
			getBidList:'/order/item/getSuppProcurements',  //竞价列表
			getDoneBidList:'/order/item/getBeChooseProcurements',  //中标列表
			getProductInfo:'/api/product/getProductInfo',//商品详情
            saveProduct:"/api/product/saveProduct", //保存商品
            getOrgs:'/api/system/GetOrgs',//得到供应商入驻的医院
            getPurchaseDepartments:'/api/system/GetPurchaseDepartments', //得到入驻医院的采购部门
            getStatement:'/api/user/statement/GetStatement',//查询结算单
            submitSummary:'/api/user/summary/SubmitSummary',  //生成汇总单
            getInfoForSubmitSummary:'/api/user/summary/GetInfoForSubmitSummary',//提交汇总时返回的数据
            getSummaries:'/api/user/summary/GetSummaries',  //汇总单列表
            printSummary:'/api/user/summary/Print',//打印汇总单
            getSummary:'/api/user/summary/GetSummary',//汇总单详情
            deleteSummary:'/api/user/summary/DeleteSummary', //移除汇总单
            fillInInvoice:'/api/user/summary/FillInInvoice',//填写发票时弹出窗口所返回的数据
            addOrRemoveInvoice:'/api/user/summary/AddOrRemoveInvoice', //添加或者修改发票号
            getAccreditationInfo:'/api/user/accreditationInfo',  //资质认证详情
            updateStatus:'/api/user/summary/UpdateStatus', //更改汇总单状态
            addSuppBank:'/api/user/summary/AddSuppBank', //添加供应商开户行账号
            getSuppBank:"/api/user/summary/GetSuppBank"  //得到供应商开户行账号列表
		}
	};
});
