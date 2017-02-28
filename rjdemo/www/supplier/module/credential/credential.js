define(['text!module/credential/credential.html', 'css!module/credential/style/credential.css'], function(tpl) {
	var controller = function() {
		var accreditationInfoUrl = baseUrl + urls.allUrls.getAccreditationInfo;
		var credentialCallback = function(datas) {
			if(datas.code == "0000") {
				var credentialData = {
					credential: datas
				}
				appView.html(_.template(tpl, credentialData));
				common.tabFocus("资质认证");
			} else if(datas.code == "1020") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		};
		common.postData(accreditationInfoUrl, {}, credentialCallback, true);
	};
	return controller;
});