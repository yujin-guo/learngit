define(['text!module/brand/certificationSuccess.html','css!module/brand/style/certificationBrand.css'],function(tpl){
	var controller=function(){
		appView.html(_.template(tpl));
		common.tabFocus("品牌管理");
	}
	
	return controller;
});