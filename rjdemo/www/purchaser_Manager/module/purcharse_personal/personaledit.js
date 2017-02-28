define(['text!module/purcharse_personal/edit.html', 'module/purcharse_personal/personalevent', 'css!module/purcharse_personal/style/personal.css'], function(tpl, event) {
	var controller = function() {
		var callbackPersonEdit = function(datas) {
			if(datas.code == "0000") {

				var getCode = urls.allUrls.getCode,
					getPersonal = urls.allUrls.getPurcharsePerson;
				//模块内容
				$('#right-container').html(_.template(tpl, datas));
				event();

				/*倒计时*/
				var seconds = 60;
				var clockFun = function() {
					seconds--;
					if(seconds != 0) {
						$("#personal-code").html("剩" + seconds + "秒");
						setTimeout(clockFun, 1000);
					} else {
						$("#personal-code").html("获取验证码");
						seconds = 60;
						return false;
					}

				};

				/*验证码输入框*/
				var mobilephone = $("#mobilephone").val();
				$("#mobilephone").bind("blur", function() {
					if($(this).val() != mobilephone) {
						$(".flag").removeClass("flag");
					} else {
						return false;
					}
				});

				/*获取手机验证码*/
				$("#personal-code").on("click", function() {
					if($("#mobilephone").val() != mobilephone) {
						$(".flag").removeClass("flag");
						var dataPhone = {
							mobile: $.trim($("#mobilephone").val()),
							useraction: "update"
						};
						var callbackPhoneFun = function(datas) {
							if(datas.code == "0000") {
								/*倒计时*/
								clockFun();
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
						common.postData(baseUrl + getCode, dataPhone, callbackPhoneFun, true);
					} else {
						return false;
					}

				});

			} else {
				$("#outLogin").click();
			}
		};
		common.postData(baseUrl + getPersonal, {}, callbackPersonEdit, true);

	}
	return controller;
});