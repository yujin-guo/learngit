/*create by lijinhua*/
define(['text!module/providerfind/find_mobile_third.html','text!module/header/nav.html','css!module/home/style/style.css?','css!module/procurment/style/procurment.css','css!module/procurment/style/provider.css','css!module/providerfind/style/find.css'],function(tpl,nav){
	var controller=function(){
		$(".header").css("display","none");
		var allDatas={
			nav:nav
		};
		appView.html(_.template(tpl,allDatas));
	};
	return controller;
});