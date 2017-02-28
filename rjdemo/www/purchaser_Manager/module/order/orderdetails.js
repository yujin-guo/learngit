define(["text!module/order/alert.html", "text!module/order/orderDetails.html", 'css!module/order/style/orderDetails.css', ], function(alertHtml, orderDetails) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveLoginUrl", '', {
			path: "/"
		});

		var url = common.serverBaseUrl + "/api/order/getOrderInfo", //订单详情请求地址
			data = {
				id: common.getQueryString("id")
			},
			callback = function(r) {
				if(r.code == "0000") {
					var returned = []; //退货中的商品
					var details = []; //未退货商品
					_.each(r.orderInfo.orderDetails, function(i, index) {
						if(i.hasOwnProperty("returnStatus") && i.returnStatus == 0 || i.returnStatus == 1 || i.returnStatus == 2 || i.returnStatus == 4 || i.returnStatus == 5) {
							returned.push(i);
						} else {
							details.push(i);
						}
					});
					var orderData = {
						r: r.orderInfo.order,
						details: details,
						status: r.orderInfo.order.status,
						returned: returned
					};
					$("#right-container").html(_.template(orderDetails, orderData));

					//面包屑导航
					$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#order' class='purchase-bread'>我的订单</a></span><span class='bread-span'>&gt;&nbsp;订单详情</span>");
				} else if(r.code == "1020") {
					$.cookie("saveLoginUrl", window.location.href, {
						expires: 0.004,
						path: "/"
					});
					common.getOutFun();
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {
							$("#outLogin").click();
						},
						cancel: false,
					}).width(320).show();
				}
			};
		common.postData(url, data, callback, true);
	}
	return controller;
});