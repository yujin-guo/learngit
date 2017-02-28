define(['text!module/transaction/return_list.html', 'text!module/transaction/loadReturnList.html', 'module/transaction/transaction', 'module/transaction/laydate.dev', 'css!module/transaction/style/transaction.css?', 'css!module/transaction/style/need/laydate.css?', 'css!module/transaction/style/skins/default/laydate.css?'], function(tpl, returnHtml, deal) {
	var controller = function() {
		var commonFunUrl = function(params, callbackFun) {
			common.postData(baseUrl + urls.allUrls.getReturnList, params, callbackFun, true);
		};
		//var pageIndex = 1;
		var pageNum = common.pageSize;
		var pageIndex = 1;
		var status = parseInt(common.getQueryString("status"));
		var listData = {
			"pageNo": 1,
			"pageSize": 20
		};
		if(status || status === 0) {
			listData.status = status;
		}

		/*初始请求页面*/
		var callbackListFun = function(datas) {
			if(datas.code == "0000") {
				if(datas.orderList != undefined && datas.orderList.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				appView.html(_.template(tpl, datas));

				deal();

				//home页面订单状态
				if(status == 0) {
					$(".control-link").removeClass("active").addClass("list-hover").eq(1).addClass("active");
				}

				$("#refuse-textarea").on("keyup", function() {
					var l = $(this).val();
					$("#num").html(l.length);
				});

				/*页码触发事件函数*/
				var pageEventFun = function(pageIndexs) {
					//console.log("ceshi");
					listData.pageNo = pageIndexs + 1;
					commonFunUrl(listData, callbackPageFun);
				};

				/*页码回调函数*/
				var callbackPageFun = function(datas) {
					if(datas.code == "0000") {
						if(datas.orderList.length) {
							datas.flag = true;
						} else {
							datas.flag = false;
						}
						$("#order-list").html(_.template(returnHtml, datas));
						//$(".total-page-num").text(datas.totalPages);
						common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, datas.pageSize, pageEventFun);

						//首页/尾页
						common.endsFun(pageIndex, datas.totalPages, pageEventFun);
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

				common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEventFun);

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
					listData.fusername = $.trim($("#order-recon").val());
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
					if(tranFlag == 0) {
						listData = {};
						listData.status = 0;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 1) {
						listData = {};
						listData.status = 1;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 4) {
						listData = {};
						listData.status = 4;
						commonFunUrl(listData, callbackPageFun);
					} else if(tranFlag == 5) {
						listData = {};
						listData.status = 5;
						commonFunUrl(listData, callbackPageFun);
					} else {
						listData = {};
						commonFunUrl(listData, callbackPageFun);
					}

				});

				function callbackFun(updateDatas) {
					if(updateDatas.code == '0000') {
						//listData = {};
						commonFunUrl(listData, callbackPageFun);
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
				var dataCommon = {};

				$("#order-list").unbind().on("click", ".event-btn", function(event) {
					event.stopPropagation();
					var dataFlag = $(this).attr("data-flag");
					var dataID = $(this).attr("data-id");
					if(dataFlag == "agree") {
						$(".info-wrap").addClass("show");
						$("h4").text("同意退货");
						$(".change-word").text("退货说明：");
						dataCommon = {
							id: parseInt(dataID),
							goodsReturnOperate: "AGREE"
						};
					} else if(dataFlag == "refuse") {
						$(".info-wrap").addClass("show");
						$("h4").text("请填写拒绝理由");
						$(".change-word").text("*文字说明：");
						dataCommon = {
							id: parseInt(dataID),
							goodsReturnOperate: "REFUSE",
						};
					} else if(dataFlag == "recieve") {
						dataCommon = {
							id: parseInt(dataID),
							goodsReturnOperate: "SUCCESS"
						};
						common.postData(baseUrl + urls.allUrls.updateReturnStatus, dataCommon, callbackFun, true);
					}
				});
				$("body").unbind().on("click", ".sure", function(event) {
					event.stopPropagation();
					dataCommon.picth = $('.refuse-pic-select img').prop("src");
					if(dataCommon.goodsReturnOperate == "AGREE") {
						dataCommon.agreeReason = $.trim($("#refuse-textarea").val());
						$(".info-wrap").removeClass("show");
						common.postData(baseUrl + urls.allUrls.updateReturnStatus, dataCommon, callbackFun, true);
					} else if(dataCommon.goodsReturnOperate == "REFUSE") {
						if(!$.trim($("#refuse-textarea").val())) {
							$("#refuse-textarea").focus();
						} else {
							dataCommon.refuseReason = $.trim($("#refuse-textarea").val());
							$(".info-wrap").removeClass("show");
							common.postData(baseUrl + urls.allUrls.updateReturnStatus, dataCommon, callbackFun, true);
						}

					}

				});

				/*时间控件*/
				laydate({
					elem: '#begin-time'
				});
				laydate({
					elem: '#over-time'
				});
				//菜单栏tab选中
				common.tabFocus("退货管理");

			} else if(datas.code == "1020") {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {
						window.location.href = "../purchaser/index.html#login";
					},
					cancel: false,
				}).width(320).show();
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