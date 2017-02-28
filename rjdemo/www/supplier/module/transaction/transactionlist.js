define(['text!module/transaction/transaction_list.html', 'module/transaction/transaction', 'text!module/transaction/loadLlist.html', 'js/libs/laydate.dev', 'css!module/transaction/style/transaction.css?', 'css!module/transaction/style/need/laydate.css?', 'css!module/transaction/style/skins/default/laydate.css?'], function(tpl, deal, loadHtml) {
	var controller = function() {
		//菜单栏tab选中
		common.tabFocus("订单管理");
		var commonFunUrl = function(params, callbackFun) {
			common.postData(baseUrl + urls.allUrls.getTransactionListUrl, params, callbackFun, true);
		};
		//var pageIndex = 1;
		var pageIndex = 1;
		var pageNum = common.pageSize;
		var status = parseInt(common.getQueryString("status"));
		var listData = {
			"pageNo": 1,
			"pageSize": pageNum
		};
		if(status) {
			listData.status = status;
		}

		/*订单状态更新函数*/
		var changeStatus = function(className) {
			$("." + className).unbind().bind("click", function(event) {
				var callbackFun = function(updateDatas) {
					if(updateDatas.code == '0000') {
						commonFunUrl(listData, callbackListFun);
					} else if(updateDatas.code == "1020") {
						$("#out-provider").click();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: updateDatas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				};

				/*确认订单数据*/
				var orderData = {
					id: parseInt($(this).attr("data-id")),
					orderOperate: "ORDERCONFIRM"
				};

				/*确认收款数据*/
				var accountData = {
					id: parseInt($(this).attr("data-id")),
					orderOperate: "PAYCONFIRM"
				};

				switch($(this).text()) {
					case '确认订单':
						common.postData(baseUrl + urls.allUrls.updateOrderStatus, orderData, callbackFun, true);
						break;
					case '确认收款':
						common.postData(baseUrl + urls.allUrls.updateOrderStatus, accountData, callbackFun, true);
						break;
				}
				event.stopPropagation();

			});
		};

		/*页码触发事件函数*/
		var pageEventFun = function(pageIndexs) {
			//console.log("ceshi");
			listData.pageNo = pageIndexs + 1;
			commonFunUrl(listData, callbackPageFun);
		};

		/*页码回调函数*/
		var callbackPageFun = function(datas) {
			if(datas.code == "0000") {
				if(datas.orderLists != undefined && datas.orderLists.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				$("#order-list").html(_.template(loadHtml, datas));
				$(".total-page-num").text(datas.totalPages);
				common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEventFun);

				/*订单更新*/
				changeStatus("sure");
			} else if(datas.code == "1020") {
				$("#out-provider").click();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		};

		/*初始请求页面*/
		var callbackListFun = function(datas) {
			if(datas.code == "0000") {
				if(datas.orderLists != undefined && datas.orderLists.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				appView.html(_.template(tpl, datas));
				deal();
				common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEventFun);

				//home页面订单状态
				if(status) {
					if(status == 8) {
						$(".control-link").removeClass("active").addClass("list-hover").eq(1).addClass("active");
					} else if(status == 4) {
						$(".control-link").removeClass("active").addClass("list-hover").eq(2).addClass("active");
					} else if(status == 5 || status == 6 || status == 60) {
						$(".control-link").removeClass("active").addClass("list-hover").eq(3).addClass("active");
					}
				}

				/*订单更新*/
				changeStatus("sure");

				/*简单搜索*/
				$("#simple-search").on("click", function() {
					listData = {};
					listData.search = $.trim($("#search-input").val());
					//console.log(listData)
					commonFunUrl(listData, callbackPageFun);
				});

				/*详细搜索*/
				$("#detail-search").on("click", function() {
					listData = {};
					listData.organization = $.trim($("#order-recon").val());
					listData.orderNo = $.trim($("#order-number").val());
					listData.buyer = $.trim($("#order-per").val());
					listData.startDate = $.trim($("#begin-time").val());
					listData.endDate = $.trim($("#over-time").val());
					commonFunUrl(listData, callbackPageFun);
				});

				//筛查订单状态
				$(".control-link").bind("click", function() {
					$(".control-link").removeClass("active").addClass("list-hover");
					$(this).removeClass("list-hover").addClass("active");
					var tranFlag = $(this).attr("data-id");
					if(tranFlag == 11) {
						listData = {};
						listData.status = 110;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 5) {
						listData = {};
						listData.status = 5;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 4) {
						listData = {};
						listData.status = 40;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 8) {
						listData = {};
						listData.status = 8;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 0) {
						listData = {};
						commonFunUrl(listData, callbackPageFun);
					}

				});

				//状态搜索
				$(".status-icon-down").on("click", function() {
					var dl = $(".single-status-absolute");
					var flag = $(this);
					if(flag.hasClass("flag")) {
						flag.removeClass("flag");
						dl.addClass("show");
					} else {
						flag.addClass("flag");
						dl.removeClass("show");
					}
				});
				$(".single-status-absolute").on("click", "dt", function(event) {
					if(!$(".status-icon-down").hasClass("flag")) {
						$(".status-icon-down").addClass("flag");
						$(".single-status-absolute").removeClass("show");
					}
					event.stopPropagation();
					listData = {};
					listData.status = parseInt($(this).attr("data-value"));
					commonFunUrl(listData, callbackPageFun);
				});

				/*时间控件*/
				laydate({
					elem: '#begin-time'
				});
				laydate({
					elem: '#over-time'
				});

			} else if(datas.code == "1020") {
				$("#out-provider").click();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		};
		commonFunUrl(listData, callbackListFun);
	};
	return controller;
});