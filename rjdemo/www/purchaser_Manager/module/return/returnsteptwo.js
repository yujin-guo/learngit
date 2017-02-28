define(['text!module/return/returnSteptwo.html', 'text!module/header/header01.html', 'css!module/return/style/return.css'], function(tpl, header) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveLoginUrl", '', {
			path: "/"
		});

		var base = common.serverBaseUrl,
			url = base + "/api/order/getGoodsReturnInfo", //获取退货详情
			data = {
				detailId: decodeURIComponent(common.getQueryString("id"))
			},
			returnOrder, //退货订单对象
			callback = function(r) {
				if(r.code == "0000") {
					var data = {
						header: header,
						main: r.goodsReturnInfo.order,
						details: r.goodsReturnInfo.orderDetail,
						returned: r.goodsReturnInfo.goodsReturn
					};
					//判断退货单状态跳转页面
					function skip() {
						var status = r.goodsReturnInfo.orderDetail.returnStatus; //退货单状态
						var itemId = data.details.id;
						if(status == 3 || status === 6) {
							window.location.href = "#returnlist";
							window.location.reload();
							return false;
						}
						if(status != 0 && status != 2) {
							window.location.href = "#returnstepthree?itemId=" + encodeURIComponent(itemId);
						}
					}
					skip();
					returnOrder = {
						id: _.last(data.returned).returnId, //退货表id
						orderId: data.main.id, //订单id
						itemId: decodeURIComponent(common.getQueryString("id")), //退货商品id
					};
					appView.html(_.template(tpl, data));
					$(".content-container").hide();
					eventsBind();
				} else if(r.code == "1020") {
					$.cookie("saveLoginUrl", window.location.href, {
						expires: 0.004,
						path: "/"
					});
					common.getOutFun();
				}
			};
		common.postData(url, data, callback, true)

		function eventsBind() {
			/*cookie信息*/
			if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
				$("#user-nav").append("<a href='../purchaser_Manager/index.html' id='user-name'>" + $.cookie('username') +
					"</a><a href='javascript:void(0)' class='pd-lf-8' id='out'>退出</a>")
				if($("#login")) {
					$("#login").remove();
				}
			} else {
				$("#user-nav").append("<a href='#login' id='login'>登录</a><em class='pd-lf-10 pd-rg-10'>|</em><a href='#providerfirst?key=login'>供应商注册</a>");
			}
			/*退出登录*/
			$("#out").on("click", function() {
				common.getOutFun();
			});
			//留言板倒置
			var messages = $(".return-handle-bottom").get().reverse();
			$("#returnMessage").html();
			_.each(messages, function(i) {
					$("#returnMessage").append(i);
				})
				//面包屑返回退货单
			$(".return-list").bind("click", function() {
					window.location.href = "#returnlist";
					window.location.reload();
				})
				//修改退货申请
			$("#returnRevise").bind("click", function() {
					window.location.href = "#returnstepone?returnOrderId=" + encodeURIComponent(returnOrder.id) + "&orderId=" + encodeURIComponent(returnOrder.orderId) + "&itemId=" + encodeURIComponent(returnOrder.itemId)
				})
				//撤销退货申请
			$("#returnCancel").bind("click", function() {
				var url = base + "/api/order/updateGoodsReturnStatus",
					data = {
						id: returnOrder.id,
						goodsReturnOperate: "CANCEL",
					},
					callback = function(r) {
						if(r.code == "0000") {
							dialog({
								title: '提示',
								modal: true,
								content: '已撤销退货申请',
								ok: function() {
									window.location.href = "#order";
									window.location.reload();
								},
								cancel: false,
							}).width(320).show();

						}

					};
				common.postData(url, data, callback, true)
			})
		}

	}
	return controller;
});
