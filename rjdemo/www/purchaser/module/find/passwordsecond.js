/*create by lijinhua*/
define(['text!module/find/password_second.html', 'text!module/header/nav.html', 'css!module/home/style/style.css?', 'css!module/procurment/style/procurment.css', 'css!module/procurment/style/provider.css', 'css!module/find/style/find.css'], function(tpl, nav) {
	var controller = function() {
		
		$(".header").css("display","none");
		var allDatas = {
			nav: nav
		};
		appView.html(_.template(tpl, allDatas));

		var _key = decodeURIComponent(common.getQueryString("key"));
		$("#find-email").html(_key);
		var emailFlag = _key.split("@")[1];
		var linkEmail = baseUrl + urls.allUrls.jumpingEmail;
		var dataEmail = {
			email: emailFlag
		}

		//common.postData(linkEmail, dataEmail, emailCallback, true);

		function emailCallback(datas) {
			if(datas.code == "0000") {
				$("#login-email").prop("href", datas.url);
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
		
		$("#again-send").on("click", function() {
			/*找回密码第一步数据*/
			var getCodeData = {
				account: _key
			};

			/*找回密码第一步回调函数*/
			var callbackGetFun = function(datas) {
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

			common.postData(baseUrl + urls.allUrls.postEmailLink, getCodeData, callbackGetFun, true);

		});
	};
	return controller;
});