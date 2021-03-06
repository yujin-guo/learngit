define(['text!module/statistic/hosDetail.html', "text!module/statistic/header.html", "text!module/statistic/nav.html", "text!module/statistic/loadSubject.html", "css!module/statistic/style/statistic.css", "js/libs/laydate.dev"], function(tpl, header, nav, loadHtml) {
	var controller = function(id) {
		appView.html(_.template(header));
		var hospitalStatisticUrl = omsUrl + urls.allUrls.hospitalStatistic + '/' + id,
			hospitalStatisticDetailListUrl = omsUrl + urls.allUrls.hospitalStatisticList,
			pageSize = common.pageSize,
			currentPage = 1,
			requestData = {
				pageSize: pageSize,
				currentPage: currentPage,
				type: 0,
				orgId: parseInt(id),
				startDate: Date.parse(common.getWeekDate()),
				endDate: Date.parse(common.getDate())
			},
			f = null;

		function pageEventFun(pageIndex) {
			requestData.currentPage = pageIndex + 1;
			commonFun();
		}

		function updateCallbackFun(r) {
			if(r.resultCode == "0000") {
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#list").html(_.template(loadHtml, r));
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"), $(".nav-left"), $(".content-height"));
				eventFun(r.entities);
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

		function commonFun() {
			common.postData(hospitalStatisticDetailListUrl, requestData, updateCallbackFun, true, false);
		}

		common.postData(hospitalStatisticUrl, null, statisticCallbackFun, true, false);

		function statisticCallbackFun(d) {
			if(d.resultCode == "0000") {
				/*this.d = d;
				callback.apply(this, arguments);*/
				f = d;
				common.postData(hospitalStatisticDetailListUrl, requestData, callback, true, false);
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
				r.d = f;
				r.nav = nav;
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#right-container").html(_.template(tpl, r));
				$(".secondary-title").eq(0).addClass("secondary-active").siblings().removeClass("secondary-active");
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"), $(".nav-left"), $(".content-height"));
				eventBind();
				eventFun(r.entities);
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

		function eventFun(t) {
			var time = [],
				orderNumber = [],
				orderAmount = [],
				//accountAmount = [],
				purchaseNumber = [],
				purchaseAmount = [],
				bidNumber = [],
				bidAmount = [],
				data = [],
				resultData = [];

			//改变返回的json数据顺序
			function compareFun(a, b) {
				return a - b;
			}
			$.each(t, function(key, value) {
				data.push(value['date']);
			});
			data = data.sort(compareFun);
			$.each(data, function(key1, value1) {
				$.each(t, function(key2, value2) {
					if(value2['date'] == value1) {
						resultData.push(value2);
					}
				});
			});
			$.each(resultData, function(key, value) {
				time.push(common.getLocalTime(new Date(value.date)).split(" ")[0]);
				orderNumber.push(value.orderNumber);
				orderAmount.push((value.orderAmount.toFixed(2)));
				//accountAmount.push(value.increasedSettlementAmount.toFixed(2));
				purchaseNumber.push(value.purchaseNumber);
				purchaseAmount.push(value.purchaseAmount.toFixed(2));
				bidNumber.push(value.bidNumber);
				bidAmount.push(value.bidAmount.toFixed(2));
			});
			var wrapData = {
					seriesData: [{
						name: '订单总金额',
						type: 'line',
						//step: 'end',
						data: orderAmount
					}, {
						name: '采购单总金额',
						type: 'line',
						//step: 'end',
						data: purchaseAmount
					}, {
						name: '竞价单总金额',
						type: 'line',
						//step: 'end',
						data: bidAmount
					}, {
						name: '订单总量',
						type: 'line',
						//step: 'end',
						data: orderNumber
					}, {
						name: '采购单总量',
						type: 'line',
						//step: 'end',
						data: purchaseNumber
					}, {
						name: '竞价单总量',
						type: 'line',
						//step: 'end',
						data: bidNumber
					}],
					lengendData: ['订单总金额', '采购单总金额', '竞价单总金额', '订单总量', '采购单总量', '竞价单总量'],
					xAxisData: time
				},
				chartContainter = $(".statictis-hospital-chart")[0];

			//图表
			common.chartFun(wrapData, chartContainter);
		}

		function eventBind() {
			//时间周期搜索
			$(".date-cycle-day,.date-cycle-7day,.date-cycle-30day").unbind().bind("click", function() {
				$(this).addClass("date-cycle-day-active").siblings().removeClass("date-cycle-day-active");
				requestData = {
					pageSize: pageSize,
					currentPage: currentPage,
					orgId: parseInt(id),
					type: parseInt($(this).attr("data-id")),
					startDate: Date.parse($("#startTimeHos").val()),
					endDate: Date.parse($("#endTimeHos").val())
				};
				commonFun();
			});

			//搜索功能
			/*$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
				search ? (function() {
					requestData = {
						pageSize: pageSize,
						currentPage: currentPage,
						queryString: search
					};
					commonFun();
				})() : null;

			});
			$("#search-value").keydown(function(e) {
				if(e.keyCode == 13) {
					$(".search-btn").click()
				}
			});*/

			//首页和末页
			$(".endpoint").bind("click", function() {
				switch($(this).text()) {
					case "首页":
						$("#pagination .prev").next().click()
						break;
					case "尾页":
						$("#pagination .next").prev().click()
						break;
				}
			});

			//时间控件
			laydate({
				elem: '#startTimeHos',
				choose:function(){
                    setTimeout(function() {
                        requestData = {
                            pageSize: pageSize,
                            currentPage: currentPage,
                            type: parseInt($(".date-cycle-day-active").attr("data-id")),
                            orgId: parseInt(id),
                            startDate: Date.parse($("#startTimeHos").val()),
                            endDate: Date.parse($("#endTimeHos").val())
                        };
                        commonFun();
                    }, 200);
                }
			});
			laydate({
				elem: '#endTimeHos',
				choose:function(){
                    setTimeout(function() {
                        requestData = {
                            pageSize: pageSize,
                            currentPage: currentPage,
                            type: parseInt($(".date-cycle-day-active").attr("data-id")),
                            orgId: parseInt(id),
                            startDate: Date.parse($("#startTimeHos").val()),
                            endDate: Date.parse($("#endTimeHos").val())
                        };
                        commonFun();
                    }, 200);
                }
			})
		}

	};
	return controller;
});