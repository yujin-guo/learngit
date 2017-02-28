define(['text!module/personal/personal_edit.html', 'module/personal/personal_validate', 'js/libs/area', 'css!module/personal/style/personal.css'], function(tpl, deal) {
	var controller = function() {
		common.tabFocus("基本信息");
		var personData = {};
		var callbackPerson = function(datas) {
			if(datas.code == "0000") {
				if(datas.address == undefined) {
					datas.address = null;
				}
				if(datas.telephone == undefined) {
					datas.telephone = null;
				}
				if(datas.qq == undefined) {
					datas.qq = null;
				}
				appView.html(_.template(tpl, datas));
				deal();
				//opt0=[datas.province,datas.city,datas.county]
				_init_area();
				$("#s_province").val(datas.province);
				change(1);
				$("#s_city").val(datas.city);
				change(2);
				$("#s_county").val(datas.county);

				//时时监听高亮提交按钮
				$('#mobile').on('input', function() {
					var inputL = $("#mobile");
					var num = 0;
					//console.log(inputL[1])
					for(var i = 0; i < inputL.length; i++) {
						if(!$(inputL[i]).val()) {
							num++;
						}
					}
					if(num === 0) {
						$("#mobile").parent().nextAll(".error-wrap").html(null);
					} else {
						$("#mobile").parent().nextAll(".error-wrap").html("<label class='code-error'>请输入需要更换的手机号码</label>");
					}
				})

				//for ie
				if(document.all) {
					$('#mobile').each(function() {
						var that = this;
						if(this.attachEvent) {
							this.attachEvent('onpropertychange', function(e) {
								if(e.propertyName != 'value') return;
								$(that).trigger('input');
							});
						}
					})
				}
			} else if(datas.code == "1020") {
				$("#out-provider").click();
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
		common.postData(baseUrl + urls.allUrls.getProviderPerson, personData, callbackPerson, true);
	};
	return controller;
});