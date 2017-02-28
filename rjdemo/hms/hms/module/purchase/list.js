define(['text!module/purchase/list.html', 'text!module/purchase/header.html', 'text!module/purchase/nav.html', 'text!module/purchase/listLoad.html', 'text!module/purchase/detail.html', 'js/libs/jquery.validate.min', 'css!module/purchase/style/purcharse.css?'], function(tpl, header, nav, loadHtml, detailHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		var pageSize = common.pageSize;
		var pageIndex = 1;
		var statusFlag = common.getQueryString("status");
		var commonFun = function(listData, callback) {
			common.postData(testUrl + urls.allUrls.getPurcharseList, listData, callback, true);
		};
		var listData = {
			pageNo: pageIndex,
			pageSize: pageSize,
		};
		if(statusFlag) {
			listData.status = statusFlag;
		}

		/*初始化回调函数*/
		var callbackListFun = function(datas) {
			if(datas.code == "0000") {
				//console.log(datas.purchaseApplys.length);
				if(datas.purchaseApplys.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				datas.nav = nav;
				$('#right-container').html(_.template(tpl, datas));
				//判断从详情里面查询的订单状态
				if(statusFlag) {
					$(".secondary-title").removeClass("secondary-active");
					$(".purchase-status-0" + statusFlag).parent().addClass("secondary-active");
				}
				
				/*页码回调函数*/
				var callbackPageFun = function(pageIndexs) {
					listData.pageNo = pageIndexs + 1;
					commonFun(listData, callbackChangeFun);
				};

				/*页码*/
				common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, pageSize, callbackPageFun);

				/*首页/尾页*/
				common.endsFun(pageIndex, datas.totalPages, callbackPageFun);

				/*改变状态时的回调函数*/
				var callbackChangeFun = function(datasC) {
					if(datasC.code == "0000") {
						if(datasC.purchaseApplys.length) {
							//console.log("页码")
							datasC.flag = true;
							$("#list").html(_.template(loadHtml, datasC));
							common.pageFun(datasC.totalPages * datasC.pageSize, datasC.pageNo, pageSize, callbackPageFun);

							/*首页/尾页*/
							common.endsFun(pageIndex, datasC.totalPages, callbackPageFun);
						} else {
							datasC.flag = false;
							$("#list").html(_.template(loadHtml, datasC));
						}
					} else if(dataC.code == "0002") {
						window.location.href = testUrl + urls.allUrls.outLogin;
					}

				};

				//次级导航
				$(".secondary-nav").on("click", "a", function() {
					$(".secondary-title").removeClass("secondary-active");
					$(this).parent().addClass("secondary-active");
					var flagText = $(this).text();
					var status = $(this).attr("data-status");
					if(status == "0") {
						listData = {};
						commonFun(listData, callbackChangeFun);
					} else if(status == "1") {
						listData = {};
						listData.status = 1;
						commonFun(listData, callbackChangeFun);
					} else if(status == "4") {
						listData = {};
						listData.status = 4;
						commonFun(listData, callbackChangeFun);
					} else if(status == "3") {
						listData = {};
						listData.status = 3;
						commonFun(listData, callbackChangeFun);
					}
				});

				//状态搜索
				$("#purchase-div").on("change", ".purchase-select", function() {
					var search = $.trim($("#search-value").val());
					listData = {};
					search ? listData.search = search : null;
					listData.status = $(this).val();
					commonFun(listData, callbackChangeFun);
				});

				/*搜索*/
				$("#purchase-div").on("click", "#search-btn", function() {
					$("#purchase-div .purchase-select").val("all");
					listData = {};
					listData.search = $.trim($("#search-value").val());
					//listData.status=1;
					commonFun(listData, callbackChangeFun);
				});

				$("#search-value").keydown(function(event) {
					if(event.keyCode == 13) {
						$("#search-btn").click();
					}
				});
			} else if(datas.code == "1020") {
				common.getOutFun();
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
		commonFun(listData, callbackListFun);

	};
	return controller;
});