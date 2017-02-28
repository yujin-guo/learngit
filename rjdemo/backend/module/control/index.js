define(['text!module/control/index.html', 'text!module/control/header.html', 'css!module/control/style/control.css'], function(tpl, header) {
	var controller = function() {
		appView.html(_.template(header));
		$("#right-container").html(_.template(tpl));
		$(".infomation").html("欢迎来到平台管理系统");
	};
	return controller;
});