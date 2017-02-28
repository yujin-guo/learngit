/*create by lijinhua*/
define(['text!module/procurment/invitelink.html', 'text!module/header/nav.html', 'css!module/home/style/style.css?', 'css!module/procurment/style/procurment.css?', 'css!module/procurment/style/provider.css?'], function(tpl, nav, protocol) {
	var controller = function() {
		$(".header").remove();
		//appView.html(nav+tpl);
		var urlToken = baseUrl + urls.allUrls.checkEmailLink;
		var checkData = {
			account: decodeURIComponent(common.getQueryString("account")),
			token: common.getQueryString("token")
		};
		common.postData(urlToken, checkData, checkCallback, true);

		function checkCallback(datas) {
			if(datas.code == "0000") {

				var htmlData = {
					nav: nav,
					org: decodeURIComponent(common.getQueryString("orgName")),
					person: decodeURIComponent(common.getQueryString("person")),
					department: decodeURIComponent(common.getQueryString("depName")),
					email: decodeURIComponent(common.getQueryString("account")),
					orgId: decodeURIComponent(common.getQueryString("orgId")),
					token: common.getQueryString("token"),
					departmentId: common.getQueryString("depId")
				};
				appView.html(_.template(tpl, htmlData));

				var _key = common.getQueryString('account');
				$('#login-email').text(decodeURIComponent(_key));
			} else if(datas.code == "1015") {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
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