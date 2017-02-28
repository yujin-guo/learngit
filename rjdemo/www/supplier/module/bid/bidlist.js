define(['text!module/bid/bidList.html', 'text!module/bid/loadLlist.html', 'module/bid/laydate.dev', 'css!module/bid/style/bid.css?', 'css!module/bid/style/need/laydate.css?', 'css!module/bid/style/skins/default/laydate.css?'], function(tpl, loadHtml) {
	var controller = function() {
		//菜单栏tab选中
		common.tabFocus("我的竞价");

		var commonFunUrl = function(params, callbackFun) {
			common.postData(common.bidBaseUrl + urls.allUrls.getBidList, params, callbackFun, true);
		};
		var pageIndex = 1;
		var listData = {};

		/*页码触发事件函数*/
		var pageEventFun = function(pageIndexs) {
			listData.page = pageIndexs + 1;
			commonFunUrl(listData, callbackPageFun);
		};

		/*页码回调函数*/
		function callbackPageFun(datas) {
			if(datas.resultCode == "0000") {
				if(datas.entities != undefined && datas.entities.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				$("#order-list").html(_.template(loadHtml, datas));
				common.pageFun(datas.totalPage * datas.pageSize, datas.currentPage, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPage, pageEventFun);

			} else if(datas.resultCode == "1001") {
				$("#out-provider").click();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		};

		/*初始请求页面*/
		function callbackListFun(datas) {
			if(datas.resultCode == "0000") {
				if(datas.entities != undefined && datas.entities.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				appView.html(_.template(tpl, datas));
				common.pageFun(datas.totalPage * datas.pageSize, datas.currentPage, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPage, pageEventFun);

				/*简单搜索*/
				$("#simple-search").on("click", function() {
					listData = {};
					listData.search = $.trim($("#search-input").val());
					commonFunUrl(listData, callbackPageFun);
				});

				//交易管理“更多”
				$(".more-content").attr("flag", "true").hide();
				$(".transaction-header-more").click(function() {
					if($(".more-content").attr("flag") == "true") {
						$(this).text("收起").nextAll(".direction-icon").css("background-position", "-343px -29px");
						$(".more-content").attr("flag", "false").show();
					} else {
						$(this).text("更多").nextAll(".direction-icon").css("background-position", "-300px -29px");
						$(".more-content").attr("flag", "true").hide();
					}
				});

				/*详细搜索*/
				$("#detail-search").on("click", function() {
					listData = {};
					listData.deptName = $.trim($("#order-recon").val());
					listData.sn = $.trim($("#order-number").val());
					//listData.buyer = $.trim($("#order-per").val());
					listData.startTime = $.trim($("#begin-time").val());
					listData.endTime = $.trim($("#over-time").val());
					commonFunUrl(listData, callbackPageFun);
				});

				//筛查订单状态
				$(".control-link").bind("click", function() {
					$(".control-link").removeClass("active").addClass("list-hover");
					$(this).removeClass("list-hover").addClass("active");
					var dataFlag = $(this).attr("data-flag");
					if(dataFlag == 1) {
						listData = {};
						listData = {
							status: 1
						}
						commonFunUrl(listData, callbackPageFun);
					} else if(dataFlag == 0) {
						listData = {};
						listData = {
							status: 0
						}
						commonFunUrl(listData, callbackPageFun);
					} else {
						listData = {};
						commonFunUrl(listData, callbackPageFun);
					}

				});

				/*时间控件*/
				laydate({
					elem: '#begin-time'
				});
				laydate({
					elem: '#over-time'
				});
			} else if(datas.resultCode == "1001") {
				$("#out-provider").click();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		};
		commonFunUrl(listData, callbackListFun);
	};
	return controller;
});