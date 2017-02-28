define(['text!module/purcharse_personal/personal.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/purcharse_personal/style/personal.css?'], function(tpl) {
	var controller = function() {
		var personDetailData = {};
		var callbackPersonDetital = function(datas) {
			if(datas.code == "0000") {
				if(datas.telephone == undefined) {
					datas.telephone = null;
				}
				if(datas.email == undefined) {
					datas.email = null;
				}
				//模块内容
				$('#right-container').html(_.template(tpl, datas));

				common.tabFocus("基本信息");

				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;基本信息</span>");

				//修改
				$(".edit-link").unbind().bind("click", function() {
					var flagChange = $(this).attr("data-flag")
					if(flagChange == "mobile") {
						$(".personal-edit-background,.mobile").addClass("show");
					} else if(flagChange == "phone") {
						$(".personal-edit-background,.phone").addClass("show");
					} else if(flagChange == "email") {
						$(".personal-edit-background,.email").addClass("show");
					}
				});

				//关闭修改
				$(".close-event-icon").unbind().bind("click", function() {
					$(".personal-edit-background,.alert-personal-edit").removeClass("show");
					clearTimeout(times);
					seconds = 60;

					//重新加载为了清空数据
					common.postData(baseUrl + urls.allUrls.getPurcharsePerson, personDetailData, callbackPersonDetital, true);
				});

				/*倒计时*/
				var seconds = 60;
				var times = null;

				function clockFun() {
					clearTimeout(times);
					seconds--;
					if(seconds != 0) {
						$("#personal-code").html("剩" + seconds + "秒");
						times = setTimeout(clockFun, 1000);
					} else {
						$("#personal-code").html("获取手机验证码");
						seconds = 60;
						$("#personal-code").unbind().bind("click", getEvent);
						$("#personal-code").css({
							"background-color": "#32ab94",
							"color": "#fff"
						});
						return false;
					}

				};

				/*获取验证码函数*/
				function getEvent() {
					if($("#mobilephone").val()) {
						var dataPhone = {
							mobile: $.trim($("#mobilephone").val()),
							useraction: "BuyerUpdateMobile"
						};
						var callbackPhoneFun = function(datas) {
							if(datas.code == "0000") {

								$("#personal-code").unbind();
								$("#personal-code").css({
									"background-color": "#e5e5e5",
									"color": "#666"
								});
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
						common.postData(baseUrl + urls.allUrls.getCode, dataPhone, callbackPhoneFun, true);
					} else {
						$("#mobilephone").nextAll(".error-wrap").html('<label class="error" for="mobilephone">请输入手机号码</label>');
						return false;
					}

				}

				//监听手机验证码高亮
				$('#mobilephone').unbind().on('input', function() {
					var mt = $(this);
					if(seconds == 60) {
						if(common.checkMobileFun(mt.val())) {
							$("#personal-code").css({
								"background-color": "#32ab94",
								"color": "#fff"
							});

							/*获取手机验证码*/
							$("#personal-code").unbind().bind("click", getEvent);
						} else {
							$("#personal-code").css({
								"background-color": "#e5e5e5",
								"color": "#999"
							});
							$("#personal-code").unbind();
						}
					}
				});

				//修改信息表单验证
				$(".common").on({
					focus: function() {
						if($(this).prop("name") == "code") {
							$(this).parent().css("border-color", "#32ab94");
						} else {
							$(this).css("border-color", "#32ab94");
						}
					},
					blur: function() {
						if($(this).prop("name") == "code") {
							$(this).parent().css("border-color", "#ccc");
						} else {
							$(this).css("border-color", "#ccc");
						}
					}
				});

				//表单验证
				$("#purcharse-form").validate({
					rules: {
						password: {
							required: true,
							minlength: 6,
							maxlength: 20,
							checkPassword: true
						},
						mobilephone: {
							required: true,
							checkMobile: true
						},
						email: {
							required: true,
							checkEmail: true
						},
						code: {
							required: true
						},
						phone: {
							required: true,
							checkTel: true,
							maxlength: 13
						}
					},
					messages: {
						password: {
							required: "此项为必填项",
							minlength: "密码低于6个字符",
							maxlength: "密码大于20个字符"
						},
						mobilephone: {
							required: "此项为必填项",
						},
						email: {
							required: "此项为必填项",
							checkEmail: "请输入正确的邮箱地址"
						},
						code: {
							required: "此项为必填项"
						},
						phone: {
							required: "此项为必填项",
							maxlength: "请输入少于13位字符"
						}
					},
					errorPlacement: function(error, element) {
						if($(element).attr("name") == "code") {
							$(element).parent().nextAll(".error-wrap").html($(error));
						} else {
							$(element).nextAll(".error-wrap").html($(error));
						}
					},
					highlight: function(element, errorClass) {
						if($(element).attr("name") == "code") {
							$(element).parent().css("border-color", "#ff5555");
						} else {
							$(element).css("border-color", "#ff5555");
						}

					},
					submitHandler: function() {
						$("#personal-code").unbind();

						//回调函数
						function callbackEditFun(datas) {
							if(datas.code == "0000") {
								clearTimeout(times);
								$(".personal-edit-background,.alert-personal-edit").removeClass("show");
								common.postData(baseUrl + urls.allUrls.getPurcharsePerson, personDetailData, callbackPersonDetital, true);
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
						if($(".show").hasClass("mobile")) {
							var editData = {
								mobile: $.trim($("#mobilephone").val()),
								//password: $.trim($(".mobile-pass").val()),
								pin: $.trim($("#code").val())
							};
							common.postData(baseUrl + urls.allUrls.editMobile, editData, callbackEditFun, true);
						} else if($(".show").hasClass("phone")) {
							var editData = {
								telephone: $.trim($("#phone").val())
									//password: $.trim($(".phone-email").val())
							};
							common.postData(baseUrl + urls.allUrls.editPhone, editData, callbackEditFun, true);
						} else if($(".show").hasClass("email")) {
							var editData = {
								email: $.trim($("#email").val())
									//password: $.trim($(".email-pass").val())
							};
							common.postData(baseUrl + urls.allUrls.editEmail, editData, callbackEditFun, true);
						}

					}
				});

			} else {
				$("#outLogin").click();
			}
		};
		common.postData(baseUrl + urls.allUrls.getPurcharsePerson, personDetailData, callbackPersonDetital, true);

	}
	return controller;
});