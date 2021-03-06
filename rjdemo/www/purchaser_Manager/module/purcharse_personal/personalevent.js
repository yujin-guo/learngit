/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods'], function(validates) {
	var controller = function() {
		$(".common").on({
			focus: function() {
				if($(this).prop("name") == "code") {
					$(this).next("a").css({
						"background-color": "#32ab94",
						"color": "#fff"
					});
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
			groups: {
				addressDetail: "s_province s_city s_county"
			},
			rules: {
				previouspassword: {
					required: true
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
				mobilephone: {
					required: true,
					checkMobile: true
				},
				email: {
					required: true,
					email: true
				},
				AddressMobilephone: {
					required: true,
					checkMobile: true,
					minlength: 11,
					maxlength: 11
				},
				address: {
					required: true
				},
				addrName: {
					required: true
				},
				code: {
					required: true
				},
				phone: {
					required: true
				},
				s_province: {
					required: true
				},
				s_city: {
					required: true
				},
				s_county: {
					required: true
				}
			},
			messages: {
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
					equalTo: "两次密码输入不一致，请重新输入"
				},
				mobilephone: {
					required: "此项为必填项",
				},
				email: {
					required: "此项为必填项",
					email: "请输入正确的邮箱地址,检查是否有空格"
				},
				AddressMobilephone: {
					required: "此项为必填项",
					minlength: "请填写11位手机号码",
					maxlength: "请填写11位手机号码"
				},
				address: {
					required: "此项为必填项"
				},
				addrName: {
					required: "此项为必填项"
				},
				code: {
					required: "此项为必填项"
				},
				phone: {
					required: "此项为必填项"
				},
				s_province: {
					required: "此项为必填项"
				},
				s_city: {
					required: "此项为必填项"
				},
				s_county: {
					required: "此项为必填项"
				}
			},
			errorPlacement: function(error, element) {
				if($(element).attr("name") == "code") {
					$(element).parent().nextAll(".error-wrap").html($(error));
				} else {
					$(element).nextAll(".error-wrap").html($(error));
				}
			},
			submitHandler: function() {
				var submitFun = (function() {
					//var baseUrl = common.serverBaseUrl;

					/*个人信息参数*/
					var data = {
						mobile: $.trim($("#mobilephone").val()),
						telephone: $.trim($("#phone").val()),
						address: $.trim($("#address").val()),
						pin: $.trim($("#code").val())
					};

					/*修改密码参数*/
					var passData = {
						newPassword: $.trim($("#password").val()),
						currentPassword: $.trim($("#previouspassword").val())
					};

					/*基本信息回调函数*/
					var callbackPersonFun = function(datas) {
						if(datas.code == "0000") {
							window.location.href = '#personalsuccess?keyword=' + key;
						} else if(datas.code == "1010") {
							$("#code").css("border-color", "#ff6868").nextAll(".error-wrap").html("<label class='error'>" + datas.message + "</label>");
						} else if(datas.code == "1006") {
							$("#previouspassword").css("border-color", "#ff6868").nextAll(".error-wrap").html("<label class='error'>" + datas.message + "</label>");
						} else if(datas.code == "1020") {
							common.getOutFun();
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

					/*新增/编辑收货地址回调函数*/
					var callbackAddFun = function(datas) {
						if(datas.code == "0000") {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {},
								cancel: false
							}).width(320).show();
							window.location.href = '#list';
						} else if(datas.code == "1020") {
							common.getOutFun();
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

						/*修改个人信息*/
						submitMethod: function() {
							common.postData(baseUrl + urls.allUrls.editPersonal, data, callbackPersonFun, true);
						},

						/*修改密码*/
						passMethod: function() {
							common.postData(baseUrl + urls.allUrls.editPassword, passData, callbackPersonFun, true);
						},

						/*编辑收货地址*/
						addressEditMethod: function(editAddressData) {
							common.postData(baseUrl + urls.allUrls.editAddress, editAddressData, callbackAddFun, true);
						},

						/*新增收货地址*/
						addressCreateMethod: function(createAddressData) {
							common.postData(baseUrl + urls.allUrls.createAddress, createAddressData, callbackAddFun, true);
						}
					}
				})();

				/*新增/编辑收货地址参数*/
				var dataAddress = {
					consignee: $.trim($(".consignee").val()),
					province: $.trim($(".province").val()),
					city: $.trim($(".city").val()),
					district: $.trim($(".area").val()),
					address: $.trim($(".address").val()),
					mobile: $.trim($(".mobile").val()),
					telephone: $.trim($(".tel").val())
				};

				var key = common.getQueryString('keyword');
				var editAddrId = common.getQueryString('id');

				/*修改个人资料/密码/新增/编辑收货地址分别执行的方法*/
				switch(key) {
					case 'editPersonal':
						submitFun.submitMethod();
						break;
					case 'editPass':
						submitFun.passMethod();
						break;
					case 'create':
						submitFun.addressCreateMethod(dataAddress);
						break;
					case 'edit':
						dataAddress.id = editAddrId;
						submitFun.addressEditMethod(dataAddress);
						break;
					default:
						break;
				}
			},
			highlight: function(element, errorClass) {
				$(element).css("border-color", "#ff5555");
			}
		});
	}
	return controller;
});