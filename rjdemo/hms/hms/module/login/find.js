define(['text!module/login/find.html', 'text!module/header/header01.html', 'js/libs/additional.methods', 'js/libs/jquery.validate.min', 'css!module/login/style/style.css?'], function(tpl, headerHtml) {
	var controller = function() {
		var allData = {
			header: headerHtml
		};
		appView.html(_.template(tpl, allData));
		var validateUrl = urls.allUrls.getMobileCode;
		var findUrl = urls.allUrls.findPassword;
		
		$(".common").bind({
			focus:function(){
				$(this).css({"border-color":"#008cd0"});
			},
			blur:function(){
				$(this).css({"border-color":"#ccc"});
			}
		});

		/*倒计时*/
		var seconds = 60;
		var times = null;
		clearTimeout(times);

		function clockFun() {
			seconds--;
			if(seconds != 0) {
				$(".code-send").html( seconds + "s后可重新发送");
				times = setTimeout(clockFun, 1000);
			} else {
				$(".code-send").html("下发短信验证码");
				seconds = 60;
				clearTimeout(times);
				$(".code-send").unbind().bind("click", getEvent);

				$(".code-send").css({
					"background-color": "#13b5bd",
					"color": "#fff"
				});
				return false;
			}

		};

		/*获取验证码回调函数*/
		function callbackFun(params) {
			if(params.code == "0000") {
				$(".code-send").unbind();

				$(".code-send").css({
					"background-color": "#ccc",
					"color": "#999"
				});
				$("#mobile").nextAll(".find-error").html(null);
				clockFun();

			} else {
				$("#mobile").nextAll(".find-error").html("<label class='code-error'>" + params.message + "</label>");
			}
		};

		//获取手机验证码函数封装
		function getEvent() {
			var checkFlag = common.checkMobileFun($('#mobile').val());

			if(checkFlag === true) {
				var requestData = {
				mobile: $("input[name='mobile']").val(),
				useraction: "HmsForgetPassword"
			};
			common.postData(testUrl + validateUrl, requestData, callbackFun, true);
			
			} else {
				$("#mobile").nextAll(".find-error").html("<label class='error'>请输入正确的手机号码</label>");
			}
		}

		$('.code-send').unbind().bind('click',getEvent );
		
		
		$("#find-form").validate({
			rules: {
				mobile: {
					required: true,
					checkMobile: true
				},
				code: {
					required: true
				},
				password: {
					required: true
				},
				again: {
					required: true,
					equalTo: "#pass"
				}
			},
			messages: {
				mobile: {
					required: "此项为必填项"
				},
				code: {
					required: "此项为必填项"
				},
				password: {
					required: "此项为必填项"
				},
				again: {
					required: "此项为必填项",
					equalTo: "密码不一致"
				}
			},
			//errorClass: "find-error",
			errorPlacement: function(error, element) {
				if($(element).prop("name") == "code") {
					$(element).parent().nextAll(".find-error").html($(error));
				} else {
					$(element).nextAll(".find-error").html($(error));
				}
			},
			highlight: function(element, errorClass) {
				$(element).css("border-color", "#ff5555");
			},
			submitHandler: function() {
				var requestData = {
					mobile: $("input[name='mobile']").val(),
					pin: $("input[name='code']").val(),
					newPassword: $("input[name='password']").val()
				};
				var callback = function(r) {
					if(r.code == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: '密码修改成功',
							ok: function() {
								window.location.href = "index.html"
							},
							cancel: false,
						}).width(320).show();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: r.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}
				common.postData(testUrl + findUrl, requestData, callback, true);
			}
		});

	};
	return controller;
});