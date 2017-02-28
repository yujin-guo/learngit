define(['text!module/supply/supply.html','text!module/supply/header.html','text!module/supply/common_nav.html','text!module/supply/loadSupply.html','css!module/supply/style/supply.css',"js/libs/laydate.dev"],function(tpl,header,nav,loadHtml){
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		var url=testUrl+urls.allUrls.getSuppliers;//供应商列表
		var pageSize = 20;
		var pageNo = 1;
		var requestData = {
			pageNo:1,
			pageSize:pageSize
		};//请求参数
		var callback=function(r){
			if(r.code="0000"){
				if(r.hasOwnProperty("suppliers")){
					r.flag=true;
				}else{
					r.flag=false;
				}
				r.nav=nav;
				$("#right-container").html(_.template(tpl,r));
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
						if(r.hasOwnProperty("suppliers")){
							r.flag=true;
						}else{
							r.flag=false;
						}
						$("#supplierList").html(_.template(loadHtml,r));
						statusUpdate();
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
					if(r.hasOwnProperty("suppliers")){
						r.flag=true
					}else{
						r.flag=false
					}
				
					var totalP=r.totalPages*pageSize;
					$("#supplierList").html(_.template(loadHtml,r));//列表更新
					common.pageFun(totalP,1,pageSize,page(data));//页码初始化
					statusUpdate();
				}
			};
			common.postData(url,data,callback,true)//数据请求
		}
		function eventBind(){
			//时间控件
			laydate({
				elem:"#startTime"
			})
			laydate({
				elem:"#endTime"
			})
			//搜索功能
			$(".search-btn").bind("click",function(){
				var search=$(".search-input").val().trim();
                if($(".supply-date").eq(0).val()==""&&$(".supply-date").eq(1).val()!=""){
                    var	data={
                        querySet:{
                            queryTerm:search||null,
                            startTime:"1070-01-01",
                            endTime:$(".supply-date").eq(1).val()
                        }
                    }
                }
                if($(".supply-date").eq(1).val()==""&&$(".supply-date").eq(0).val()!=""){
                    var	data={
                        querySet:{
                            queryTerm:search||null,
                            startTime:$(".supply-date").eq(0).val(),
                            endTime:common.getDate()
                        }
                    }
                }
                else{
                    var	data={
                        querySet:{
                            queryTerm:search||null,
                            startTime:$(".supply-date").eq(0).val(),
                            endTime:$(".supply-date").eq(1).val()
                        }
                    }
                }
				
				pageUpdate(data);
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
			//子导航选择
			$(".secondary-title").click(function(){
				$(this).addClass("secondary-active").siblings().removeClass("secondary-active");
				switch($(this).text()){
					case "审核中":status=1;
					break;
					case "已入驻":status=2;
					break;
					case "未通过":status=3;
					break;
					case "全部供应商":status=-1;
					break;
				}
				var data={
					querySet:{
						status:status
					}
				}
				pageUpdate(data)
			})
			//状态选择
			$(".supply select").change(function(){
				var status=parseInt($(this).val());
				var data={
					querySet:{
						status:status
					}
				}
				pageUpdate(data);
			})
			//页面详情页自导航跳转
			var index=common.getQueryString("index");
			if(index){
				$(".secondary-title").eq(index-1).click();
			}
			statusUpdate();
		}
		//拉到黑名单和解除黑名单		
		function statusUpdate(){
			var updateUrl=testUrl+urls.allUrls.updateSupplierStatus;
			//拉到黑名单
			function blacklist(){
				var that=$(this);
				var data={
					supplierCode:$(this).parent().siblings(".apply-id").text(),
					status:6
				};
				var callback=function(r){
					dialog({
						title: '提示',
						modal:true,
						content: '拉到黑名单成功。',
						ok: function () {},
						cancel: false
					}).width(320).show();
					var keyword=$(".secondary-active").text().trim();
					if(keyword=="全部供应商"){
						that.text("解除黑名单");
						that.removeClass().unbind("click").addClass("supply-remove-blacklist").click(removeBlacklist);
						that.parent().siblings(".status-td").text("黑名单");
					}else{
						that.parents("tr").remove();
					}
				};
				common.postData(updateUrl,data,callback,true)
			}
			$(".supply-blacklist").bind("click",blacklist)
			//解除黑名单
			function removeBlacklist(){
				var that=$(this);
				var data={
					supplierCode:$(this).parent().siblings(".apply-id").text(),
					status:3
				};
				var callback=function(r){
				
					dialog({
						title: '提示',
						modal:true,
						content: '解除黑名单成功。',
						ok: function () {},
						cancel: false
					}).width(320).show();
					var keyword=$(".secondary-active").text().trim();
					if(keyword=="全部供应商"){
						that.text("拉到黑名单");
						that.removeClass().unbind("click").addClass("supply-blacklist").click(blacklist);
						that.parent().siblings(".status-td").text("已入驻");
					}else{
						that.parents("tr").remove();
					}
				};
				common.postData(updateUrl,data,callback,true);
			}		
			$(".supply-remove-blacklist").bind("click",removeBlacklist);
		}
	};
	return controller;
});