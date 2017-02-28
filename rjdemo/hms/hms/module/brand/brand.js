define(['text!module/brand/brand.html', 'text!module/brand/header.html', 'text!module/brand/nav.html','text!module/brand/listLoad.html', 'js/libs/jquery.validate.min', 'js/libs/laydate.dev', 'pagination', 'css!module/brand/style/brand.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));

		var url = testUrl + urls.allUrls.getBrands; //品牌列表
        var urlSearch = testUrl + urls.allUrls.getBrandSearch; //品牌搜索列表
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			pageNo: 1,
			pageSize: pageSize
		}; //请求参数
		var callbacklist = function(r) {
			if(r.code == "0000") {
				if(r.brandAppList==undefined||!r.brandAppList.length) {
					r.flag = false;
				} else {
					r.flag = true;
				};
				r.nav = nav;
				$("#right-container").html(_.template(tpl, r));

				//r.brandAppList.length   后台修改后换成总条数
				common.pageFun(r.totalPages * pageSize, pageNo, pageSize, page({}));

				//首页/尾页
				common.endsFun(pageNo, r.totalPages, pageEventFun);
				eventBind(); 
			}
		}
		common.postData(url, requestData, callbacklist, true);

		/*页码触发事件
		 *{pageIndex}  触发的页码，此插件页数从0开始，因此传递参数时pageIndex+1; 
		 * {page}  页码触发后的回调函数
		 * */
		function pageEventFun(pageIndex) {
			requestData.pageNo = pageIndex + 1;
			common.postData(url, requestData, page, true);
		}
		/**
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(data) {
			var pageCallback = function(index) {
				var baseData = {
					pageNo: index + 1,
					pageSize: pageSize
				}
				$.extend(data, baseData);
				var callback = function(r) {
					if(r.code == "0000") {
						if(r.brandAppList==undefined||!r.brandAppList.length) {
							r.flag = false;
						} else {
							r.flag = true;
						}
						$("#list").html(_.template(loadHtml, r));
						//common.pageFun(r.totalPages * pageSize, pageNo, pageSize, pageEventFun);
						common.endsFun(pageNo, r.totalPages, pageEventFun);
						window.scrollTo(0, 0);
					}
				}
				common.postData(url, data, callback, true);
			}
			return pageCallback;
		}
		/*
		 * 搜索页面更新
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * */
		function pageUpdate(data) {
			var baseData = {
				pageNo: 1,
				pageSize: pageSize
			};
			$.extend(data, baseData);
			var callback = function(r) {
				if(r.code == "0000") {
					if(r.brandAppList==undefined||!r.brandAppList.length) {
						r.flag = false;
					} else {
						r.flag = true;
					}
			
					var totalP = r.totalPages * pageSize;
					$("#list").html(_.template(loadHtml, r)); //列表更新
					common.pageFun(totalP, 1, pageSize, page(data)); //页码初始化
				}
			};
			common.postData(url, data, callback, true) //数据请求
		}
        function pageUpdateSearch(data) {
			var baseData = {
				pageNo: 1,
				pageSize: pageSize
			};
			$.extend(data, baseData);
			var callback = function(r) {
				if(r.code == "0000") {
					if(r.brandAppList==undefined||!r.brandAppList.length ) {
						r.flag = false;
					} else {
						r.flag = true;
					}
			
					var totalP = r.totalPages * pageSize;
					$("#list").html(_.template(loadHtml, r)); //列表更新
					common.pageFun(totalP, 1, pageSize, page(data)); //页码初始化
				}
			};
			common.postData(urlSearch, data, callback, true); //数据请求
		}
		function eventBind() {
			//时间控件
			laydate({
				elem: "#startTime"
			});
			laydate({
				elem: "#endTime"
			});
			//搜索功能
			$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
                var data={};
                if(search!==""){
                    $.extend(data, {condition:search});
                }
                if($('#startTime').val()!==""){
                    $.extend(data, {startDate:Date.parse(new Date($('#startTime').val()))});
                }
                if($('#endTime').val()!==""){
                    $.extend(data, {endDate:Date.parse(new Date($('#endTime').val()))});
                }
				pageUpdateSearch(data);
			});
            $(".search-input").keydown(function(event){
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
					case "审核中":
						status = 1;
						break;
					case "已通过":
						status = 2;
						break;
					case "未通过":
						status = 3;
						break;
					case "已过期":
						status = 4;
						break;           
				}
				var data = {
				    status: status
				}
                if($(this).text()=="全部品牌"){
                    var data = {
				    }
                }
				pageUpdate(data);
			});
			
			//页面详情页自导航跳转
			var index=common.getQueryString("index");
			if(index){
				$(".secondary-title").eq(index-1).click();
			}
			
			//状态选择
			$(".status-td select").change(function() {
				var status = parseInt($(this).val());
				var data = {
					status: status
				}
				pageUpdate(data);
			});
			//页面详情页自导航跳转
			var index = common.getQueryString("index");
			if(index) {
				$(".secondary-title").eq(index - 1).click();
			}
		}
	};
	return controller;
});