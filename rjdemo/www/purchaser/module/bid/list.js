define(["text!module/bid/list.html", "text!module/header/bidHeader.html", "text!module/header/bidnavigation.html", "text!module/bid/loadHtml.html", "css!module/bid/style/bid.css"], function(tpl, header, nav, loadHtml) {
	var controler = function() {
		var bidBaseUrl = common.bidBaseUrl;
		var bidUrl = bidBaseUrl + urls.allUrls.getPublicBidList;

		var data = {
			status: 1
		}

		common.postData(bidUrl, data, getListCallbackFun, true);

		function pageCallback(page) {
			data.page = page + 1;
			common.postData(bidUrl, data, conditionCallback, true);
		}

		function conditionCallback(d) {
			if(d.resultCode === "0000") {
				if(d.entities != undefined && d.entities.length) {
					d.flag = true;
				} else {
					d.flag = false;
				}
				d.nav = header + nav;
				$("#bid-content-table").html(_.template(loadHtml, d));

				$(".total-page-num").html(d.totalPage);
				$(".bread-link").html($(".bid-head-cell-active").text());
				if(d.flag == false) {
					$(".bid-content-wrap").css("border", "none");
					$(".page-wrap").css("display", "none");
				} else {
					$(".bid-content-wrap").css("border", "1px solid #f2f2f2");
					$(".page-wrap").css("display", "block");
				}

				//页码
				common.pageFun(d.pageSize * d.totalPage, d.currentPage, d.pageSize, pageCallback);
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: d.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();

			}
		}

		function getListCallbackFun(datas) {
			if(datas.resultCode === "0000") {
				if(datas.entities != undefined && datas.entities.length) {
					datas.flag = true;
				} else {
					datas.flag = false;
				}
				datas.nav = header + nav;
				$("#container").html(_.template(tpl, datas));

				//采购人/供应商/未登录的导航头部判断
				if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
					$("#f").css({
						"display": "inline-block"
					});
					$("#s").css({
						"display": "none"
					});
				} else {
					$("#f").css({
						"display": "none"
					});
					$("#s").css({
						"display": "inline-block"
					});
				}

				if(datas.flag == false) {
					$(".bid-content-wrap").css("border", "none");
					$(".page-wrap").css("display", "none");
				} else {
					$(".bid-content-wrap").css("border", "1px solid #f2f2f2");
					$(".page-wrap").css("display", "block");
				}

				//页码
				common.pageFun(datas.pageSize * datas.totalPage, datas.currentPage, datas.pageSize, pageCallback);

				/*竞价状态*/
				$(".bid-content-head-cell").on("click", function() {
					$(this).addClass("bid-head-cell-active");
					$(this).siblings(".bid-content-head-cell").removeClass("bid-head-cell-active");

					if($(this).attr("data-flag") == "going") {
						data = {
							status: 1
						}
						common.postData(bidUrl, data, conditionCallback, true);

					} else {
						data = {
							status: 0
						}
						common.postData(bidUrl, data, conditionCallback, true);
					}
				});

				//搜索
				$("#search-btn").on("click", function() {
					if($.trim($(".bid-search-box").val())) {
						data.search = $.trim($(".bid-search-box").val());
						common.postData(bidUrl, data, conditionCallback, true);

					}
				});
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
	return controler;
});