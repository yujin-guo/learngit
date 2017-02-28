/*create by lijinhua*/
define(['text!module/procurment/provider_forth.html','text!module/header/nav.html','css!module/home/style/style.css?','css!module/procurment/style/procurment.css','css!module/procurment/style/provider.css'],function(tpl,nav){
	var controller=function(){
		$(".header").css("display","none");
		appView.html(nav+tpl);
		var keyword=decodeURIComponent(common.getQueryString("key"));
		$("#email").text(keyword);
	};
	return controller;
});