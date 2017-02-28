define(['text!module/details/details.html', "text!module/header/search.html", "text!module/header/navigation.html", 'common', 'module/details/productDetails', 'echarts', 'pagination', 'css!module/details/style/details.css', "css!module/home/style/style.css", "domready!"], function(tpl, searchHtml, navHtml, common, details, echarts) {
	var controller = function(sn, id) {
		var base = common.serverBaseUrl,
			_url = base + "/api/product/getProductInfo", //商品详情数据服务地址
			detailData = {},
			_data = {
				sn: sn
			},
			callback = function(r) {
				if(r.code == "0000") {
					$.extend(detailData, {
						search: searchHtml,
						nav: navHtml,
						details: r.product,
						code: r.code
					});
					common.postData(url2, data2, callback2, true); //获得商品评论数据
				} else if(r.code == "0002") {
					$.extend(detailData, {
						search: searchHtml,
						nav: navHtml,
						code: r.code
					});
					appView.html(_.template(tpl, detailData));
					common.nav().search().searchKey();
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {
							history.back() || window.close()
						},
						cancel: false,
					}).width(320).show();
				}
			};
		//获取商品详情数据
		common.postData(_url, _data, callback, true);

		var url2 = base + "/api/product/getProductComment", //商品评论请求地址
			pageSize = 3,
			pages,
			data2 = {
				pageNo: 1,
				pageSize: pageSize,
				productSn: sn
			},
			callback2 = function(r) {
				if(r.code == "0000") {
					pages = r.pageSize * r.totalPages; //获取分页设置中的总条目数
					$.extend(detailData, {
						r: r
					});
					common.postData(findCategoryUrl, requestData, categoryCallback, true); //获取供应商数据
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
		//获取供应商商品分类
		var findCategoryUrl = base + "/api/product/category/findCategory",
			requestData = {
				findModel: {
					supplierId: id
				}
			},
			categoryCallback = function(r) {
				if(r.code == "0000") {
					detailData.categorys = r.categorys;
					common.postData(url3, data3, callback3, true);
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
		var url3 = base + "/api/user/supplier/getSupplierInfo", //获取供应商信息地址
			data3 = {
				id: id
			},
			callback3 = function(r) {
				if(r.code == "0000") {
					$.extend(detailData, {
						supplier: r.supplier
					});
					var priceDirection = detailData.details.priceDirection; //获取价格走势数据
					var dataArr = []
					_.each(priceDirection, function(i, index) {
						dataArr[index] = [i.date, i.price]
					});
					dataArr.unshift([getThreeMonthAgoTime(), dataArr[0][1]]);
					appView.html(_.template(tpl, detailData));
					details();
					chartSetting(dataArr); //图表设置
					//分页设置		        		
					common.pageFun(pages, 1, pageSize, pageCallback);
					//分页触发的回调函数
					function pageCallback(index) {
						var data3 = {
							pageNo: index + 1,
							pageSize: pageSize,
							productSn: 636
						}
						var callback4 = function(r) {
							$.extend(detailData, {
								r: r
							})
							var $container = $(".details-fourth-comment");
							$container.empty();
							var newComments = '<% _.each(r.comments,function(c){%><li><span class="details-fourth-comment-text"><%= c.comment %></span><span class="details-fourth-comment-size"><%=details.specification%></span><span class="details-fourth-comment-name"><%= c.buyer %></span><span class="details-fourth-comment-time"><%=c.creationTime%></span></li><%})%>';
							$container.html(_.template(newComments, detailData));
						}
						common.postData(url2, data3, callback4, true);
					}
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			}
			//获取三个月前的时间
		function getThreeMonthAgoTime() {
			var mydate = new Date();
			mydate.setDate(mydate.getDate() - 91);
			var y = mydate.getFullYear();
			var m = mydate.getMonth() + 1;
			var d = mydate.getDate();
			m = m < 10 ? "0" + m : m;
			d = d < 10 ? "0" + d : d;
			return y + "-" + m + "-" + d;
		}

		function chartSetting(dataArr) {
			var myChart = echarts.init(document.getElementById("detailsChart"));
			// 指定图表的配置项和数据
			var option = {
				title: {
					text: '价格走势'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['Step End']
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				xAxis: {
					type: 'time',
					boundaryGap: false,
				},
				yAxis: {
					type: 'value'
				},
				series: [
					/* {
					     name:'Step Start',
					     type:'line',
					     step: 'start',
					     data:[120, 132, 101, 134, 90, 230, 210]
					 },*/
					{
						name: '价格',
						type: 'line',
						step: 'end',
						data: dataArr
					},
					/*{
					    name:'Step End',
					    type:'line',
					    step: 'end',
					    data:[450, 432, 401, 454, 590, 530, 510]
					}*/
				]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);

			//权限问题
			var purchaser_limit = userPermissions.indexOf('采购人中心');

			//关注商家
			$(".details-second-right-attention").bind("click", function() {
				var url = base + urls.allUrls.updateInterestSupplier,
					data = {
						supplierId: $("#details-shop-id").val(),
						isInteresting: true
					},
					callback = function(r) {
						if(r.code == "0000") {
							dialog({
								title: '提示',
								modal: true,
								content: '已成功关注商家。',
								ok: function() {},
								cancel: false,
							}).width(320).show();
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
				if(purchaser_limit == -1) {
					window.location.href = "403.html";
				} else {
					common.postData(url, data, callback, true);
				}
			});

		}
	}
	return controller;
});