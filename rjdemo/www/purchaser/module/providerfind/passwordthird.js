/*create by lijinhua*/
define(['text!module/providerfind/password_third.html', 'text!module/header/nav.html', 'module/providerfind/find', 'css!module/home/style/style.css?', 'css!module/procurment/style/procurment.css', 'css!module/procurment/style/provider.css', 'css!module/find/style/find.css'], function(tpl, nav, deal) {
	var controller = function() {
		$(".header").css("display","none");
		var urlToken = common.providerBaseUrl + urls.allUrls.checkEmailLink;
		var checkData = {
			account: decodeURIComponent(common.getQueryString("account")),
			token: common.getQueryString("token")
		};
		common.postData(urlToken, checkData, checkCallback, true);

		function checkCallback(datas) {
			if(datas.code == "0000") {
				appView.html(nav + tpl);
				deal();
			} else if(datas.code == "1015") {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {
						window.location.href="#profindpassword";
					},
					cancel: false,
				}).width(320).show();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}

	};
	return controller;
});