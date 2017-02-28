/*create by lijinhua*/
define(['text!module/find/password.html', 'text!module/header/nav.html', 'module/find/find', 'css!module/procurment/style/procurment.css?', 'css!module/procurment/style/provider.css?', 'css!module/find/style/find.css?'], function(tpl, nav, deal) {
	var controller = function() {
		$(".header").css("display","none");
		
		appView.html(nav + tpl);
		deal();
		
		//图片验证码
		var getPicCode=urls.allUrls.getFindPassPicCode;
		$("#codeImg").prop("src",baseUrl+getPicCode);
		$("#change-code").on("click", function() {
			var url = baseUrl+getPicCode+"?seq="+Date.parse(new Date());
			$("#codeImg").prop("src",url);
		});
	};
	return controller;
});