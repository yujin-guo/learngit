/*create by lijinhua*/
define(['text!module/procurment/provider_third.html', 'module/procurment/provider_register', 'text!module/header/nav.html', 'css!module/home/style/style.css?', 'css!module/procurment/style/procurment.css', 'css!module/procurment/style/provider.css'], function(tpl, deal, nav) {
	var controller = function() {
		$(".header").css("display","none");
		var urlToken = common.providerBaseUrl + urls.allUrls.checkEmailLink;
		var checkData = {
			account: decodeURIComponent(common.getQueryString("email")),
			token: common.getQueryString("token")
		};
		common.postData(urlToken, checkData, checkCallback, true);

		function checkCallback(datas) {
			if(datas.code == "0000") {
				appView.html(nav + tpl);
				deal();

				//时时监听高亮提交按钮
				$('.common').on('input', function() {
					var inputL = $(".common");
					var num = 0;
					//console.log(inputL[1])
					for(var i = 0; i < inputL.length; i++) {
						if(!$(inputL[i]).val()) {
							num++;
						}
					}
					if(num === 0) {
						$("#confirm").addClass("active-input").removeAttr("disabled");

					} else {
						$("#confirm").removeClass("active-input").prop("disabled", true);;
					}
				});

				//for ie
				if(document.all) {
					$('.common').each(function() {
						var that = this;
						if(this.attachEvent) {
							this.attachEvent('onpropertychange', function(e) {
								if(e.propertyName != 'value') return;
								$(that).trigger('input');
							});
						}
					})
				}
			} else if(datas.code == "1015") {
				dialog({
					title: '提示',
					modal: true,
					content: datas.message,
					ok: function() {
						window.location.href="#providerfirst?key=login";
					},
					cancel: false,
				}).width(320).show();
			} else{
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