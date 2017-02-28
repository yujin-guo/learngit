define(['text!module/approval/approval.html', 'text!module/approval/header.html', 'text!module/approval/common_nav.html', 'text!module/approval/loadApproval.html', 'css!module/approval/style/supply.css', "js/libs/laydate.dev"], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		/* userPermissions=JSON.parse($.cookie("permissions")); */
		appView.html(_.template(header));
		var url = omsUrl + urls.allUrls.suppList; //供应商列表
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			currentPage: 1,
			pageSize: pageSize
		}; //请求参数
		var callback = function(r) {
			if(r.resultCode == "0000") {
				if(r.entities.length > 0) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				r.nav = nav;
				$("#right-container").html(_.template(tpl, r));
				var totalP = r.totalPage * pageSize;
				common.pageFun(totalP, pageNo, pageSize, page(requestData)); //页码初始化
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
		common.postData(url, requestData, callback, true,false);
		/**
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(data) {
			var pageCallback = function(index) {
				var baseData = {
					currentPage: index + 1,
					pageSize: pageSize
				}
				$.extend(data, baseData);
				common.postData(url, data, changeCallback, true);
			}
			return pageCallback;
		}

		function changeCallback(r) {
			if(r.resultCode == "0000") {
				if(r.entities.length > 0) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				$("#supplierList").html(_.template(loadHtml, r));
				window.scrollTo(0, 0);
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
		/*
		 * 搜索页面更新
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * */
		function pageUpdate(data) {
			var baseData = {
				currentPage: 1,
				pageSize: pageSize
			};
			$.extend(data, baseData);
			var callback = function(r) {
				if(r.resultCode == "0000") {
					if(r.entities.length > 0) {
						r.flag = true
					} else {
						r.flag = false
					}
					var totalP = r.totalPage * pageSize;
					$("#supplierList").html(_.template(loadHtml, r)); //列表更新
					common.pageFun(totalP, 1, pageSize, page(data)); //页码初始化
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
			};
			common.postData(url, data, callback, true,false) //数据请求
		}

		function pageUpdateSearch(data) {
			var baseData = {
				currentPage: 1,
				pageSize: pageSize
			};
			$.extend(data, baseData);
			var callback = function(r) {
				if(r.resultCode == "0000") {
					if(r.entities.length > 0) {
						r.flag = true
					} else {
						r.flag = false
					}
					var totalP = r.totalPage * pageSize;
					$("#supplierList").html(_.template(loadHtml, r)); //列表更新
					common.pageFun(totalP, 1, pageSize, page(data)); //页码初始化
				}
			};
			common.postData(url, data, callback, true,false) //数据请求
		}

		function eventBind() {
			//时间控件
			laydate({
				elem: "#startTime"
			})
			laydate({
					elem: "#endTime"
				})
				//搜索功能
			$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
				var data = {
					queryString: search,
					startTime: Date.parse(new Date($('#startTime').val())),
					endTime: Date.parse(new Date($('#endTime').val()))
				}
				pageUpdateSearch(data);
			});
			$(".search-input").keydown(function(event) {
				if(event.keyCode == 13) {
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
			//子导航选择
			$(".secondary-title").click(function() {
					$(this).addClass("secondary-active").siblings().removeClass("secondary-active");
					switch($(this).text()) {
						case "未认证":
							status = 0;
							break;
						case "审核中":
							status = 1;
							break;
						case "已认证":
							status = 2;
							break;
						case "已驳回":
							status = 3;
							break;
						case "已过期":
							status = 4;
							break;
						case "黑名单":
							status = 5;
							break;
					}
					var data = {
						status: status
					}
					if($(this).text() == "全部供应商") {
						var data = {}
					}
					pageUpdate(data);
				})
				//状态选择
			$(".status-td select").change(function() {
					var status = parseInt($(this).val());
					var data = {
						status: status
					}
					pageUpdate(data);
				})
				//页面详情页自导航跳转
			var index = common.getQueryString("index");
			if(index) {
				$(".secondary-title").eq(index - 1).click();
			}

			//拉黑解黑
			$("#supplierList").on("click", ".control-link-oms", function() {
				var cStatus = $(this).attr("data-status");
				var cId = $(this).attr("data-id");
				common.postData(omsUrl + urls.allUrls.updateSupplierStatus + "/" + cStatus + "/" + cId, null, ccFun,false);
			});

			function ccFun(r) {
				if(r.resultCode == "0000") {
					dialog({
						title: '提示',
						modal: true,
						content: "操作成功",
						ok: function() {
							requestData = {
								currentPage: 1,
								pageSize: pageSize
							};
							common.postData(url, requestData, changeCallback, true,false);
						},
						cancel: false
					}).width(320).show();

				}
			}
		}
	};
	return controller;
});