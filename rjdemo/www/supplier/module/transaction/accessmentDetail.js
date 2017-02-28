define(['text!module/transaction/accessmentDetail.html', 'text!module/transaction/loadAccDetail.html', 'css!module/transaction/style/transaction.css'], function(tpl, loadHtml) {
	var controller = function(sn) {
		//菜单栏tab选中
		common.tabFocus("评价管理");
		var getAccDetList = urls.allUrls.getAccDetList;
		var getAccessmentDetail = urls.allUrls.getAccessmentDetail;
		var commonFunUrl = function(params, callbackFun, url) {
			common.postData(baseUrl + url, params, callbackFun, true);
		};
		var listData = {
			productSn: sn
		};
		var pageIndex = 1;
		var pageNum = common.pageSize;
		var collect = null;

		/*页码触发事件函数*/
		var pageEventFun = function(pageIndexs) {
			listData.pageNo = pageIndexs + 1;
			commonFunUrl(listData, callbackFun, getAccDetList);
		};

		/*页码回调函数*/
		var callbackPageFun = function(r) {
			if(r.code == "0000") {
				if(r.proComs != undefined && r.proComs.length) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				$("#accessment-list").html(_.template(loadHtml, r));
				$(".total-page-num").text(r.totalPages);
				common.pageFun(r.totalPages * r.pageSize, r.pageNo, r.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, r.totalPages, pageEventFun);

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
		var callbackFun = function(r) {
			if(r.code == "0000") {
				if(r.proComs != undefined && r.proComs.length) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				r.collect = collect;
				appView.html(_.template(tpl, r));

				common.pageFun(r.totalPages * r.pageSize, r.pageNo, r.pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageIndex, r.totalPages, pageEventFun);
			} else if(r.code == "1020") {
				$("#out-provider").click();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		};
		var callbackListFun = function(datas) {
			if(datas.code == "0000") {
				collect = datas;
				listData.pageSize = pageNum;
				commonFunUrl(listData, callbackFun, getAccDetList);
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

		commonFunUrl(listData, callbackListFun, getAccessmentDetail);
	};
	return controller;
});