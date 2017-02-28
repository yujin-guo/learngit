/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods', 'js/urls'], function(validates, methods, urls) {
	var register = function() {
		$(".header").remove();
		var findFirstUrl = urls.allUrls.postEmailLink;
		var findThirdUrl = urls.allUrls.setNewPassword;

		//时时监听高亮提交按钮
		$('.common').on('input', function() {
			var inputL = $(".common");
			var num = 0;
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
				$(this).css("border-color", "#008cd0");
			},
			blur: function() {
				$(this).css("border-color", "#999");
			}
		});
		//表单验证
		$("#find-form").validate({
			rules: {
				findname: {
					required: true,
					/*email: true,
					mobile:true,*/
					maxlength:40
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
				findname: {
					required: "此项为必填项",
					maxlength:"请输入正确的邮箱"
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
				//正则验证手机号码和邮箱
				if($("#find-form").attr("class") == "get-email") {
					var phoneNumberOrEmail=$("#number").val().trim(),
						phoneReg=/^1(3|4|5|7|8)\d{9}$/,
						emailReg=/^[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+\.[0-9a-zA-Z_-]+$/,
						isRight=phoneReg.test(phoneNumberOrEmail)||emailReg.test(phoneNumberOrEmail);
					if(!isRight){
						$("#number").nextAll(".provider-error").html("<em class='code-error'>请输入正确的手机号码或邮箱。</em>");
						return false;
					};
				};
				var findPass = (function() {
					/*找回密码第一步回调函数*/
					var callbackGetFun = function(datas) {
						if(datas.code == "0000") {
							window.location.href = "#passwordsecond?key=" + encodeURIComponent($.trim($("#number").val()), "utf8");
						} else if(datas.code == "1003") {
							$("#number").nextAll(".provider-error").html("<em class='code-error'>" + datas.message + "</em>");
						} else if(datas.code == "1007") {
							$(".find-number").nextAll(".provider-error").html("<em class='code-error'>" + datas.message + "</em>")
						}else if(datas.code=="1020"){
							window.location.href ="#login";
						}else{
							dialog({
							title: '提示',
							modal: true,
							content: datas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
						}
					};

					/*找回密码第三步回调函数*/
					var callbackSetFun = function(datas) {
						if(datas.code == "0000") {
							window.location.href = "#passwordforth";
						}else if(datas.code=="1020"){
							window.location.href ="#login";
						}else{
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
						account: $.trim($("#number").val())
					};

					/*找回密码第三步数据*/
					var account = common.getQueryString("account");
					var token = common.getQueryString("token");
					var setNewPassData = {
						account: account,
						password: $.trim($("#psd").val()),
						token: token
					};
					return {
						findPassGetCode: function() {
							common.postData(baseUrl + findFirstUrl, getCodeData, callbackGetFun, true);
						},
						setNewPassMethod: function() {
							common.postData(baseUrl + findThirdUrl, setNewPassData, callbackSetFun, true);
						}
					};
				})();
				//区分手机号码和邮箱
				if($("#find-form").attr("class") == "get-email") {
					if(emailReg.test(phoneNumberOrEmail)){
						findPass.findPassGetCode();
					}else{
						window.location.href="#mobilefirst?phone="+encodeURIComponent(phoneNumberOrEmail);	
					}
				} else if($("#find-form").attr("class") == "new-pass-form") {
					findPass.setNewPassMethod();
				}
			}
		});
	}
	return register;
});