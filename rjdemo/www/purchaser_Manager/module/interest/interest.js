define(['text!module/interest/interest.html', 'text!module/interest/loadHtml.html', 'text!module/interest/storeLoadHtml.html', 'css!module/interest/style/style.css'], function(tpl, loadHTML, storeHtml) {
	var controller = function() {
		var inters = {
			pageNo: 1,
			pageSize: common.pageSize
		};
		var updateGoodsUrl = baseUrl + urls.allUrls.updateInterestGoods;
		var getInterestListUrl = baseUrl + urls.allUrls.getInterestList;
		var getInterestStoreUrl = baseUrl + urls.allUrls.getInterestStore;
		var updateSupplierUrl = baseUrl + urls.allUrls.updateInterestSupplier;
		var commonFun = function(callback, listData) {
			common.postData(getInterestListUrl, listData, callback, true);
		};

		commonFun(callbackInterestFun, inters);

		//页码触发事件
		var pageCallbackFun = function(pageIndexs) {
			inters.pageNo = pageIndexs + 1;
			commonFun(callbackStatusFun, inters);
		};

		/*更新列表函数*/
		var callbackStatusFun = function(dataP) {
			if(dataP.code == "0000") {
				var f = $(".tab-active").attr("data-flag");
				if(f == "goods") {
					if(dataP.products != undefined && dataP.products.length) {
						dataP.flag = true;
						$(".page").removeClass("hide");
						$(".total-page-num").html(dataP.totalPages);
					} else {
						dataP.flag = false;
						$(".page").addClass("hide");
					}
					$("#commodity-list").html(_.template(loadHTML, dataP));
				} else if(f == "store") {
					if(dataP.suppliers != undefined && dataP.suppliers.length) {
						dataP.flag = true;
						$(".page").removeClass("hide");
						$(".total-page-num").html(dataP.totalPages);
					} else {
						dataP.flag = false;
						$(".page").addClass("hide");
					}
					$("#commodity-list").html(_.template(storeHtml, dataP));
				}
				common.pageFun(dataP.pageSize * dataP.totalPages, dataP.pageNo, common.pageSize, pageCallbackFun);
			} else if(dataP.code == "1020") {
				dialog({
					title: '提示',
					modal: true,
					content: dataP.message,
					ok: function() {
						window.location.href = '../purchaser/index.html#login';
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

		function callbackInterestFun(datas) {
			if(datas.code == "0000") {
				if(datas.products != undefined && datas.products.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				$('#right-container').html(_.template(tpl, datas));
				common.tabFocus("我的关注");
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;我的关注</span>");

				//页码
				common.pageFun(datas.pageSize * datas.totalPages, datas.pageNo, common.pageSize, pageCallbackFun);

				//商品/店铺
				$(".interest-commodity-tab,.interest-store-tab").on("click", function() {
					$(".interest-commodity-tab,.interest-store-tab").removeClass("tab-active");
					$(this).addClass("tab-active");
					var flag = $(this).attr("data-flag");
					if(flag == "goods") {
						inters = {
							pageNo: 1,
							pageSize: common.pageSize
						}
						$(".interest-search-input").prop("placeholder", "请输入商品名");
						commonFun(callbackStatusFun, inters);
					} else if(flag == "store") {
						inters = {
							pageNo: 1,
							pageSize: common.pageSize
						};
						$(".interest-search-input").prop("placeholder", "请输入店铺名");
						common.postData(getInterestStoreUrl, inters, callbackStatusFun, true);
					}
				});

				//搜索
				$(".interest-search-link").on("click", function() {
					var isStore = $(".tab-active").attr("data-flag");
					inters.pageNo = 1;
					inters.search = $.trim($(".interest-search-input").val());
					if(isStore == "goods") {
						commonFun(callbackStatusFun, inters);
					} else if(isStore == "store") {
						common.postData(getInterestStoreUrl, inters, callbackStatusFun, true);
					}
				});

				//取消关注
				$("#commodity-list").on("click", ".cancel-interest-link", function() {
					var g = $(".tab-active").attr("data-flag");
					if(g == "goods") {
						var updateData = {
							productSn: $.trim($(this).nextAll(".sn").val()),
							isInteresting: false
						}
						common.postData(updateGoodsUrl, updateData, updatecallback, true);
					} else if(g == "store") {
						var updateData = {
							supplierId: $.trim($(this).nextAll(".sn").val()),
							isInteresting: false
						}
						common.postData(updateSupplierUrl, updateData, updatecallback, true);

					}

					function updatecallback(datas) {
						if(datas.code == "0000") {
							var h = $(".tab-active").attr("data-flag");
							if(h == "goods") {
								commonFun(callbackStatusFun, inters);
							} else if(h == "store") {
								common.postData(getInterestStoreUrl, inters, callbackStatusFun, true);
							}
						} else if(datas.code == "1020") {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {
									window.location.href = '../purchaser/index.html#login';
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
					}

				});

			} else if(datas.code == "1020") {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {
						window.location.href = '../purchaser/index.html#login';
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
		}
	};
	return controller;
});