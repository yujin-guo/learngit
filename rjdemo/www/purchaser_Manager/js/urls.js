define(function() {
	var currentProtocol = window.location.protocol;
	var currentHost = window.location.host;
	var absPrefix = currentProtocol + "//" + currentHost;
	var loginPathPrefix = window.location.pathname.split("/").slice(0,-2).join("/");
	var redirect = encodeURIComponent(absPrefix + loginPathPrefix + "/purchaser/slo.html");
	return {
		allUrls: {
			outLogin:'/sso/logout?redirect=' + redirect,  //退出登录
			getPurcharseCenter:"/api/user/buyer/BuyerCenter",  //采购人中心
            getPurchaseCenterBid:"/order/getCountPros",//获取采购人中心相关竞价数目
			getInterestList:"/api/user/buyer/getInterestProductList",  //关注商品列表
			updateInterestGoods:"/api/user/buyer/updateInterestProduct",  //更新商品关注
			getInterestStore:"/api/user/buyer/getInterestSupplierList",  //关注的供应商列表
			updateInterestSupplier:"/api/user/buyer/updateInterestSupplier",  //更新供应商关注
			getPurcharseMessage:"/api/user/message/GetMessages",  //系统消息
			getMessageDetail:"/api/user/message/GetMessagesDetail",  //消息详情
			getPurcharseList:"/api/order/getPurchaseApplyList",  //采购清单
			getPurcharseDetail:"/api/order/getPurchaseApplyInfo",  //采购单详情
			getPurchaseCardList:"/api/order/getFundCards",  //获取采购单经费卡信息
			updatePurchaseCard:"/api/order/updatePurchaseApplyOfFC",  //修改采购单经费卡信息
			getAddressList:"/api/user/deliveryAddress/GetDeliveryAddress",  //收货地址列表
			setDefaultAddress:"/api/user/deliveryAddress/SetAsDefault",  //设置默认地址
			deleteAddress:"/api/user/deliveryAddress/DeleteDeliveryAddress",  //删除地址
			getSimpleAddress:"/api/user/deliveryAddress/GetDeliveryAddressDetail",  //获取编辑地址详情
			editAddress:"/api/user/deliveryAddress/UpdateDeliveryAddress",  //保存编辑地址信息
			createAddress:"/api/user/deliveryAddress/AddDeliveryAddress",  //新增收货地址
			getPurcharsePerson:"/api/user/buyer/GetBuyer",  //基本信息详情
			getCode:"/api/system/PinRequest",  //获取验证码
			editMobile:"/api/user/buyer/UpdateMobile",  //修改手机号码
			editPhone:"/api/user/buyer/UpdateTelephone",  //修改固定电话
			editEmail:"/api/user/buyer/UpdateEmail",  //修改邮箱
			editPassword:"/api/user/buyer/UpdatePassword",  //修改密码
			getFundCard:"/api/order/getDepartmentAndFundCard",  //经费卡列表
			getCartList:'/api/user/shoppingCart/LoadShoppingCart',  //购物车列表
            saveBid:'/order/save', //保存竞价单
            getBid:'/order/item/getItemList', //获取竞价单含商品项
            getBasicBid:'/order/basic/', //获取竞价单基本信息
            bidaddOrUpdateItem:'/order/item/addOrUpdateItem', //添加或修改商品
            delBid:'/order/item/delItem', //删除商品
            getItemInfo:"/order/item/getItemInfo",  //查看商品
            getBidList:"/order/list/my/status",  //获取竞价列表
            getBidDetails:"/order/detail/",  //获取竞价详情
            submitBid:"/approval/first/",  //提交初审
            commentList:'/api/order/getComments',  //我的评价列表
            getOrderList:'/api/order/getOrderListForWWW',  //订单列表
            getDeptList:'/common/dept/list',  //获取部门列表
            deleteBid:"/order/del/",  //删除草稿竞价单
            supplierSelected:"/order/item/operation",  //初选提交
            addCard:"/api/user/shoppingCart/SaveToShoppingCart" , //加入购物车
            revokeBid:"/order/revokePro",  //竞价撤回申请
            addFundcard:"/api/user/addFundCard",  //增加经费卡
            matchFundcard:"/api/user/getFCNums",  //经费卡匹配
            updateOrderStatus:"/api/order/updateOrderStatus",  //更改订单状态
            getSYXStatements:"/api/user/statement/GetSysulifeStatements",  //孙逸仙医院结算列表
            getStatements:"/api/user/statement/GetStatement",  //其他医院的结算列表
            multiPrint:"/api/user/statement/multiPrint",  //打印验收单
            getStatementDetails:"/api/user/statement/GetStatementDetail",  //其它医院结算详情
            getSYXStatementDetails:"/api/user/summary/summaryInfo",  //孙逸仙医院结算汇总单详情
            getSYXStatementDetails2:"/api/user/statement/statementInfo",  //孙逸仙医院结算单详情
            updateSYXStatus:"/api/user/summary/UpdateStatus",  //孙逸仙结算列表状态变更
            getSYXSuppliers:"/api/user/statement/GetSysulifeStatements",  //孙逸仙结算单列表
            getSYXInvoice:"/api/user/summary/summaryInvoiceInfo",  //孙逸仙发票接收页面
            addSYXInvoice:"/api/user/summary/addSummaryInvoice",  //添加发票清单操作
            matchSYXInvoice:"/api/user/summary/getSummaryNos",  //发票清单匹配
            getSuppliers:"/api/system/GetSuppliers",  //获取供应商列表
            SYXprint:'/api/user/summary/printStorage',  //打印出入库单
            uploadFile:'/api/common/file/Upload',  //文件图片上传
            addInvoicePic:'/api/user/summary/addInvoicePic',  //发票图片保存
            getNoBanOrders:'/api/user/statement/GetNotBanlanceOrders',  //待结算列表
            getDeptsW:'/api/order/getDeptsW',  //部门列表
            getOrderCard:'/api/order/getFundCardForOrder',  //获取订单经费卡
            updateOrderCard:'/api/order/updateFundCardForOrder',  //更新订单经费卡
            submitStatement:'/api/user/statement/SubmitStatement'  //提交结算地址

		}
	};
});
