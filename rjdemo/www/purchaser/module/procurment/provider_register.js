/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods'], function(validates, validator) {
	var register = function() {

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

				$("#get-code").css({
					"background-color": "#008cd0",
					"color": "#fff"
				});
				seconds = 60;
				clearTimeout(times);
				$("#get-code").unbind().bind("click", getEvent);
				return false;
			}

		};

		/*获取验证码回调函数*/
		function callbackFun(params) {
			if(params.code == "0000") {
				$("#get-code").unbind();
				$(".flag").removeClass("flag");
				$("#code").parent().nextAll(".provider-error").html(null);
				$("#mobile").nextAll(".provider-error").html(null);

				//显灰按钮
				$("#get-code").css({
					"background-color": "#e5e5e5",
					"color": "#666"
				});
				clockFun();
			} else if(params.code == "1013") {
				$("#mobile").nextAll(".provider-error").html("<em class='error'>" + params.message + "</em>");
			} else {
				$("#code").parent().nextAll(".provider-error").html("<em class='error'>" + params.message + "</em>");
			}
		};

		//获取手机验证码函数封装
		function getEvent() {
			var checkFlag = common.checkMobileFun($('#mobile').val());
			//console.log(checkFlag, $('#mobile').val());
			if(checkFlag === true) {
				var codeData = {
					mobile: $.trim($('#mobile').val()),
					useraction: "SuppActivate"
				};
				common.postData(common.providerBaseUrl + urls.allUrls.getMobileCode, codeData, callbackFun, true);
			} else {
				$("#mobile").nextAll(".provider-error").html("<em class='error'>请输入正确的手机号码</em>");
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
			}
		});

		/*勾选服务协议*/
		$("#protocol-checkbox").on("click", function() {
			if($(this).prop("checked")) {
				$("#confirm").addClass("active-input").removeAttr("disabled");
			} else {
				$("#confirm").removeClass("active-input").prop("disabled", "disabled");
			}
		});

		//表单效果
		$(".common").bind({
			focus: function() {
				if($(this).attr("name") == "validatecode" || $(this).attr("name") == "piccode") {

					//获取手机验证码触发动作
					//$("#get-code").unbind().bind("click", getEvent);

					/*$(this).next(".active01").css({
						"background-color": "#008cd0",
						"color": "#fff"
					});*/
					$(this).parent().css("border-color", "#008cd0");
				} else
					$(this).css("border-color", "#008cd0");
			},
			blur: function() {
				if($(this).attr("name") == "validatecode" || $(this).attr("name") == "piccode") {
					$(this).parent().css("border-color", "#999");
				} else
					$(this).css("border-color", "#999");
			}
		});
		//表单验证
		$("#register-form").validate({
			rules: {
				realname: {
					required: true,
					checkName: true
				},
				email: {
					required: true,
					email: true
				},
				password: {
					required: true,
					minlength: 6,
					maxlength: 20,
					checkPassword: true
				},
				passagin: {
					required: true,
					equalTo: "#password"
				},
				mobile: {
					required: true,
					minlength: 11,
					maxlength: 11,
					checkMobile: true
				},
				address: {
					required: true
				},
				validatecode: {
					required: true,
					minlength: 6,
					maxlength: 6
				},
				piccode: {
					required: true,
					minlength: 4,
					maxlength: 4
				}
			},
			messages: {
				realname: {
					required: "此项为必填项"
				},
				email: {
					required: "此项为必填项",
					email: "请填写正确的email格式"
				},
				password: {
					required: "此项为必填项",
					minlength: "密码低于6个字符",
					maxlength: "密码大于20个字符"
				},
				passagin: {
					required: "此项为必填项",
					equalTo: "两次输入密码不一致"
				},
				mobile: {
					required: "此项为必填项",
					minlength: "请填写11位手机号码",
					maxlength: "请填写11位手机号码"
				},
				address: {
					required: "此项为必填项"
				},
				validatecode: {
					required: "请输入验证码",
					minlength: "请填写6位验证码",
					maxlength: "请填写6位验证码"
				},
				piccode: {
					required: "请输入验证码",
					minlength: "请填写4位验证码",
					maxlength: "请填写4位验证码"
				}
			},
			errorElement: "em",
			errorPlacement: function(error, element) {
				if($(element).attr("name") == "validatecode" || $(element).attr("name") == "piccode") {
					$(element).parent().nextAll(".provider-error").html($(error));
				} else {
					$(element).next(".provider-error").html($(error));
				}
			},
			/*success:function(element,obj){
				console.log(element);
				console.log(obj);
			},*/
			highlight: function(element, errorClass) {
				if($(element).attr("name") == "validatecode") {
					$(element).parent().css("border-color", "#ff5555");
				} else {
					$(element).css("border-color", "#ff5555");
				}
			},
			submitHandler: function() {
				var keyFlag = common.getQueryString("key");

				/*注册*/
				var loginOneData = {
					email: $.trim($("#email").val()),
					password: $.trim($("#password").val())
						/*,
											captcha: $.trim($("#validate-code").val())*/
				};

				/*激活注册*/
				var loginThreeData = {
					email: decodeURIComponent(common.getQueryString("email")),
					name: $.trim($("#real-name").val()),
					mobile: $.trim($("#mobile").val()),
					/*address: $.trim($("#address").val()),*/
					token: decodeURIComponent(common.getQueryString("token")),
					pin: $.trim($("#code").val())
				};
				var callbackFunLoginOne = function(datas) {
					if(datas.code == "0000") {
						window.location.href = '#providersecond?key=' + encodeURIComponent($("#email").val()) + "&pass=" + encodeURIComponent($.trim($("#password").val()));
					} else if(datas.code == "1010") {
						$("#code").nextAll(".provider-error").html("<em class='error'>" + datas.message + "</em>");
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

				var callbackFunActived = function(datas) {

					if(seconds != 60) {
						$("#get-code").unbind();
					}
					if(datas.code == "0000") {
						clearTimeout(times);
						window.location.href = '#providerforth?key=' + encodeURIComponent(common.getQueryString("email"));
					} else if(datas.code == "1010") {
						$("#code").parent().nextAll(".provider-error").html("<label class='code-error'>" + datas.message + "</label>");
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

				switch(keyFlag) {
					case 'login':
						common.postData(common.providerBaseUrl + urls.allUrls.providerRegister, loginOneData, callbackFunLoginOne, true);
						break;
					case 'actived':
						common.postData(common.providerBaseUrl + urls.allUrls.providerActive, loginThreeData, callbackFunActived, true);
						break;
					default:
						return false;
				}

			}
		});
	}
	return register;
});