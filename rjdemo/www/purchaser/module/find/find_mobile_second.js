/*create by lijinhua*/
define(['text!module/find/find_mobile_second.html','text!module/header/nav.html','module/find/mobile','css!module/home/style/style.css?','css!module/procurment/style/procurment.css','css!module/procurment/style/provider.css','css!module/find/style/find.css'],function(tpl,nav,deal){
	var controller=function(){
		$(".header").css("display","none");
		appView.html(nav+tpl);
		deal();
	};
	return controller;
});