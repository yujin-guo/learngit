define(['text!module/order/order.html', 'text!module/order/header.html', 'text!module/order/common_nav.html','text!module/order/loadOrder.html', 'css!module/order/style/order.css','pagination',"js/libs/laydate.dev"], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var url=testUrl + urls.allUrls.getOrderList;//商品列表地址
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			pageNo:1,
			pageSize:pageSize,
			status:null
		};//请求参数
		var callback=function(r){
			if(r.code=="0000"){
				if(r.hasOwnProperty('orderLists')){
					r.flag=true
				}else{
					r.flag=false
				}
				r.nav=nav;
				$("#right-container").html(_.template(tpl,r));
				var totalP=r.totalPages*pageSize;
				common.pageFun(totalP,pageNo,pageSize,page(requestData));//页码初始化
				eventBind();
			}
		};
		common.postData(url, requestData, callback, true);
		
		/*common.postData(testUrl+"/api/order/exportOrder",{},function(r){
			//var newBlob=new Blob([r],{type: "application/octet-binary"});
			//var url=window.URL.createObjectURL(newBlob);
			var a=document.createElement("a");
			a.href="/bid/"+r.url;
			a.download="aa.xls";
			a.textContent="下载"
			$("body").append(a);
		},true);*/
		
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
						if(r.hasOwnProperty('orderLists')){
							r.flag=true
						}else{
							r.flag=false
						}
						$("#orderList").html(_.template(loadHtml,r))
						window.scrollTo(0,0)
					}
				}
				common.postData(url,data,callback,true)
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
				pageSize:pageSize,
			};
			$.extend(data,baseData);
			var callback=function(r){
				if(r.code=="0000"){
					if(r.hasOwnProperty('orderLists')){
						r.flag=true
					}else{
						r.flag=false
					}
					
					var totalP=r.totalPages*pageSize;
					$("#orderList").html(_.template(loadHtml,r));//列表更新
					common.pageFun(totalP,1,pageSize,page(data));//页码初始化
				}
			};
			common.postData(url,data,callback,true)//数据请求
		}
		function eventBind(){
			
			//搜索功能
			$(".search-btn").bind("click",function(){
				var search=$(".search-input").val().trim();
				var data={};
				if(search){
					data.search=search;
				}else{
					data={
						startDate:$(".order-date").eq(0).val(),
						endDate:$(".order-date").eq(1).val()
					}
				};
				pageUpdate(data)
			})
            $(".search-input").keydown(function(event){
                if(event.keyCode == 13) {
                    $(".search-btn").click();
                }
            });
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
			//子导航选择
			$(".secondary-title").click(function(){
				$(this).addClass("secondary-active").siblings().removeClass("secondary-active");
				switch($(this).text()){
					case "待结算":status=6;
					break;
					case "结算中":status=10;
					break;
					case "已完成":status=11;
					break;
					case "全部订单":status=null;
					break;
				}
				pageUpdate({status:status})
			})
			//状态选择
			$(".order select").change(function(){
				var status=parseInt($(this).val());
				pageUpdate({status:status})
			})
			//页面详情页自导航跳转
			var index=common.getQueryString("index");
			if(index){
				$(".secondary-title").eq(index-1).click()
			}
			//时间控件
			laydate({
				elem:"#startTime"
			})
			laydate({
				elem:"#endTime"
			})
		}
	};
	return controller;
});
