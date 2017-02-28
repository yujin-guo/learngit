define(['text!module/personal/personal_success.html','css!module/personal/style/personal.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
		var keyword=common.getQueryString("key");
		switch(keyword){
			case 'editPerson':
				$("#personal-header-title").text("修改信息");
				$("#desc").text("你已成功修改信息");
				$(".success-a").prop("href","#personal");
				common.tabFocus("基本信息");
				break;
			case 'editPassword':
				$("#personal-header-title").text("修改密码");
				$("#desc").text("你已成功修改密码");
				$(".success-a").prop("href","#editpass?key=editPassword");
				common.tabFocus("修改密码");
				break;
			default:
				dialog({
                    title: '提示',
                    modal: true,
                    content: "操作失败",
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
		}
		
	};
	return controller;
});