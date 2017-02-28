/*create by lijinhua*/
define(['text!module/providerfind/password.html', 'text!module/header/nav.html', 'module/providerfind/find', 'css!module/procurment/style/procurment.css?', 'css!module/procurment/style/provider.css?', 'css!module/providerfind/style/find.css?'], function(tpl, nav, deal) {
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