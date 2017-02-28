define(['text!module/config/configDetails.html', 'text!module/config/header.html', 'text!module/config/common_nav.html', 'css!module/bid/style/configDetails.css'], function(tpl, header, nav) {
	var controller = function(statementNo,status) {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		$("#right-container").html(_.template(tpl,{nav:nav,status:0}))
		
		var url=testUrl+urls.allUrls.getStatementDetail;//结算单详情地址
		var data={
			statementNo:statementNo
		};
		var callback=function(r){
			if(r.code=="0000"){
				var data={
					nav:nav,
					data:r,
					status:status,
				}
				$("#right-container").html(_.template(tpl,data))
				eventBind()
			}
		}
		//common.postData(url,data,callback,true)
		
		function eventBind(){
			//返回上一级
			$(".account-details-back").bind("click",function(){
				window.location.href="#account";
			})
			window.scrollTo(0,0)
			
			//子导航 跳转
			$(".secondary-title").bind("click",function(){
				var index=$(this).index()
				window.location.href="#account?index="+index
			})
			//接受资料和提交财务
			var updateUrl=testUrl+urls.allUrls.updateStatus;
			$(".account-details-receive").bind("click",function(){
				var data={
					statementNo:statementNo,
					status:1
				};
				var callback=function(r){
					dialog({
						title: '提示',
						modal:true,
						content: '接收资料成功。',
						ok: function () {},
						cancel: false,
					}).width(320).show();
				};
				common.postData(updateUrl,data,callback,true)
			})
			$(".account-details-submit").bind("click",function(){
				var data={
					statementNo:statementNo,
					status:2
				};
				var callback=function(r){
					dialog({
						title: '提示',
						modal:true,
						content: '提交财务成功。',
						ok: function () {},
						cancel: false,
					}).width(320).show();
					};
				common.postData(updateUrl,data,callback,true)
			})
			
		}
	};
	return controller;
});
