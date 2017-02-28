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
					useraction: "SuppUpdateMobile"
				};
				common.postData(common.providerBaseUrl + urls.allUrls.getMobileCode, codeData, callbackFun, true);
			} else {
				$("#mobile").nextAll(".provider-error").html("<em class='error'>请输入正确的手机号码</em>");
			}
		}

		//监听手机验证码高亮

		$('#mobile').on('input', function() {
			if(seconds == 60) {
				if($(this).val()) {
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

		//表单效果
		$(".common").bind({
			focus: function() {
				if($(this).attr("name") == "validatecode" || $(this).attr("name") == "piccode") {
					$(this).parent().css("border-color", "#008cd0");
				} else
					$(this).css("border-color", "#008cd0");
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
				}
			},
			messages: {
				mobile: {
					required: "此项为必填项",
					minlength: "请填写11位手机号码",
					maxlength: "请填写11位手机号码"
				},
				validatecode: {
					required: "请输入验证码",
					minlength: "请填写6位验证码",
					maxlength: "请填写6位验证码"
				}
			},
			errorElement: "em",
			errorPlacement: function(error, element) {
				if($(element).attr("name") == "validatecode") {
					$(element).parent().nextAll(".provider-error").html($(error));
				} else {
					$(element).next(".provider-error").html($(error));
				}
			},
			highlight: function(element, errorClass) {
				if($(element).attr("name") == "validatecode") {
					$(element).parent().css("border-color", "#ff5555");
				} else {
					$(element).css("border-color", "#ff5555");
				}
			},
			submitHandler: function() {
				/*激活注册*/
				var validateDa = {
					mobile: $.trim($("#mobile").val()),
					pin: $.trim($("#code").val())
				};
				var validateCallback = function(datas) {
					if(datas.code == "0000") {
						$.cookie("svm", $.trim($("#mobile").val()), {
							path: "/"
						});
						window.location.href = '../../supplier/index.html';
					} else if(datas.code=="1020") {
						common.getOutFun();
					}else{
						$("#code").parent().nextAll(".provider-error").html("<em class='error'>" + datas.message + "</em>");
					}
				};
				common.postData(common.providerBaseUrl + urls.allUrls.validateMobleSupp, validateDa, validateCallback, true);
			}
		});
	}
	return register;
});