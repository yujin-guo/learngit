define(['text!module/bid/bidDetails.html', 'text!module/bid/header.html', 'text!module/bid/common_nav.html', 'css!module/bid/style/bidDetails.css'], function(tpl, header, nav) {
	var controller = function(id) {
		//判断是否登录
		if($.cookie("permissions")){
			userPermissions=JSON.parse($.cookie("permissions"));
		}else{
			location.href=" ";
		};
		appView.html(_.template(header));
		var url=bidUrl+urls.allUrls.getBidDetails;//结算单详情地址
		var data={
			id:id
		};
		var callback=function(r){
			if(r.resultCode=="0000"){
				var data={
					nav:nav,
					data:r,
				}
				$("#right-container").html(_.template(tpl,data));
				eventBind();
			}else{
				dialog({
					title:"提示",
					content:r.msg,
					modal:true,
					ok:function(){}
				}).width(320).show();
				return false;
			}
		};
		common.postData(url,data,callback,true);
		
		function eventBind(){
			//返回上一级
			$(".bid-details-back").bind("click",function(){
				window.location.href="#bid";
			})
			window.scrollTo(0,0)
			
			//子导航 跳转
			$(".secondary-title").bind("click",function(){
				var index=$(this).index()
				window.location.href="#bid?index="+index
			})
			//提交审核
			$(".bid-details-submit").bind("click",function(){
				var url=bidUrl+urls.allUrls.updateBidStatus,
					id=$("#bidDetailsId").val(),
					comment=$(".bid-details-comment").val().trim(),
					isPass=$("#bidPass").prop("checked")==true?true:false,
					requestData={
						id:id,
						isPass:isPass,
						comment:comment
					},
					callback=function(r){
						if(r.resultCode=="0000"){
							dialog({
								title:"提示",
								content:"提交成功",
								modal:true,
								okValue:"确定",
								ok:function(){
									location.href="#bid";
									window.scroll(0,0);
								},
								cancel:false
							}).width(320).show();
						}else{
							dialog({
								title:"提示",
								content:r.msg,
								modal:true,
								okValue:"确定",
								ok:function(){},
								cancel:false
							}).width(320).show();
						}
					};
				/*if(!comment){
					dialog({
						title:"提示",
						content:"审批意见不能为空。",
						modal:true,
						okValue:"确定",
						ok:function(){},
						cancel:false
					}).width(320).show();
					return false;
				}*/
				dialog({
					title:"提示",
					content:"确定提交吗？",
					modal:true,
					okValue:"确定",
					ok:function(){
						common.postData(url,requestData,callback,true);
					},
					cancelValue:"取消",
					cancel:function(){},
				}).width(320).show();
			})
			//菜单栏高度重置
			setTimeout(function(){
				var height=$(document).height()-50;
				$(".nav-left").height(height);
				$(".nav-inner-left").height(height);
			},500);
		}
	};
	return controller;
});
