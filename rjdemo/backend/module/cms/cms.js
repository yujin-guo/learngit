define(['text!module/cms/cms.html', 'text!module/cms/header.html', 'text!module/cms/common_nav.html', 'text!module/cms/loadCms.html', 'css!module/cms/style/cms.css', "js/libs/mylaydate"], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		/*userPermissions = JSON.parse($.cookie("permissions"));*/
		appView.html(_.template(header));

		//获取标志
		var flag = common.getQueryString("key");
		var resultData = {}; //模板数据
		var url = cmsUrl + urls.allUrls.getNoticeList; //公告列表地址
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			page: 1,
			pageSize: pageSize,
			status:-1
		}; //请求参数
		var callback = function(r) {
			if(r.resultCode == "0000") {
				if(r.entities != undefined && r.entities.length) {
					r.flag = true;
				} else {
					r.flag = false;
				}
				r.nav = nav;
				resultData = $.extend(resultData, r);
				$("#right-container").html(_.template(tpl, resultData));

				//判断导航active
				$(".secondary-title").removeClass("secondary-active");
				var len = $(".secondary-title").length;
				for(var i = 0; i < len; i++) {
					var _d = $(".secondary-title")[i];
					if($(_d).attr("data-flag") == flag) {
						$(_d).addClass("secondary-active");
					}
				}
				var totalP = r.totalPage * r.pageSize;
				common.pageFun(totalP, r.currentPage, r.pageSize, page); //页码初始化
				eventBind();

				//获取上级栏目列表
				var getColumnCallback = function(r) {
					if(r.resultCode == "0000") {
						var columnStr = '<%_.each(volist,function(v){%><option value="<%=v.dto.id%>"><%=v.dto.columnName%></option><% if(v.size!=0) {_.each(v.list,function(L){%><option value="<%= L.column.id %>">&nbsp;&nbsp;&nbsp;&nbsp;<%= L.column.columnName %></option><% if(L.size!=0) {_.each(L.list,function(r){%><option value="<%= r.id %>">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<%= r.columnName %></option><%})}})}})%>';
						$("#cms-select").html(_.template(columnStr, r));
					}
				};
				common.postData(cmsUrl + urls.allUrls.getColumnList, {}, getColumnCallback, true);
			} else {
				/*dialog({
					title: '提示',
					modal: true,
					content: r.msg,
					ok: function() {},
					cancel: false
				}).width(320).show();*/
			}
		}
		
		common.postData(url, requestData, callback, true, true);
		//common.postData(url,requestData,callback,true);

		/**
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(pageIndex) {
			requestData.page = pageIndex + 1;
			common.postData(url, requestData, updatecallback, true);
		}
		/*
		 * 搜索页面更新
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * */
		function updatecallback(data) {
			if(data.resultCode == "0000") {
				if(data.entities != undefined && data.entities.length) {
					data.flag = true;
				} else {
					data.flag = false;
				}

				var totalP = data.totalPage * data.pageSize;
				$("#list").html(_.template(loadHtml, data)); //列表更新
				common.pageFun(totalP, data.currentPage, data.pageSize, page); //页码初始化
			}
		}

		function eventBind() {
			//二级菜单点击刷新
			$(".secondary-title").eq(0).bind("click",function(){
				window.location.reload()
			})

			//搜索功能
			$(".search-btn").bind("click", function() {
				var search = $(".search-input").val().trim();
				requestData = {
					columnId: $(".cms-select").val(),
					title: search,
					startTime: Date.parse(new Date($('#startTime').val())),
					endTime: Date.parse(new Date($('#endTime').val()))
				}
				common.postData(url, requestData, updatecallback, true);
			});

			//状态筛选(缺少字段)
			$("#purchase-select").on("change", function() {
				requestData = {
					pageSize: pageSize,
					status:parseInt($(this).val())
					
				}
				common.postData(url, requestData, updatecallback, true);
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

			//下线
			$("#list").on("click", '#del', function() {
				var delId = $(this).attr("data-id");
				var delData = null;
				var delCallback = function(r) {
					if(r.resultCode == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: "下线成功",
							ok: function() {
								common.postData(url,requestData, updatecallback, true);
							},
							cancel: false
						}).width(320).show();
					}
				};
				common.postData(cmsUrl + urls.allUrls.noticeOffline + delId, delData, delCallback, true);
			});

			//发布公告
			$("#list").on("click", '#fabu', function() {
				var fabuId = $(this).attr("data-id");

				var fabuData = null;
				var fabuCallback = function(r) {
					if(r.resultCode == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: "发布成功",
							ok: function() {
								common.postData(url,requestData, updatecallback, true);
							},
							cancel: false
						}).width(320).show();
					}
				};
				common.postData(cmsUrl + urls.allUrls.noticePublish + fabuId, fabuData, fabuCallback, true);
			});
			//全选
			$(".all-select input").bind("click", function() {
				if($(this).is(":checked")) {
					$(".sub-select input").prop("checked", true);
				} else {
					$(".sub-select input").prop("checked", false);
				}
			});
			//时间控件
			laydate({
				elem: "#startTime"
			})
			laydate({
				elem: "#endTime"
			})
		}
	};
	return controller;
});
