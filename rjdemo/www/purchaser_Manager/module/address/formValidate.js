/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/libs/additional.methods'], function(validates) {
	var controller = function() {
		$(".common").on({
			focus: function() {
				$(this).css("border-color", "#32ab94");
			},
			blur: function() {
					$(this).css("border-color", "#ccc");
			}
		});
		//表单验证
		$("#purcharse-form").validate({
			groups: {
				addressDetail: "s_province s_city s_county"
			},
			rules: {
				AddressMobilephone: {
					required: true,
					checkMobile: true,
					minlength: 11,
					maxlength: 11
				},
				address: {
					required: true,
					minlength: 5,
					maxlength: 100
				},
				addrName: {
					required: true,
					maxlength:10,
					checkName:true
				},
				phone:{
					checkTel:true,
					maxlength:13
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
				AddressMobilephone: {
					required: "此项为必填项",
					minlength: "请填写11位手机号码",
					maxlength: "请填写11位手机号码"
				},
				address: {
					required: "此项为必填项",
					minlength: "最少5个字符",
					maxlength: "最多100字符",
				},
				addrName: {
					required: "此项为必填项",
					maxlength:"请输入少于10个字符"
				},
				phone: {
					maxlength: "请输入少于13个字符"
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
							window.location.href = '#/personalsuccess?keyword=' + key;
						} else if(datas.code == "1010") {
							$("#code").css("border-color", "#ff6868").nextAll(".error-wrap").html("<label class='error'>" + datas.message + "</label>");
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
							window.location.href = '#/list';
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