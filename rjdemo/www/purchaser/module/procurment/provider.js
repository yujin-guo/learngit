/*create by lijinhua*/
define(['text!module/procurment/provider_register.html', 'module/procurment/provider_register', 'text!module/header/nav.html', 'text!module/procurment/protocol.html', 'css!module/procurment/style/procurment.css?', 'css!module/procurment/style/provider.css?'], function(tpl, deal, nav,protocol) {
	var controller = function() {
		$(".header").css("display","none");
		var datas={
			protocol:protocol,
			nav:nav
		}
		appView.html(_.template(tpl,datas));
		deal();

		/*图形验证码*/
		var imgSrc = common.providerBaseUrl + urls.allUrls.getFindPassPicCode;
		$(".code-img").prop("src", imgSrc);
		$(".code-img").click(function() {
			$(".code-img").prop("src", imgSrc + "?time=" + Date.parse(new Date()));
		});

		//服务协议
		$(".protocol-link").on("click", function() {
			$(".protocol-wrap,.protocol-wrap-01").addClass("show");
		});

		//关闭协议
		$(".close,.protocol-wrap").on("click", function() {
			$(".protocol-wrap,.protocol-wrap-01").removeClass("show");
		});
	};
	return controller;
});