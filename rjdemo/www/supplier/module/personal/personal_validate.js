/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods'], function(validates, validator) {
	var controller = function() {
		//get mobile checkCode
		/*手机号码 初始值*/
		var mobileDefault = $("#mobile").val();

		/*倒计时*/
		var seconds = 60;
		var times = null;
		clearTimeout(times);
		var clockFun = function() {
			seconds--;
			if(seconds != 0) {
				$("#edit-code-a").html("剩" + seconds + "秒");
				times = setTimeout(clockFun, 1000);
			} else {
				$("#edit-code-a").html("获取验证码");
				seconds = 60;
				clearTimeout(times);
				$("#edit-code-a").bind("click", getEvent);
				return false;
			}

		};

		/*get checkcode*/
		var callbackFun = function(params) {
			if(params.code == "0000") {
				$(".flag").removeClass("flag");
				$("#mobile").parent().nextAll(".error-wrap").html(null);
				clockFun();
				$("#edit-code-a").unbind();
			} else {
				$("#mobile").parent().nextAll(".error-wrap").html("<label class='code-error'>" + params.message + "</label>");
			}
		};

		//validate mobile
		function checkMobileFun(value) {
			var reg0 = /^13\d{9}$/;
			var reg1 = /^15\d{9}$/;
			var reg2 = /^14\d{9}$/;
			var reg3 = /^17\d{9}$/;
			var reg4 = /^18\d{9}$/;
			var my = false;
			if(reg0.test(value)) my = true;
			if(reg1.test(value)) my = true;
			if(reg2.test(value)) my = true;
			if(reg3.test(value)) my = true;
			if(reg4.test(value)) my = true;
			if(value != '') {
				if(!my) {
					return false;
				}
			}
			return true;
		}

		function getEvent() {
			if($('#mobile').val() !== mobileDefault) {
				var checkFlag = checkMobileFun($('#mobile').val());
				if(checkFlag === true) {
					var codeData = {
						mobile: $.trim($('#mobile').val()),
						useraction: "SuppUpdateMobile"
					};
					common.postData(baseUrl + urls.allUrls.getMobileCodeUrl, codeData, callbackFun, true);
				} else {
					$("#mobile").parent().nextAll(".error-wrap").html("<label class='code-error'>请输入正确的手机号码</label>");
				}
			} else {
				$("#mobile").parent().nextAll(".error-wrap").html("<label class='code-error'>请输入需要更换的手机号码</label>");
			}
		}

		//cancel modify
		$(".back-link").click(function() {
			clearTimeout(times);
			window.history.back();
		});

		//点击获取验证码
		$("#edit-code-a").unbind().bind("click", getEvent);

		$(".common").bind({
			focus: function() {
				if($(this).prop("name") == "mobilephone") {
					$(this).parent().css("border-color", "#008cd0");
				} else
					$(this).css("border-color", "#008cd0");
			},
			blur: function() {
				if($(this).attr("name") == "mobilephone") {
					$(this).parent().css("border-color", "#ccc");
				} else
					$(this).css("border-color", "#ccc");
			}
		});
		//validate form
		$("#personal-form").validate({
			groups: {
				addressDetail: "addrpro addrcity addrarea"
			},
			rules: {
				realname: {
					required: true,
					checkName: true
				},
				code: {
					required: true
				},
				previouspassword: {
					required: true
				},
				password: {
					required: true,
					minlength: 6,
					maxlength: 20
				},
				passagin: {
					required: true,
					equalTo: "#password"
				},
				mobilephone: {
					required: true,
					digits: true,
					minlength: 11,
					maxlength: 11,
					checkMobile: true

				},
				tel: {
					required: true,
					checkTel:true
				},
				qq: {
					required: true,
					digits: true,
					minlength: 6,
					maxlength: 11
				},
				address: {
					required: true
				},
				addrpro: {
					required: true
				},
				addrcity: {
					required: true
				},
				addrarea: {
					required: true
				}
			},
			messages: {
				realname: {
					required: "此项为必填项"
				},
				code: {
					required: "请输入验证码"
				},
				previouspassword: {
					required: "此项为必填项"
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
				mobilephone: {
					required: "此项为必填项",
					digits: "请输入正确的手机号码",
					minlength: "请输入正确的手机号码",
					maxlength: "请输入正确的手机号码"
				},
				tel: {
					required: "此项为必填项"
				},
				qq: {
					required: "此项为必填项",
					digits: "请输入6-11位数字",
					minlength: "请输入6-11位数字",
					maxlength: "请输入6-11位数字"
				},
				address: {
					required: "此项为必填项"
				},
				addrpro: {
					required: "此项为必填项"
				},
				addrcity: {
					required: "此项为必填项"
				},
				addrarea: {
					required: "此项为必填项"
				}
			},
			errorPlacement: function(error, element) {
				if($(element).attr("name") == "mobilephone") {
					$(element).parent().nextAll(".error-wrap").html($(error));
				} else {
					$(element).nextAll(".error-wrap").html($(error));
				}
			},
			highlight: function(element, errorClass) {
				if($(element).prop("name") == "mobilephone") {
					$(element).parent().css("border-color", "#ff6868");
				} else {
					$(element).css("border-color", "#ff6868");
				}

			},
			submitHandler: function() {
				var key = common.getQueryString("key");
				var submitFun = (function() {
					/*修改基本信息数据*/
					var personData = {
						address: $.trim($("#address").val()),
						name: $.trim($("#realname").val()),
						mobile: $.trim($("#mobile").val()),
						pin: $.trim($("#code-value").val()),
						province: $.trim($("#s_province").val()),
						city: $.trim($("#s_city").val()),
						county: $.trim($("#s_county").val()),
						qq: $.trim($("#QQ").val()),
						telephone: $.trim($("#tel").val())
					};

					/*修改密码参数*/
					var passwordData = {
						currentPassword: $.trim($("#previouspassword").val()),
						newPassword: $.trim($("#password").val())
					};

					/*回调函数*/
					var callbackEditFun = function(datas) {
						if(datas.code == "0000") {
							clearTimeout(times);
							window.location.href = '#personalsuccess?key=' + key;
						} else if(datas.code == "1010") {
							$("#code-value").css("border-color", "#ff6868").nextAll(".error-wrap").html("<label class='error'>" + datas.message + "</label>");
						} else if(datas.code == "0002") {
							$(".edit-code").nextAll(".error-wrap").html("<label class='error'>" + datas.message + "</label>");
						} else if(datas.code == "1020") {
							$("#out-provider").click();
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {},
								cancel: false
							}).width(320).show();
						}
					};
					return {

						/*修改基本信息*/
						editPersonMethod: function() {
							common.postData(baseUrl + urls.allUrls.editPersonUrl, personData, callbackEditFun, true);
						},

						/*修改密码*/
						editPasswordMethod: function() {
							common.postData(baseUrl + urls.allUrls.editPasswordUrl, passwordData, callbackEditFun, true);
						}

					}
				})();
				if(key == "editPerson") {
					submitFun.editPersonMethod();
				} else if(key == "editPassword") {
					submitFun.editPasswordMethod();
				}
				/*switch(Key) {
					case 'editPerson':
						submitFun.editPersonMethod();
						break;
					case 'editPassword':
						submitFun.editPersonMethod();
						break;
					default:
						alert("重新操作");
				}*/

			}
		});
	}
	return controller;
});