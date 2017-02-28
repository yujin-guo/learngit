define(['text!module/brand/brand.html', 'text!module/brand/header.html', 'text!module/brand/nav.html', 'text!module/brand/listLoad.html', 'js/libs/jquery.validate.min', 'js/libs/laydate.dev', 'pagination', 'css!module/brand/style/brand.css?'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		/*userPermissions = JSON.parse($.cookie("permissions"))*/
		appView.html(_.template(header));

		var url = omsUrl + urls.allUrls.getBrands; //品牌列表
		var urlSearch = omsUrl + urls.allUrls.getBrandSearch; //品牌搜索列表
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			currentPage: 1,
			pageSize: pageSize
		}; //请求参数
		var callbacklist = function(r) {
			if(r.resultCode == "0000") {
				if(r.entities == undefined || !r.entities.length) {
					r.flag = false;
				} else {
					r.flag = true;
				}
				r.nav = nav;
				$("#right-container").html(_.template(tpl, r));

				common.pageFun(r.totalPage * r.pageSize, pageNo, pageSize, pageEventFun);

				//首页/尾页
				common.endsFun(pageNo, r.totalPages, pageEventFun);
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
		common.postData(url, requestData, callbacklist, true,false);

		/*页码触发事件
		 *{pageIndex}  触发的页码，此插件页数从0开始，因此传递参数时pageIndex+1; 
		 * {page}  页码触发后的回调函数
		 * */
		function pageEventFun(pageIndex) {
			requestData.currentPage = pageIndex + 1;
			common.postData(url, requestData, page, true);
		}

		function page(r) {
			if(r.resultCode == "0000") {
				if(r.entities == undefined || !r.entities.length) {
					r.flag = false;
				} else {
					r.flag = true;
				}
				$("#list").html(_.template(loadHtml, r));
				common.pageFun(r.totalPage * r.pageSize, r.currentPage, pageSize, pageEventFun);
				common.endsFun(pageNo, r.totalPage, pageEventFun);
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
				requestData = {
					currentPage: 1,
					pageSize: pageSize
				}
				if(search !== "") {
					requestData.queryString = search;
				}
				if($('#startTime').val() !== "") {
					requestData.startTime = Date.parse(new Date($('#startTime').val()));
				}
				if($('#endTime').val() !== "") {
					requestData.endTime = Date.parse(new Date($('#startTime').val()))
				}
				common.postData(url, requestData, page, true,false);
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
				requestData = {
					currentPage: 1,
					pageSize: pageSize
				}
				switch($(this).attr("data-id")) {
					case "0":
						requestData.status = '';
						break;
					case "1":
						requestData.status = 1;
						break;
					case "2":
						requestData.status = 2;
						break;
					case "3":
						requestData.status = 3;
						break;
					case "4":
						requestData.status = 4;
						break;
				}
				common.postData(url, requestData, page, true,false);
			});

			//页面详情页自导航跳转
			var index = common.getQueryString("index");
			if(index) {
				$(".secondary-title").eq(index - 1).click();
			}

			//状态选择
			$(".status-td select").change(function() {
				var status = parseInt($(this).val());
				requestData = {
					currentPage: 1,
					pageSize: pageSize,
					status: status
				}
				common.postData(url, requestData, page, true,false);

			});
		}
	};
	return controller;
});