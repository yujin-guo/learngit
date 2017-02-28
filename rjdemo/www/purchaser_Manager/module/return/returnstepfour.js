define(['text!module/return/returnStepfour.html', 'text!module/header/header01.html', 'css!module/return/style/return.css'], function(tpl, header) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveLoginUrl", '', {
			path: "/"
		});

		var base = common.serverBaseUrl,
			url = base + "/api/order/getGoodsReturnInfo", //获取退货详情
			data = {
				detailId: decodeURIComponent(common.getQueryString("itemId")),
			},
			status, //退货订单对象
			callback = function(r) {
				if(r.code == "0000") {
					var data = {
						header: header,
						main: r.goodsReturnInfo.order,
						details: r.goodsReturnInfo.orderDetail,
						returned: r.goodsReturnInfo.goodsReturn
					};
					status = data.details.returnStatus;
					if(status == 3 || status === 6) {
						window.location.href = "#returnlist";
						window.location.reload();
						return false;
					};
					appView.html(_.template(tpl, data));

					$(".content-container").hide();
					//面包屑返回退货单
					$(".return-list").bind("click", function() {
							window.location.href = "#returnlist";
							window.location.reload();
						})
						//留言板倒置
					var messages = $(".return-handle-bottom").get().reverse();
					$("#returnMessage").html();
					_.each(messages, function(i) {
						$("#returnMessage").append(i);
					});
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
					/* 收藏本页 */
					$("#shoucang").bind("click", function() {
						var title = document.title;
						var URL = document.URL;
						try {
							window.external.addFavorite(URL, title); //ie
						} catch(e) {
							try {
								window.sidebar.addPanel(title, URL, ""); //firefox
							} catch(e) {
								dialog({
									title: '提示',
									modal: true,
									content: '加入收藏失败，请使用Ctrl+D进行添加',
									ok: function() {},
									cancel: false,
								}).width(320).show(); //chrome opera safari
							}
						}
					});
				} else if(r.code == "1020") {
					$.cookie("saveLoginUrl", window.location.href, {
						expires: 0.004,
						path: "/"
					});
					common.getOutFun();
				}
			};
		common.postData(url, data, callback, true);
	}
	return controller;
});
