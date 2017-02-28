define(['text!module/hospital/apply_waiting.html','css!module/hospital/style/hospital.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
		common.tabFocus("医院管理");
	};
	return controller;
});