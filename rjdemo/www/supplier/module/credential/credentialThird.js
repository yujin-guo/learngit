define(['text!module/credential/credentialThird.html','css!module/credential/style/credential.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
		common.tabFocus("资质认证");
	}
	return controller;
});