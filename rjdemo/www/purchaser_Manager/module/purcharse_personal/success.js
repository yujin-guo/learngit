define(['text!module/purcharse_personal/success.html','css!module/purcharse_personal/style/personal.css'],function(tpl){
	var controller=function(){
		//模块内容
		$('#right-container').html(tpl);
		var key=common.getQueryString('keyword');
		
		switch(key){
			case 'editPersonal':
				$("#header-span").html("修改个人信息");
				$("#success-p").html("您已成功修改个人资料");
				break;
			case 'editPass':
				$("#header-span").html("修改账号密码");
				$("#success-p").html("您已成功修改密码");
				common.tabFocus("修改密码");
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#personal' class='purchase-bread'>基本信息</a></span><span class='bread-span'>&gt;&nbsp;<a href='#editpass?keyword=editPass' class='purchase-bread'>修改密码</a></span><span class='bread-span'>&gt;&nbsp;修改成功</span>");
				break;
			default:
				break;
			
		}
		
	}
//	console.log(tpl)
	return controller;
});