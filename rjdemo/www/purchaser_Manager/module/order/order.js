define(['text!module/order/order.html', "text!module/order/alert.html", "text!module/order/orderDetails.html", "text!module/order/orderList.html","text!module/order/orderConfirm.html", "js/libs/laydate.dev", 'css!module/order/style/order.css', 'css!module/order/style/orderDetails.css', "pagination"], function(tpl, alertHtml, orderDetails, orderList,orderConfirmHtml) {
	var controller = function(orderStatus) {
		//竞价详情和评价列表等非采购人中心框架的页面进入我的订单
		if($.cookie("order")){
			$.cookie("order","",{expires:-1});
			location.reload();
		}
		var base = common.serverBaseUrl,
			url = base + "/api/order/getOrderListForWWW", //订单列表请求地址
			depUrl = base + "/api/order/getDeptsW", //部门接口
			pageSize = 10,
			orderData = {}, //template数据
			totalNum, //订单总条数
			data = {
				pageNo: 1,
				pageSize: pageSize
			};
		if(orderStatus) {
			data.status = orderStatus;
		}
		var callback = function(r) {
			if(r.code == "0000") {
				totalNum = r.totalPages * r.pageSize;
				orderData.list = r.orderLists;
				$("#right-container").html(_.template(tpl, orderData));
				$(".total-page-num").text(r.totalPages);
				if(r.hasOwnProperty("orderLists") == false || r.orderLists.length == 0) {
					$(".order .list-page").hide();
				} else {
					$(".order .list-page").show();
				}
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;我的订单</span>");
				allEventsBind();
				//tab选中
				var $tabList = $(".order-title-list li");
				switch(orderStatus) {
					case "4":
						$tabList.removeClass("order-title-list-highlight").eq("1").addClass("order-title-list-highlight");
						break;
					case "5":
						$tabList.removeClass("order-title-list-highlight").eq("2").addClass("order-title-list-highlight");
						break;
				}
			} else {
				$("#outLogin").click();
			}
		};
		var depCallback = function(r) {
			if(r.code == "0000") {
				orderData.depts = r.depts;
				common.postData(url, data, callback, true);
			}else{
				$("#outLogin").click();
			}
		};
		common.postData(depUrl, {}, depCallback, true);

		//"我的订单"选项卡选中
		common.tabFocus("我的订单");

		//获取当天时间
		function nowTime() {
			var mydate = new Date();
			var y = mydate.getFullYear();
			var m = mydate.getMonth() + 1;
			var d = mydate.getDate();
			m = m < 10 ? "0" + m : m;
			d = d < 10 ? "0" + d : d;
			return y + "-" + m + "-" + d;
		}

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
									list: r.orderLists
								});
								$("#orderItemWrap").html(_.template(orderList, orderData));
								window.scrollTo(0, 0);
								eventBind();

							}else{
								$("#outLogin").click();
							}
						};
					$.extend(data, baseData);
					common.postData(url, data, callback, true);
				};
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
						orderData.list = r.orderLists; //template数据更新
						$("#orderItemWrap").html(_.template(orderList, orderData)); //页面更换数据
						$(".total-page-num").text(r.totalPages);
						if(r.hasOwnProperty("orderLists") == false || r.orderLists.length == 0) {
							$(".order .list-page").hide();
						} else {
							$(".order .list-page").show();
						}
						window.scrollTo(0, 0); //滚动条设置
						eventBind(); //页面事件绑定
						common.pageFun(totalNum, 1, pageSize, page(data)); //分页初始化
					}else{
						$("#outLogin").click();
					}
				};
				common.postData(url, data, callback, true);
			}

			//订单列表页面订单详情和弹窗事件绑定
			function eventBind() {
				//[取消订单]弹窗
				$(".order-main-item-cancel").click(function() {
					var $that = $(this);
					var $status=$that.parents('td').siblings(".order-main-item-state").find("p");
					var $body = $("body");
					$body.append(alertHtml);
					$(".order-window-close,.order-window-close-btn").bind("click", function() {
						$(".order-popup").remove();
					});
					//弹窗样式判断
					if($status.text().indexOf("确认")!=-1) {
						$(".order-window-confirm").show();
						$(".order-window-delivery").hide();
					} else {
						$(".order-window-confirm").hide();
						$(".order-window-delivery").show();
					}
					//待确认状态取消订单
					$(".order-window-confirm .order-window-submit").bind("click", function() {
							var url = base + "/api/order/updateOrderStatus", //取消订单服务地址
								data = {
									id: $that.parents(".order-main-item").find(".order-main-id").val(),
									orderOperate: "CANCEL"
								},
								urllist = base + "/api/order/getOrderListForWWW",
								data1 = {
									pageNo: 1,
									pageSize: 10
								},
								callback = function(r) {
									if(r.code == "0000") {
										$(".order-popup").remove();
										$status.text('订单关闭');
										$that.parents('.order-main-item').addClass('order-main-item-shut');
										$that.remove();
									} else {
										$("#outLogin").click();
									}
								};
							common.postData(url, data, callback, true);
						});
					//待发货状态取消订单
					$(".order-window-delivery .order-window-submit").bind("click", function() {
						var url = base + "/api/order/updateOrderStatus", //取消订单服务地址
							cancelReason=$(".order-window-content-reason").val().trim(),
							data = {
								id: $that.parents(".order-main-item").find(".order-main-id").val(),
								orderOperate: "CANCEL",
								cancelReason:cancelReason,
							},
							urllist = base + "/api/order/getOrderListForWWW",
							data1 = {
								pageNo: 1,
								pageSize: 10
							},
							callback = function(r) {
								if(r.code == "0000") {
									$(".order-popup").remove();
									window.location.reload();
								} else {
									$("#outLogin").click();
								}
							};
						if(!cancelReason){
							dialog({
								title: '提示',
								modal: true,
								content: "原因不能为空。",
								okValue: "确认",
								ok: function() {},
								cancel: false,
							}).width(320).show();
							return false;
						}
						common.postData(url, data, callback, true);
					});
				});
				//订单详情
				$(".order-main-item-details").bind("click", function() {
					var id = $(this).parents(".order-main-item").find(".order-main-id").val();
					window.location.href = "#orderdetails?id=" + encodeURIComponent(id);
				});

				//退货
				$(".order-return").bind("click", function() {
						var orderId = $.trim($(this).parents(".order-main-item").find(".order-main-id").val());
						var itemId = $.trim($(this).next("input").val());
						window.location.href = "#returnstepone?orderId=" + encodeURIComponent(orderId) + "&itemId=" + encodeURIComponent(itemId);
					});
				//确认收货
				$(".confirm-take").bind("click", function() {
					var $that = $(this);
					var requestData = {
						id: $that.parents(".order-main-item").find(".order-main-id").val(),
						orderOperate: "RECEIPT"
					};//请求参数
					var url = base + urls.allUrls.updateOrderStatus; //更改订单状态
					var hospital=$.cookie("organization");//所属医院
					if(hospital=="中山大学附属第二医院"||hospital=="中山大学孙逸仙纪念医院"){
						$("body").append(orderConfirmHtml);
						//窗口关闭
						$(".order-confirm .card-head-icon").bind("click",function(){
							$(".purchase-card-wrap,.order-confirm-receive").remove();
						});
						//文件上传
						$(".photos-upload-click").bind("click",function(){
							$("#fileUpload").click();
						});
						var fileCallback=function(r){
							if(typeof r=="string"){
								r=JSON.parse(r);
							}
							if(r.code=="0000"){
								var imgStr='<li ><img class="photo-item" src="'+r.url+'" alt="照片"><span class="photo-delete"></span></li>';
								$(".order-confirm-receive .gallery").append(imgStr);
								$(".photo-delete").unbind().bind("click",function(){
									$(this).parent("li").remove();
									imgNumCheck();
								});
								imgNumCheck();
								//图片数量检测
								function imgNumCheck(){
									var imgNum=$('.order-confirm-receive .gallery li').length;
									if(imgNum==5){
										$(".photos-upload-click").unbind().css({'border-color':'#ccc','color':'#ccc'});
									}else{
										$(".photos-upload-click").css({'border-color':'#32ab94','color':'#32ab94'});
										$(".photos-upload-click").unbind().bind("click",function(){
											$("#fileUpload").click();
										});
									}
									if(imgNum===0){
										$(".gallery").html('<li class="no-photo">暂无图片。</li>');
										$(".card-sure-link").css("background-color","#ccc").unbind();
									}else{
										$(".gallery .no-photo").remove();
										$(".card-sure-link").css("background-color","#32ab94").unbind().bind("click",confirmReceive);
									}
								};
							}else{
								dialog({
									title: '提示',
									modal: true,
									content: r.message,
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						};
						$("#fileUpload").change(function(){
							common.fileUpload("orderConfirm",fileCallback);
							$(this).val("");
						});
						//确认收货函数
						var confirmReceive=function(){
							requestData.urls=[];
							$(".gallery .photo-item").each(function(){
								requestData.urls.push(this.src);
							});
							var callback = function(r) {
								if(r.code == "0000") {
									$that.parents("td").prev().text("待结算");
									$that.remove();
									$(".order-confirm-receive,.purchase-card-wrap").remove();
								} else {
									dialog({
										title: '提示',
										modal: true,
										content: r.message,
										okValue: "确认",
										ok: function() {},
										cancel: false,
									}).width(320).show();
								}
							};
							common.postData(url, requestData, callback, true);
						};
					}else{
						var callback = function(r) {
							if(r.code == "0000") {
								/*dialog({
									title: '提示',
									modal: true,
									content: '已确认收货。',
									okValue: "确认",
									ok: function() {},
									cancel: false,
								}).width(320).show();*/
								$that.parents("td").prev().text("待结算");
								$that.remove();
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: r.message,
									okValue: "确认",
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						};
						dialog({
							title: '提示',
							modal: true,
							content: '请确认是否已收到货？',
							okValue: "确认",
							ok: function() {
								common.postData(url, requestData, callback, true);
							},
							cancelValue: "取消",
							cancel: function() {},
						}).width(320).show();
					}
				});
			}
			eventBind();
			//更多选项
			$(".order-title-more").bind("click", function() {
					var txt = $(this).text();
					if(txt == "更多") {
						$(this).text("收起");
					} else {
						$(this).text("更多");
					}
					$(".order-main-more").toggle();
				});
				//时间控件
			laydate({
				elem: "#startTime"
			});
			laydate({
				elem: "#endTime"
			});
				//搜索
			$(".order-title-search-btn").bind("click", function() {
				var searchData = {
					search: $.trim($(".order-title-search-txt").val()),
				};
				pageUpdate(searchData);
			});
			$(".order-title-search-txt").keydown(function(e) {
				if(e.keyCode == "13") {
					$(".order-title-search-btn").click();
				}
			});

			//更多搜索
			$(".order-more-btn-search").bind("click", function() {
					var txt = $.trim($(".order-more-status").val());
					var status;
					switch(txt) {
						case "订单关闭":
							status = 3;
							break;
						case "待发货":
							status = 4;
							break;
						case "待收货":
							status = 5;
							break;
						case "待结算":
							status = 6;
							break;
						case "已完成":
							status = 7;
							break;
						case "待确认":
							status = 8;
							break;
						case "申请取消":
							status = 9;
							break;
						case "结算中":
							status = 10;
							break;
						case "订单完成":
							status = 11;
							break;
						default:
							status = null;
					}
					var searchData = {
						department: $.trim($(".order-more-department").val()) || null,
						status: status || null,
						orderNo: $.trim($(".order-more-number").val()) || null,
						startDate: $.trim($("#startTime").val()) || "1975-01-01",
						endDate: $.trim($("#endTime").val()) || nowTime(),
						suppname: $(".order-more-supplier").val().trim() || null,
						fbuyername: $(".order-more-buyer").val().trim() || null
					};
					pageUpdate(searchData);
				});
				//重置
			$(".order-more-btn-reset").bind("click", function() {
					$(".order-more-input").val("");
				});
				//订单状态选取
			$(".order-status-choices li").click(function() {
				var txt = $(this).text();
				$(".order-more-status").val(txt);
				$(".order-status-choices").slideUp("slow");
			});
			$(".order-more-status").focus(function() {
				$(".order-status-choices").slideDown("slow");
			}).blur(function() {
				$(".order-status-choices").delay(200).slideUp("slow");

			});
			//采购部门选取
			$(".order-department-choices li").click(function() {
				var txt = $(this).text();
				$(".order-more-department").val(txt);
				$(".order-department-choices").slideUp("slow");
			});
			$(".order-more-department").focus(function() {
				$(".order-department-choices").slideDown("slow");
			}).blur(function() {
				$(".order-department-choices").delay(200).slideUp("slow");
			});
			//更多状态
			/*$(".order-title-more-status").bind("click",function(){
				$(".order-more-status-choices").slideDown("slow");
			})
			$(".order-more-status-choices li").bind("click",function(){
				var txt=$(this).text();
				$(".order-title-more-status").text(txt);
			})*/

			//订单分类切换
			$(".order-title-list li").bind("click", function() {
				$(this).addClass("order-title-list-highlight").siblings().removeClass("order-title-list-highlight");
				var txt = $(this).text();
				if(txt == "全部订单") {
					pageUpdate({});
				}
				if(txt == "待发货") {
					var datas = {
						status: 4
					};
					pageUpdate(datas);
				}
				if(txt == "待收货") {
					var datas = {
						status: 5
					};
					pageUpdate(datas);
				}
				if(txt == "待结算") {
					var datas = {
						status: 6
					};
					pageUpdate(datas);
				}
			});
			common.pageFun(totalNum, 1, pageSize, page({})); //页码初始化
			if(orderStatus) {
				common.pageFun(totalNum, 1, pageSize, page({
					status: orderStatus
				})); //页码初始化
			}
		}
	};
	return controller;
});