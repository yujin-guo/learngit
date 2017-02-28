/*create by lijinhua*/
define(['text!module/procurment/procurment_success.html','text!module/header/nav.html','common','css!module/home/style/style.css?','css!module/procurment/style/procurment.css','css!module/procurment/style/provider.css?'],function(tpl,nav,common){
	var controller=function(){
		
		$(".header").remove();
		var allDatas={
			nav:nav
		};
		appView.html(_.template(tpl,allDatas));
		var _key=common.getQueryString('key');
		$('#login-email').text(decodeURIComponent(_key));
	};
	return controller;
});