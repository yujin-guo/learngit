/*create by lijinhua*/
define(['text!module/procurment/procurment_register.html', 'module/procurment/procurment_login', 'text!module/header/nav.html', 'text!module/procurment/protocol.html', 'css!module/home/style/style.css?', 'css!module/procurment/style/procurment.css?', 'css!module/procurment/style/provider.css?'], function(tpl, deal, nav, protocol) {
	var controller = function() {
		$(".header").css("display","none");
		
		var htmlData = {
			nav: nav,
			protocol: protocol,
			org:decodeURIComponent(common.getQueryString("orgName")),
			person:decodeURIComponent(common.getQueryString("person")),
			department:decodeURIComponent(common.getQueryString("depName"))
		};
		appView.html(_.template(tpl, htmlData));
		deal();
		
		/*勾选服务协议*/
		$("#protocol-checkbox").on("click", function() {
			if($(this).prop("checked")) {
				$("#confirm").addClass("active-input").removeAttr("disabled");
			} else {
				$("#confirm").removeClass("active-input").prop("disabled", true);
			}
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