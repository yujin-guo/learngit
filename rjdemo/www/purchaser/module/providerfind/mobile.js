/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods', 'js/urls'], function(validates, methods, urls) {
	var register = function() {
		$(".header").remove();
		var phoneNumber=decodeURIComponent(common.getQueryString("phone"));//获取电话号码
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
				$("#mobile").nextAll(".provider-error").html(null);
				clockFun();
			} else {
				$(".validate-number").nextAll(".provider-error").html("<label class='code-error'>" + params.message + "</label>");
			}
		};

		//获取手机验证码函数封装
		function getEvent() {
			var checkFlag = common.checkMobileFun($('#mobile').val());
			if(checkFlag === true) {
				var codeData = {
					mobile: $.trim($('#mobile').val()),
					useraction: "SuppForgetPsw"
				};
				common.postData(common.providerBaseUrl + urls.allUrls.getMobileCode, codeData, callbackFun, true);
			} else {
				$("#mobile").nextAll(".procure-error").html("<label class='code-error'>请输入正确的手机号码</label>");
			}
		}

		$(".color-find-link").on("click", function() {
			clearTimeout(times);
		});

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
		})

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
		$(".common").bind({
			focus: function() {
				if($(this).attr("name") == "validatecode") {

					//获取手机验证码触发动作
					/*$("#get-code").unbind().bind("click", getEvent);

					$(this).next("span").css({
						"background-color": "#008cd0",
						"color": "#fff"
					});*/
					$(this).parent().css("border-color", "#008cd0").nextAll(".provider-error").find(".code-error").remove();
				} else {
					$(this).css("border-color", "#008cd0");
					$(this).nextAll(".provider-error").find(".code-error").remove();
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
		$("#find-form").validate({
			rules: {
				mobile: {
					required: true,
					minlength: 11,
					maxlength: 11,
					checkMobile: true
				},
				code: {
					required: true
				},
				password: {
					required: true,
					minlength: 6,
					maxlength: 20,
					checkPassword: true
				},
				confirmpass: {
					required: true,
					equalTo: "#psd"
				}
			},
			messages: {
				mobile: {
					required: "请输入手机号码",
					minlength: "请输入11位手机号码",
					maxlength: "请输入11位手机号码"
				},
				code: {
					required: "请输入验证码"
				},
				password: {
					required: "此项为必填项",
					minlength: "长度低于6个字符",
					maxlength: "长度大于20字符"
				},
				confirmpass: {
					required: "此项为必填项",
					equalTo: "密码不一致"
				}
			},
			errorElement: "em",
			errorPlacement: function(error, element) {
				if($(element).attr("name") == "code") {
					$(element).parent().nextAll(".provider-error").html(error);
				} else
					$(element).nextAll(".provider-error").html(error);
			},
			highlight: function(element, errorClass) {
				$(element).css("border-color", "#ff5555");
				$(element).nextAll(".provider-error").find(".error").removeClass("code-success");
			},
			success: function(element) {
				$(element).addClass("code-success");
				$(element).nextAll("label").remove();
			},
			submitHandler: function() {
				var findPass = (function() {

					/*手机找回密码第一步回调函数*/
					var callbackGetFun = function(datas) {
						//clearTimeout(times);
						if(seconds != 60) {
							$("#get-code").unbind();
						}
						if(datas.code == "0000") {
							clearTimeout(times);
							window.location.href = "#promobilesecond?account=" + encodeURIComponent(datas.account, "utf8") + "&token=" + encodeURIComponent(datas.token, "utf8");
						} else if(datas.code == "1003") {
							$("#number").nextAll(".provider-error").html("<em class='code-error'>" + datas.message + "</em>");
						} else if(datas.code == "1007" || datas.code == "1010"||datas.code == "1017") {
							$(".validate-number").nextAll(".provider-error").html("<em class='code-error'>" + datas.message + "</em>")
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

					/*找回密码第二步回调函数*/
					var callbackSetFun = function(datas) {
						if(datas.code == "0000") {
							window.location.href = "#promobilethird";
						} else if(datas.code == "1020") {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {
									window.location.href = "#login"
								},
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

					/*找回密码第一步数据*/
					var getCodeData = {
						mobile: $.trim($("#mobile").val()),
						pin: $.trim($("#pin").val())
					};

					/*找回密码第二步数据*/
					var account = decodeURIComponent(common.getQueryString("account"));
					var token = decodeURIComponent(common.getQueryString("token"));
					var setNewPassData = {
						account: account,
						password: $.trim($("#psd").val()),
						token: token
					};
					return {
						findPassGetCode: function() {
							common.postData(common.providerBaseUrl + urls.allUrls.getSuppPassMobile, getCodeData, callbackGetFun, true);
						},
						setNewPassMethod: function() {
							common.postData(common.providerBaseUrl + urls.allUrls.setSuppNewPass, setNewPassData, callbackSetFun, true);
						}
					};
				})();
				if($("#find-form").attr("class") == "get-mobile") {
					findPass.findPassGetCode();
				} else if($("#find-form").attr("class") == "new-pass-form") {
					findPass.setNewPassMethod();
				}
			}
		});
		//获取手机号码并触发事件
		$("#mobile").val(phoneNumber);
		$("#mobile").trigger("input");
	}
	return register;
});