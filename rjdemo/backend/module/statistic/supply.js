define(['text!module/statistic/supply.html', "text!module/statistic/header.html", "text!module/statistic/nav.html", "text!module/statistic/loadSupply.html", "css!module/statistic/style/statistic.css", "js/libs/laydate.dev"], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		appView.html(_.template(header));
		var suppStatisticUrl = omsUrl + urls.allUrls.suppStatistic,
			suppStatisticListUrl = omsUrl + urls.allUrls.suppStatisticList,
			pageSize = common.pageSize,
			currentPage = 1,
			requestData = {
				pageSize: pageSize,
				currentPage: currentPage,
                startTime:Date.parse(common.getOneMonthDate()),
                endTime:Date.parse(common.getDate())
			};

		function pageEventFun(pageIndex) {
			requestData.currentPage = pageIndex + 1;
			common.postData(suppStatisticListUrl, requestData, updateCallbackFun, true, false);
		}

		function updateCallbackFun(r) {
			if(r.resultCode == "0000") {
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#list").html(_.template(loadHtml, r));
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"),$(".nav-left"),$(".content-height"));
			} else if(r.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}
		common.postData(suppStatisticUrl, null, statisticCallbackFun, true, false);

		function statisticCallbackFun(d) {
			if(d.resultCode == "0000") {
				this.d = d;
				callback.apply(this, arguments);
				common.postData(suppStatisticListUrl, requestData, callback, true, false);
			} else if(d.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: d.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}

		function callback(r) {
			if(r.resultCode == "0000") {
				r.d = this.d;
				r.nav = nav;
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#right-container").html(_.template(tpl, r));
				$(".secondary-title").eq(1).addClass("secondary-active").siblings().removeClass("secondary-active");
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"),$(".nav-left"),$(".content-height"));
				eventBind();
			} else if(r.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}

		function eventBind() {
			//搜索功能
			$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
				(search || $.trim($("#startDate").val()) || $.trim($("#endDate").val())) ? (function() {
					requestData = {
						pageSize: pageSize,
						currentPage: currentPage,
						queryString: search||null,
						startTime: $.trim($("#startDate").val()) ? Date.parse($.trim($("#startDate").val())) : null,
						endTime: $.trim($("#endDate").val()) ? Date.parse($.trim($("#endDate").val())) : null
					};
					common.postData(suppStatisticListUrl, requestData, updateCallbackFun, true, false);
				})() : (function() {
					dialog({
						title: '提示',
						modal: true,
						content: "请至少输入一个查询条件",
						ok: function() {},
						cancel: false
					}).width(320).show();
				})();

			});
			$("#search-value").keydown(function(e) {
				if(e.keyCode == 13) {
					$(".search-btn").click();
				}
			});

			//首页和末页
			$(".endpoint").bind("click", function() {
				switch($(this).text()) {
					case "首页":
						$("#pagination .prev").next().click();
						break;
					case "尾页":
						$("#pagination .next").prev().click();
						break;
				}
			});

			//时间控件
			laydate({
				elem: '#startDate'
			});
			laydate({
				elem: '#endDate'
			})
		}

	};
	return controller;
});