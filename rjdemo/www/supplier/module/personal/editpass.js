define(['text!module/personal/edit_pass.html','module/personal/personal_validate','css!module/personal/style/personal.css'],function(tpl,deal){
	var controller=function(){
		common.tabFocus("修改密码");
		appView.html(tpl);
		deal();
	};
	return controller;
});