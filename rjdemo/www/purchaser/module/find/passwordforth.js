/*create by lijinhua*/
define(['text!module/find/password_forth.html','text!module/header/nav.html','css!module/home/style/style.css?','css!module/procurment/style/procurment.css','css!module/procurment/style/provider.css','css!module/find/style/find.css'],function(tpl,nav){
	var controller=function(){
		
		$(".header").css("display","none");
		var allDatas={
			nav:nav
		};
		appView.html(_.template(tpl,allDatas));
	};
	return controller;
});