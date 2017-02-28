define(['text!module/transaction/accessment.html', 'text!module/transaction/accessLoadHtml.html', 'css!module/transaction/style/transaction.css'], function(tpl, loadHtml) {
	var controller = function() {
		//菜单栏tab选中
		common.tabFocus("评价管理");
		var commonFunUrl = function(params, callbackFun) {
			common.postData(baseUrl + urls.allUrls.getAccessment, params, callbackFun, true);
		};
		var listData = {};
		var pageIndex = 1;
		var pageNum = common.pageSize;

		/*页码触发事件函数*/
		var pageEventFun = function(pageIndexs) {
			listData.pageNo = pageIndexs + 1;
			commonFunUrl(listData, callbackPageFun);
		};

		/*页码回调函数*/
		var callbackPageFun = function(datas) {
			if(datas.code == "0000") {
				if(datas.orderList != undefined && datas.orderList.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				$("#accessment-list").html(_.template(loadHtml, datas));
				$(".total-page-num").text(datas.totalPages);
				common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEventFun);

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
				if(datas.orderList != undefined && datas.orderList.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				appView.html(_.template(tpl, datas));

				common.pageFun(datas.totalPages * datas.pageSize, datas.pageNo, datas.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEventFun);

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