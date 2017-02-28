define(['text!module/returnlist/returnlist.html', "text!module/returnlist/loadReturnList.html", 'css!module/returnlist/style/returnlist.css', "pagination", "js/libs/laydate.dev"], function(tpl, returnList) {
	var controller = function(orderStatus) {
		var base = common.serverBaseUrl,
			url = base + "/api/order/getGoodReturnList", //退货单列表请求地址
			depUrl=base+"/api/order/getDeptsW",//部门接口
			pageSize = 10,
			orderData={}, //template数据
			totalNum, //退货单总条数
			data = {
				pageNo: 1,
				pageSize: pageSize
			};
		var callback = function(r) {
			if(r.code == "0000") {
				totalNum = r.totalPages * r.pageSize;
				orderData.list=r.orderList;
				$("#right-container").html(_.template(tpl, orderData));
				$(".total-page-num").text(r.totalPages);
				if(r.orderList.length==0){
					$(".list-page").hide();
				}else{
					$(".list-page").show();
				}
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;我的退货单</span>");
				allEventsBind();

			}
		};
		var depCallback=function(r){
        	if(r.code=="0000"){
        		orderData.depts=r.depts;
        		common.postData(url,data,callback,true);
        	}
        }
		common.postData(depUrl,{},depCallback,true);
		common.tabFocus("我的退货");
		function allEventsBind() {
			/* 
			 * 分页回掉函数设置
			 * @param{object} data 请求数据（默认请求pageNo和pageSize参数，不可更改）
			 * @return{function} 返回分页回调函数pageCallback
			 * */
			function page(data) {
				var pageCallback = function(i) {
					baseData = {
							pageNo: i + 1,
							pageSize: pageSize
						},
						callback = function(r) {
							if(r.code == "0000") {
								totalNum = r.totalPages * r.pageSize;
								$.extend(orderData, {
									list: r.orderList
								});
								$("#orderItemWrap").html(_.template(returnList, orderData));
								if(r.orderList.length==0){
									$(".list-page").hide();
								}else{
									$(".list-page").show();
								};
								window.scrollTo(0, 0);
								eventBind();
							}
						};
					$.extend(data, baseData);
					common.postData(url, data, callback, true);
				}
				return pageCallback;
			}

			/* 
			 * 搜索页面更新
			 * @param{object} data 请求数据（默认请求pageNo和pageSize参数，不可更改）
			 * */
			function pageUpdate(data) {
				var baseData = {
					pageNo: 1,
					pageSize: pageSize,
				};
				$.extend(data, baseData);
				var callback = function(r) {
					if(r.code == "0000") {
						totalNum = r.pageSize * r.totalPages; //数据总条数更新
						orderData.list = r.orderList; //template数据更新
						$("#orderItemWrap").html(_.template(returnList, orderData)) //页面更换数据
						$(".total-page-num").text(r.totalPages);
						window.scrollTo(0, 0) //滚动条设置
						eventBind() //页面事件绑定
						common.pageFun(totalNum, 1, pageSize, page(data)); //分页初始化
						if(r.orderList.length==0){
							$(".list-page").hide();
						}else{
							$(".list-page").show();
						}
					};
				}
				common.postData(url, data, callback, true)
			}

			//订单列表页面订单详情和弹窗事件绑定
			function eventBind() {
				//订单详情
				$(".returnlist-main-item-details").bind("click", function() {
					var id = $(this).parents(".returnlist-main-item").find(".returnlist-main-id").val();
					window.location.href = "#orderdetails?id=" + encodeURIComponent(id);
				})

			};
			eventBind()

			//更多选项
			$(".returnlist-title-more").bind("click", function() {
				var txt = $(this).text();
				if(txt == "更多") {
					$(this).text("收起");
				} else {
					$(this).text("更多");
				}
				$(".returnlist-main-more").toggle();
			})

			//搜索
			$(".returnlist-title-search-btn").bind("click", function() {
				var searchData = {
					search: $.trim($(".returnlist-title-search-txt").val()),
				};
				pageUpdate(searchData)
			})
			$(".returnlist-title-search-txt").keydown(function(e) {
				if(e.keyCode == "13") {
					$(".returnlist-title-search-btn").click();
				}
			});
			//时间控件
			laydate({
				elem: "#startTime"
			});
			laydate({
				elem: "#endTime"
			});
			//更多搜索
			$(".returnlist-more-btn-search").bind("click", function() {
					var txt = $.trim($(".returnlist-more-status").val());
					var status;
					switch(txt) {
						case "待确认":
							status = 0;
							break;
						case "退货中":
							status = 1;
							break;
						case "拒绝退货":
							status = 2;
							break;
						case "已退货":
							status = 5;
							break;
						case "已取消":
							status = 3;
							break;
						default:
							status = null;
					}
					var searchData = {
						department: $.trim($(".returnlist-more-department").val()),
						status: status,
						orderNo: $.trim($(".returnlist-more-number").val()),
						startDate: $.trim($("#startTime").val()),
						endDate: $.trim($("#endTime").val()),
					};
					pageUpdate(searchData)
				})
				//重置
			$(".returnlist-more-btn-reset").bind("click", function() {
					$(".returnlist-more-department,.returnlist-more-status,.returnlist-more-number,.returnlist-more-start-time,.returnlist-more-end-time").val("");
				})
				//退货状态选取
			$(".returnlist-status-choices li").click(function() {
				var txt = $(this).text();
				$(".returnlist-more-status").val(txt);
				$(".returnlist-status-choices").slideUp("slow");
			})
			$(".returnlist-more-status").focus(function() {
				$(".returnlist-status-choices").slideDown("slow");
			}).blur(function(){
				$(".returnlist-status-choices").delay(200).slideUp("slow");
			})
				//采购部门选取
			$(".returnlist-department-choices li").click(function() {
				var txt = $(this).text();
				$(".returnlist-more-department").val(txt);
				$(".returnlist-department-choices").slideUp("slow");
			})
			$(".returnlist-more-department").focus(function() {
				$(".returnlist-department-choices").slideDown("slow");
			}).blur(function(){
				$(".returnlist-department-choices").delay(200).slideUp("slow");
			})

			//订单分类切换
			$(".returnlist-title-list li").bind("click", function() {
				$(this).addClass("returnlist-title-list-highlight").siblings().removeClass("returnlist-title-list-highlight");
				var txt = $(this).text();
				if(txt == "所有退货单") {
					pageUpdate({})
				}
				if(txt == "待确认") {
					var datas = {
						status: 0
					};
					pageUpdate(datas)
				}
				if(txt == "退货中") {
					var datas = {
						status: 1
					};
					pageUpdate(datas)
				}
				if(txt == "已退货") {
					var datas = {
						status: 5
					};
					pageUpdate(datas)
				}
			})
			common.pageFun(totalNum, 1, pageSize, page({})); //页码初始化
		}
	}
	return controller;
});