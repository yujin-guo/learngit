/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods', 'js/urls'], function(validates, validator, urls) {
	var register = function() {
		var purchaseLoginUrl = urls.allUrls.purchaseRegister;
		var email = common.getQueryString("account");
		var orgId = common.getQueryString("orgId");
		var token = common.getQueryString("token");
		//var account = common.getQueryString("account");
		var departmentId = common.getQueryString("depId");

		/*倒计时*/
		var seconds = 60;
		var times = null;
		clearTimeout(times);

		function clockFun() {
			seconds--;
			if(seconds != 0) {
				$("#get-code").html("剩" + seconds + "秒");
				times = setTimeout(clockFun, 1000);
			} else {
				$("#get-code").html("获取验证码");
				seconds = 60;
				clearTimeout(times);
				$("#get-code").unbind().bind("click", getEvent);

				$("#get-code").css({
					"background-color": "#008cd0",
					"color": "#fff"
				});
				return false;
			}
		};

		/*获取验证码回调函数*/
		function callbackFun(params) {
			if(params.code == "0000") {
				$("#get-code").unbind();
				$("#get-code").css({
					"background-color": "#e5e5e5",
					"color": "#666"
				});
				$(".flag").removeClass("flag");
				$("#mobile").nextAll(".procure-error").html(null);

				clockFun();
			} else {
				$("#mobile").nextAll(".procure-error").html("<label class='code-error'>" + params.message + "</label>");
			}
		};

		//获取手机验证码函数封装
		function getEvent() {
			var checkFlag = common.checkMobileFun($('#mobile').val());
			//console.log(checkFlag, $('#mobile').val());
			if(checkFlag === true) {
				var codeData = {
					mobile: $.trim($('#mobile').val()),
					useraction: "BuyerRegister"
				};
				common.postData(baseUrl + urls.allUrls.getMobileCode, codeData, callbackFun, true);
			} else {
				$("#mobile").nextAll(".procure-error").html("<label class='code-error'>请输入正确的手机号码</label>");
			}
		}

		//监听手机验证码高亮
		$('#mobile').on('input', function() {
			var mt=$(this);
			if(seconds == 60) {
				if(common.checkMobileFun(mt.val())) {
					$("#get-code").css({
						"background-color": "#008cd0",
						"color": "#fff"
					});

					//获取手机验证码触发动作
					$("#get-code").unbind().bind("click", getEvent);
				} else {
					$("#get-code").css({
						"background-color": "#e5e5e5",
						"color": "#666"
					});
					$("#get-code").unbind();
				}
			}else{
				return false;
			}

		});

		$(".common").bind({
			focus: function() {
				if($(this).attr("name") == "validatecode") {
					$(this).parent().css("border-color", "#008cd0");//.nextAll(".procure-error").find(".code-error").remove();
				} else {
					$(this).css("border-color", "#008cd0");
					//$(this).nextAll(".procure-error").find(".code-error").remove();
				}

			},
			blur: function() {
				if($(this).attr("name") == "validatecode") {
					$(this).parent().css("border-color", "#999");
				} else
					$(this).css("border-color", "#999");
			}
		});
		//表单验证
		$("#register-form").validate({
			rules: {
				email: {
					required: true,
					email: true
				},
				password: {
					required: true,
					checkPassword: true
				},
				passagin: {
					required: true,
					equalTo: "#password"
				},
				name: {
					required: true,
					checkName: true
				},
				mobile: {
					required: true,
					minlength: 11,
					maxlength: 11,
					checkMobile: true
				},
				validatecode: {
					required: true,
					minlength: 6,
					maxlength: 6
				},
				address: {
					required: true
				}
			},
			messages: {
				email: {
					required: "此项为必填项",
					email: "请输入正确格式的电子邮件"
				},
				password: {
					required: "此项为必填项"
				},
				passagin: {
					required: "此项为必填项",
					equalTo: "两次输入密码不一致"
				},
				name: {
					required: "此项为必填项"
				},
				mobile: {
					required: "此项为必填项",
					minlength: "请填写11位手机号码",
					maxlength: "请填写11位手机号码"
				},
				validatecode: {
					required: "请输入验证码",
					minlength: "请填写6位验证码",
					maxlength: "请填写6位验证码"
				},
				address: {
					required: "此项为必填项"
				}
			},
			errorPlacement: function(error, element) {
				if($(element).attr("name") == "validatecode") {
					$(element).parent().nextAll(".procure-error").append(error);
				}
				$(element).nextAll(".procure-error").append(error);
			},
			submitHandler: function() {
				var submitFun = (function() {
					var baseUrl = common.serverBaseUrl;
					var data = {
						password: $.trim($('#password').val()),
						name: $.trim($('#name').val()),
						mobile: $.trim($('#mobile').val()),
						pin: $.trim($('#pin').val()),
						email: email,
						token: token,
						orgId: orgId,
						departmentId: departmentId
					};
					var callbackFun = function(datas) {
						window.scrollTo(0, 0);
						if(seconds != 60) {
							$("#get-code").unbind();
						}

						if(datas.code == "0000") {
							clearTimeout(times);
							window.location.href = "#success?key=" + encodeURIComponent($.trim($('#email').val()), 'utf8');
						} else if(datas.code == "1010" || datas.code == "1011") {
							$("#pin").parent().nextAll(".procure-error").html("<label class='code-error'>" + datas.message + "</label>");
						}else if(datas.code == "1013" || datas.code == "1014") {
							$("#mobile").nextAll(".procure-error").html("<label class='code-error'>" + datas.message + "</label>");
							$("#mobile").focus();
						}else {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}
					};
					return {
						//提交表单信息
						submitMethod: function() {
							common.postData(baseUrl + purchaseLoginUrl, data, callbackFun, true);
						}
					};
				})();
				submitFun.submitMethod();
			},
			success: function(element) {
				$(element).addClass("code-success");
			},
			highlight: function(element, errorClass) {
				if($(element).attr("name") == "validatecode") {
					$(element).parent().css("border-color", "#ff5555");
					$(element).parent().nextAll(".procure-error").find("label").removeClass("code-success");
				} else {
					$(element).css("border-color", "#ff5555");
					$(element).nextAll(".procure-error").find("label").removeClass("code-success");
				}
			}
		});
	}
	return register;
});