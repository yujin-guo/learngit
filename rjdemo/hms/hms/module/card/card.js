define(['text!module/card/card.html', 'text!module/card/header.html', 'text!module/card/nav.html', 'text!module/card/loadHtml.html', 'css!module/card/style/card.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));
		
		var departmentId = common.getQueryString("departmentId");

		var cardListData = {
			pageNo: 1,
			pageSize: parseInt(common.pageSize),
			departmentId: parseInt(departmentId)
		};
		var pageIndex = 1;

		var callbackCardFun = function(datas) {
			if(datas.code === "0000") {
				datas.departmentId = departmentId;
				if(datas.fundCards.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}

				//模块内容
				$('#right-container').append(_.template(tpl, datas));

				//页面回调函数
				var callbackPageFun = function(datasP) {
					if(datasP.code === "0000") {
						if(datasP.fundCards.length) {
							datasP.flag = true;
						} else {
							datasP.flag = false;
						}
						$("#list").html(_.template(loadHtml, datasP));
						common.pageFun(datasP.pageSize * datasP.totalPages, datasP.pageNo, datasP.pageSize, pageEvent);
					}
				};

				//页码触发事件
				var pageEvent = function(pageIndexs) {
					cardListData.pageNo = pageIndexs + 1;
					common.postData(testUrl + urls.allUrls.getCardList, cardListData, callbackPageFun, true);
				};

				//页码
				common.pageFun(datas.pageSize * datas.totalPages, datas.pageNo, datas.pageSize, pageEvent);

				//首页/尾页
				common.endsFun(pageIndex, datas.totalPages, pageEvent);

				//查询条件
				$("#search-btn").on("click", function() {
					if($("#search-value").val()) {
						cardListData.status = null;
						cardListData.search = $("#search-value").val();
						common.postData(testUrl + urls.allUrls.getCardList, cardListData, callbackPageFun, true);
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: "请输入查询条件",
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				});
				$("#status-select").on("change", function() {
					cardListData.search = null;
					cardListData.status = parseInt($(this).val());
					common.postData(testUrl + urls.allUrls.getCardList, cardListData, callbackPageFun, true);
				});

				//禁用/启用
				$("#list").on("click", ".status-link-event", function() {
					var statusData = {
						id: parseInt($(this).attr("data-id"))
					};
					var callbackStatusFun = function(dataS) {
						if(dataS.code === "0000") {
							common.postData(testUrl + urls.allUrls.getCardList, cardListData, callbackPageFun, true);
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: dataS.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}
					};
					common.postData(testUrl + urls.allUrls.cardStatus, statusData, callbackStatusFun, true);
				});

				//删除经费卡
				$("#list").on("click", ".delete-link", function() {
					var statusData = {
						id: parseInt($(this).attr("data-id"))
					};
					var callbackStatusFun = function(dataS) {
						if(dataS.code === "0000") {
							common.postData(testUrl + urls.allUrls.getCardList, cardListData, callbackPageFun, true);
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: dataS.message,
								ok: function() {
									common.postData(testUrl + urls.allUrls.deleteCard, statusData, callbackStatusFun, true);
								},
								cancel: true,
							}).width(320).show();

						}
					};
					dialog({
						title: '提示',
						modal: true,
						content: "是否删除该经费卡？",
						ok: function() {
							common.postData(testUrl + urls.allUrls.deleteCard, statusData, callbackStatusFun, true);
						},
						cancel: true,
					}).width(320).show();
				});

			} else if(datas.code === "1020") {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
				window.location.href = "index.html";
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
		common.postData(testUrl + urls.allUrls.getCardList, cardListData, callbackCardFun, true);
	};
	return controller;
});