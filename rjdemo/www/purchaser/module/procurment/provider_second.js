/*create by lijinhua*/
define(['text!module/procurment/provider_second.html', 'text!module/header/nav.html', 'css!module/home/style/style.css?', 'css!module/procurment/style/procurment.css', 'css!module/procurment/style/provider.css'], function(tpl, nav) {
	var controller = function() {
		$(".header").css("display","none");
		appView.html(nav + tpl);
		var keyword = decodeURIComponent(common.getQueryString("key"));
		var pass = decodeURIComponent(common.getQueryString("pass"));

		//重新发送邮箱
		$("#again-send").on("click", function() {

			/*注册*/
			var loginOneData = {
				email: keyword,
				password: pass
			};

			var callbackFunLoginOne = function(datas) {
				if(datas.code == "0000") {
					dialog({
						title: '提示',
						modal: true,
						content: "邮件已重发成功，请查收！",
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}else{
					dialog({
						title: '提示',
						modal: true,
						content: datas.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			};
			common.postData(common.providerBaseUrl + urls.allUrls.providerRegister, loginOneData, callbackFunLoginOne, true);
		});

		$("#email-show").text(keyword);
		var flag = keyword.split("@")[1];

		$("#login-email").on("click", function() {
			var data = {
				email: flag
			};
			var callbackFun = function(datas) {
				if(datas.code === "0000") {
					window.location.href = datas.url;
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: datas.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			};
			common.postData(baseUrl + urls.allUrls.jumpingEmail, data, callbackFun, true);
		});

	};
	return controller;
});