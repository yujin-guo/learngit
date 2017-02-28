define(['text!module/statistic/supplyDetail.html', "text!module/statistic/header.html", "text!module/statistic/nav.html", "text!module/statistic/loadSupplyDetail.html", "css!module/statistic/style/statistic.css", "js/libs/laydate.dev"], function(tpl, header, nav, loadListHtml) {
	var controller = function(id) {
		appView.html(_.template(header));
		var suppStatisticDetailUrl = omsUrl + urls.allUrls.suppStatisticDetail + id + "/summary",
			suppStatisticListDetailUrl = omsUrl + urls.allUrls.suppStatisticListDetail + id,
			hospitalListUrl = omsUrl + urls.allUrls.hospitalList,
			pageSize = common.pageSize,
			currentPage = 1,
			requestData = {
				pageSize: pageSize,
				currentPage: currentPage,
				type: 0,
				startTime: Date.parse(common.getWeekDate()),
				endTime: Date.parse(common.getDate())
			},
			f = null;

		function pageEventFun(pageIndex) {
			requestData.currentPage = pageIndex + 1;
			commonFun();
		}

		function updateCallbackFun(r) {
			if(r.resultCode == "0000") {
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#list").html(_.template(loadListHtml, r));
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
					cancel: false,
				}).width(320).show();
			}
		}

		function commonFun() {
			common.postData(suppStatisticListDetailUrl, requestData, updateCallbackFun, true, false);
		}

		common.postData(suppStatisticDetailUrl, null, statisticCallbackFun, true, false);

		function statisticCallbackFun(d) {
			if(d.resultCode == "0000") {
				/*this.d = d;
				callback.apply(this, arguments);*/
				f = d;
				common.postData(suppStatisticListDetailUrl, requestData, callback, true, false);
			} else if(d.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: d.msg,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}

		function callback(r) {
			if(r.resultCode == "0000") {
				//console.log("kkk");
				r.d = f;
				r.nav = nav;
				(r.hasOwnProperty("entities") && r.entities.length) ? r.flag = true: r.flag = false;
				$("#right-container").html(_.template(tpl, r));
				$(".secondary-title").eq(1).addClass("secondary-active").siblings().removeClass("secondary-active");
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, r.pageSize, pageEventFun);
				common.leftHeightFun($(".nav-inner-left"), $(".nav-left"), $(".content-height"));
				eventBind();
				eventFun(r.entities);
				common.postData(hospitalListUrl, null, function(p) {
					if(p.resultCode == "0000") {
						var selectDom = $(".statistic-hos-select"),
							str = null;
						$.each(p.list, function(key, value) {
							str == null ? str = '<option value="' + value.id + '">' + value.name + '</option>' : str += '<option value="' + value.id + '">' + value.name + '</option>';
						});
						selectDom.append(str);

					} else if(p.resultCode == "1001") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: p.msg,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}, true, false);
			} else if(r.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}

		function eventFun(t) {
			var time = [],
				orderNumber = [],
				orderAmount = [],
				accountAmount = [],
				purchaseNumber = [],
				purchaseAmount = [],
				bidNumber = [],
				bidAmount = [],
				commodityNumber = [],
				data = [],
				resultData = [];

			//改变返回的json数据顺序
			function compareFun(a, b) {
				return a - b;
			}
			$.each(t, function(key, value) {
				data.push(value['time']);
			});
			data = data.sort(compareFun);
			$.each(data, function(key1, value1) {
				$.each(t, function(key2, value2) {
					if(value2['time'] == value1) {
						resultData.push(value2);
					}
				});
			});
			$.each(resultData, function(key, value) {
				time.push(common.getLocalTime(new Date(value.time)).split(" ")[0]);
				orderNumber.push(value.orderNumber);
				orderAmount.push((value.increasedOrderAmount.toFixed(2)));
				accountAmount.push(value.increasedSettlementAmount.toFixed(2));
				purchaseNumber.push(value.purchaseNumber);
				purchaseAmount.push(value.increasedPurchaseAmount.toFixed(2));
				bidNumber.push(value.bidNumber);
				bidAmount.push(value.increasedBidAmount.toFixed(2));
				commodityNumber.push(value.goodsNumber);
			});
			var wrapData = {
					seriesData: [{
						name: '新增订单金额',
						type: 'line',
						//step: 'end',
						data: orderAmount
					}, {
						name: '新增商品',
						type: 'line',
						//step: 'end',
						data: commodityNumber
					}, {
						name: '新增采购单金额',
						type: 'line',
						//step: 'end',
						data: purchaseAmount
					}, {
						name: '新增竞价单金额',
						type: 'line',
						//step: 'end',
						data: bidAmount
					}, {
						name: '新增结算金额',
						type: 'line',
						//step: 'end',
						data: accountAmount
					}, {
						name: '新增订单',
						type: 'line',
						//step: 'end',
						data: orderNumber
					}, {
						name: '新增采购单',
						type: 'line',
						//step: 'end',
						data: purchaseNumber
					}, {
						name: '新增竞价单',
						type: 'line',
						//step: 'end',
						data: bidNumber
					}],
					lengendData: ['新增订单金额', '新增商品', '新增采购单金额', '新增竞价单金额', '新增结算金额', '新增订单', '新增采购单', '新增竞价单'],
					xAxisData: time
				},
				chartContainter = $(".statictis-supp-chart")[0];

			//图表
			common.chartFun(wrapData, chartContainter);
		}

		function eventBind() {
			//医院搜索
			$(".statistic-hos-select").unbind().bind("change", function() {
				requestData = {
					pageSize: pageSize,
					currentPage: currentPage,
					orgid: parseInt($(this).val()),
					type: parseInt($(".date-cycle-day-active").attr("data-id")),
					startTime: Date.parse($("#startTimeSu").val()),
					endTime: Date.parse($("#endTimeSu").val())
				};
				commonFun();
			});

			//时间周期搜索
			$(".date-cycle-day,.date-cycle-7day,.date-cycle-30day").unbind().bind("click", function() {
				$(this).addClass("date-cycle-day-active").siblings().removeClass("date-cycle-day-active");
				requestData = {
					pageSize: pageSize,
					currentPage: currentPage,
					orgid: parseInt($(".statistic-hos-select").val()),
					type: parseInt($(this).attr("data-id")),
					startTime: Date.parse($("#startTimeSu").val()),
					endTime: Date.parse($("#endTimeSu").val())
				};
				commonFun();
			});

			//btn搜索功能
			/*$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
				(search || $.trim($("#startTime").val()) || $.trim($("#endTime").val())) ? (function() {
					requestData = {
						pageSize: pageSize,
						currentPage: currentPage,
						queryString: search || null,
						startTime: $.trim($("#startTime").val()) ? Date.parse($.trim($("#startTime").val())) : null,
						endTime: $.trim($("#endTime").val()) ? Date.parse($.trim($("#endTime").val())) : null
					};
					commonFun();
				})() : (function() {
					dialog({
						title: '提示',
						modal: true,
						content: "请至少输入一个查询条件",
						ok: function() {},
						cancel: false,
					}).width(320).show();
				})();

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
				elem: '#startTimeSu',
				choose:function(){
                    setTimeout(function() {
                        requestData = {
                            pageSize: pageSize,
                            currentPage: currentPage,
                            orgid: parseInt($(".statistic-hos-select").val()),
                            type: parseInt($(".date-cycle-day-active").attr("data-id")),
                            startTime: Date.parse($("#startTimeSu").val()),
                            endTime: Date.parse($("#endTimeSu").val())
                        };
                        commonFun();
                    }, 200);
                }
			});
			laydate({
				elem: '#endTimeSu',
				choose:function(){
                    setTimeout(function() {
                        requestData = {
                            pageSize: pageSize,
                            currentPage: currentPage,
                            orgid: parseInt($(".statistic-hos-select").val()),
                            type: parseInt($(".date-cycle-day-active").attr("data-id")),
                            startTime: Date.parse($("#startTimeSu").val()),
                            endTime: Date.parse($("#endTimeSu").val())
                        };
                        commonFun();
                    }, 200);
                }
			});
		}

	};
	return controller;
});