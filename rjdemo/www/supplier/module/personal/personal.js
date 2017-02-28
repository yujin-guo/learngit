define(['text!module/personal/personal.html', 'css!module/personal/style/personal.css'], function(tpl) {
	var controller = function() {
		common.tabFocus("基本信息");
		var personData = {};
		var callbackPerson = function(datas) {
			if(datas.code == "0000") {
				if(datas.telephone == undefined) {
					datas.telephone = null;
				}
				if(datas.address == undefined) {
					datas.address = null;
				}
				if(datas.province == undefined) {
					datas.province = null;
				}
				if(datas.city == undefined) {
					datas.city = null;
				}
				if(datas.county == undefined) {
					datas.county = null;
				}
				if(datas.qq == undefined) {
					datas.qq = null;
				}
				appView.html(_.template(tpl, datas));

				$.cookie('userReal', datas.name, {
					path: '/'
				});
			} else {
				$("#out-provider").click();
			}
		};
		common.postData(baseUrl + urls.allUrls.getProviderPerson, personData, callbackPerson, true);
	};
	return controller;
});