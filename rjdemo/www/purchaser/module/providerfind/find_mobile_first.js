/*create by lijinhua*/
define(['text!module/providerfind/find_mobile_first.html', 'text!module/header/nav.html', 'module/providerfind/mobile', 'css!module/procurment/style/procurment.css?', 'css!module/procurment/style/provider.css?', 'css!module/providerfind/style/find.css?'], function(tpl, nav, deal) {
	var controller = function() {
		$(".header").css("display","none");
		appView.html(nav + tpl);
		deal();
	};
	return controller;
});