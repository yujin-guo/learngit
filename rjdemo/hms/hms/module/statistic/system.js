define(['text!module/statistic/system.html',"text!module/statistic/header.html","text!module/statistic/nav.html","text!module/statistic/loadSystem.html","js/libs/mylaydate","css!module/statistic/style/statistic.css","pagination"], function(tpl,header,nav,loadHtml) {
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		
		var url=testUrl+urls.allUrls.systemSummary;//系统使用查询地址
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			start:$('#startTime').val(),
			end:$('#endTime').val(),
			pageNo:pageNo,
			pageSize:pageSize
		};//请求参数
		var callback=function(r){
			if(r.code="0000"){
				if(r.logs.length>0){
					r.flag=true;
				}else{
					r.flag=false;
				}
				r.nav=nav;
				$("#right-container").html(_.template(tpl,r));
				$(".secondary-title").eq(4).addClass("secondary-active").siblings().removeClass("secondary-active");
				$(".secondary-title").eq(4).bind("click",function(){window.location.reload()});
				var totalP=r.totalPages*pageSize;
				common.pageFun(totalP,pageNo,pageSize,page(requestData));//页码初始化
				eventBind();
			}
		}
		common.postData(url, requestData, callback, true);
		/**
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(data){
			var pageCallback=function(index){
				var baseData={
					pageNo:index+1,
					pageSize:pageSize
				}
				$.extend(data,baseData);
				var callback=function(r){
					if(r.code=="0000"){
						if(r.logs.length>0){
							r.flag=true;
						}else{
							r.flag=false;
						}
						$("#list").html(_.template(loadHtml,r));
						window.scrollTo(0,0);
					}
				}
				common.postData(url,data,callback,true);
			}
			return pageCallback;
		}
		/*
		 * 搜索页面更新
		 * @param {Object} data 添加的请求数据（默认请求pageNo及pageSize，且默认值不可更改）
		 * */
		function pageUpdate(data){
			var baseData={
				pageNo:1,
				pageSize:pageSize
			};
			$.extend(data,baseData);
			var callback=function(r){
				if(r.code=="0000"){
					if(r.logs.length>0){
						r.flag=true
					}else{
						r.flag=false
					}
					
					var totalP=r.totalPages*pageSize;
					$("#list").html(_.template(loadHtml,r));//列表更新
					common.pageFun(totalP,1,pageSize,page(data));//页码初始化

				}
			};
			common.postData(url,data,callback,true);//数据请求
		}
		function eventBind(){
			//时间控件
			laydate({
				elem:'#startTime'
			});
			laydate({
				elem:'#endTime'
			});
			//搜索功能
			$(".search-btn").bind("click",function(){
				var search=$(".search-input").val().trim();
				var	data={
					operator:search,
					start:$("#startTime").val().trim(),
					end:$("#endTime").val().trim()
				}
				pageUpdate(data);
			})
			$("#search-value").keydown(function(e){
				if(e.keyCode==13){
					$(".search-btn").click();
				}
			})
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
			
		}
		
	};
	return controller;
});