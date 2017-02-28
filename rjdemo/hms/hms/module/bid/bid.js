define(['text!module/bid/bid.html','text!module/bid/header.html','text!module/bid/common_nav.html','text!module/bid/loadBid.html','css!module/bid/style/bid.css'],function(tpl,header,nav,loadHtml){
	var controller = function() {
		//判断是否登录
		if($.cookie("permissions")){
			userPermissions=JSON.parse($.cookie("permissions"));
		}else{
			location.href=" ";
		}
		appView.html(_.template(header));
		var url=bidUrl+urls.allUrls.getBidList,
			deptUrl=testUrl+urls.allUrls.getDepartmentList,
			size = 20,
			pageNo = 1,
			depts,
			requestData = {
				page:1,
				size:size
			},//请求参数
			callback=function(r){
				if(r.resultCode=="0000"){
					r.nav=nav;
					r.depts=depts;
					$("#right-container").html(_.template(tpl,r));
					if(r.entities){
						$(".page").show();
					}else{
						$(".page").hide();
					}
					common.pageFun(r.totalPage*size,1,size,page(requestData));//页码初始化
					eventBind();
				}else{
					dialog({
						title: '提示',
						modal:true,
						content: r.msg,
						ok: function () {
							location.href="";
						},
						cancel: false
					}).width(320).show();
				}
			},
			deptCallback=function(r){
				if(r.code=="0000"){
					depts=r.departmentItems;
					common.postData(url, requestData, callback, true);
				}else{
					dialog({
						title:"提示",
						content:r.message,
						modal:true,
						ok:function(){
							location.href="";
						},
						cancel:false
					}).width(320).show();
				}
			}
		common.postData(deptUrl,{},deptCallback,true);
		/**
		 * 分页回调函数设置
		 * @param {Object} data 添加的请求数据（默认请求page及size，且默认值不可更改）
		 * return {Function} 分页回调函数
		 * 
		 * */
		function page(data){
			var pageCallback=function(index){
				var baseData={
					page:index+1,
					size:size
				}
				$.extend(data,baseData);
				var callback=function(r){
					if(r.resultCode=="0000"){
						$("#bidList").html(_.template(loadHtml,r))
						statusUpdate()
						window.scrollTo(0,0)
					}
				}
				common.postData(url,data,callback,true)
			}
			return pageCallback;
		}
		/*
		 * 搜索页面更新
		 * @param {Object} data 添加的请求数据（默认请求page及size，且默认值不可更改）
		 * */
		function pageUpdate(data){
			var baseData={
				page:1,
				size:size,
			};
			$.extend(data,baseData);
			var callback=function(r){
				if(r.resultCode=="0000"){
					$("#bidList").html(_.template(loadHtml,r));//列表更新
					if(r.entities){
						$(".page").show();
					}else{
						$(".page").hide();
					};
					common.pageFun(r.totalPage*size,1,size,page(data));//页码初始化
					statusUpdate();
				}
			};
			common.postData(url,data,callback,true);
		}
		function eventBind(){
			//搜索功能
			$(".search-btn").bind("click",function(){
				var search=$(".search-input").val().trim(),
					status=parseInt($(".bid-status").val()),
					deptname=$(".bid-deptname").val().trim();
				var	data={
					search:search,
				};
				if(deptname!="全部部门"){
					data.deptname=deptname;
				}
				pageUpdate(data);
			})
            $(".search-input").keydown(function(event){
                if(event.keyCode == 13) {
                    $(".search-btn").click();
                }
            });
			//状态搜索
			$(".bid-status").change(function(){
				var $that=$(this);
				var data={
					status:parseInt($that.val()),
				};
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
				var status;
				$(this).addClass("secondary-active").siblings().removeClass("secondary-active");
				switch($(this).text()){
					case "初审中":status=10;
					break;
					case "终审中":status=40;
					break;
					case "全部竞价":status=null;
					break;
				}
				var data={
					status:status
				}
				pageUpdate(data)
			})
			//页面详情页自导航跳转
			var index=common.getQueryString("index");
			if(index){
				$(".secondary-title").eq(index-1).click()
			}
			statusUpdate();
		}
		//取消和审批通过竞价单	
		function statusUpdate(){
			//审批通过
			$(".bid-submit").bind("click",function(){
				var $that=$(this);
				var url=bidUrl+urls.allUrls.updateBidStatus,
					id=$(this).siblings(".bid-item-id").val();
				var	data={
						id:id,
						isPass:true,
						comment:""
					},
					callback=function(r){
						if(r.resultCode=="0000"){
							dialog({
								title:"提示",
								content:"审批已通过。",
								modal:true,
								ok:function(){
									var status=$that.parents("tr").find(".bid-list-status").val(),
										$elem=$that.parents("tr").find(".status-td");
									if(status==11){
										$elem.text('竞价中');
										$that.remove();
									};
									if(status==41){
										$that.remove();
									};
									if(status==42){
										$elem.text('已完成');
										$that.siblings(".bid-cancel").remove();
										$that.remove();
									};
								},
								cancel:false
							}).width(320).show();
						}else{
							dialog({
								title:"提示",
								content:r.msg,
								modal:true,
								ok:function(){},
								cancel:false
							}).width(320).show();
						}
					};
				dialog({
					title:"提示",
					content:"确定通过审批吗？",
					modal:true,
					okValue:"确定",
					ok:function(){
						common.postData(url,data,callback,true);
					},
					cancelValue:"取消",
					cancel:function(){},
				}).width(320).show();
			})
			//取消
			$(".bid-cancel").bind("click",function(){
				var $that=$(this);
				var url=bidUrl+urls.allUrls.cancelBid,
					id=$that.siblings(".bid-item-id").val(),
					data={
						id:id,
						comment:""
					},
					callback=function(r){
						if(r.resultCode=="0000"){
							dialog({
								title:"提示",
								content:"取消成功。",
								modal:true,
								ok:function(){
									$that.parents("td").siblings(".status-td").text("已取消");
									$that.siblings(".bid-submit").remove();
									$that.remove();
								},
								cancel:false
							}).width(320).show();
						}else{
							dialog({
								title:"提示",
								content:r.msg,
								modal:true,
								ok:function(){},
								cancel:false
							}).width(320).show();
						}
					}
				dialog({
					title:"提示",
					content:"确定取消吗？",
					modal:true,
					okValue:"确定",
					ok:function(){
						common.postData(url,data,callback,true);
					},
					cancelValue:"取消",
					cancel:function(){}
				}).width(320).show();
			})
		}
	};
	return controller;
});
