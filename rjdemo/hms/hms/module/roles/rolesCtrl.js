define(['text!module/roles/rolesCtrl.html', 'text!module/roles/header.html', 'text!module/roles/nav.html', 'js/libs/jquery.validate.min', 'css!module/my/style/my.css?', 'css!module/roles/style/roles.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var editRoleData = {
			id: parseInt(decodeURIComponent(common.getQueryString("id")))
		};

		var keyFlag = common.getQueryString("key");

		//页面初始化
		var callbackInit = function(datas) {
			if(datas.code === "0000") {
				datas.nav = nav;
				if(keyFlag == "addRoles") {
					datas.name = null;
					datas.description = null;
					$('#right-container').html(_.template(tpl, datas));
					validateFun();
				} else if(keyFlag == "editRoles") {
					common.postData(testUrl + urls.allUrls.getRolesDetail, editRoleData, callbackEditFun, true);
					//编辑角色函数
					function callbackEditFun(R) {
						if(R.code == "0000") {
							datas.name = R.name;
							datas.description = R.description;
							datas.R = R;
							$('#right-container').html(_.template(tpl, datas));

							$.each(datas.R.accessList, function(name, key) {
								var ed = $('.roles-ctr-td02 input[type="checkbox"]');
								for(var i = 0; i < ed.length; i++) {
									if($(ed[i]).prop("value") == key.id) {
										$(ed[i]).prop("checked", true);
									}
								}
							});

							validateFun();
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: R.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}

					}
				}

				function validateFun() {
					var callbackFun = function(datas) {

						if(datas.code == "0000") {
							window.location.href = "#roles";
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
					$("#role-form").validate({
						rules: {
							roles: {
								required: true
							}
						},
						messages: {
							roles: {
								required: "此项为必填项"
							}
						},
						submitHandler: function() {
							switch(keyFlag) {
								case "addRoles":
									var chk_value = [];
									$('input[type="checkbox"]:checked').each(function() {
										chk_value.push(parseInt($(this).val()));
									});
									var addRoleData = {
										name: $.trim($(".roles-name").val()),
										description: $.trim($(".roles-desc").val()),
										accessList: chk_value
									};
									common.postData(testUrl + urls.allUrls.addRoles, addRoleData, callbackFun, true);
									break;
								case "editRoles":
									var edit_value = [];
									$('input[type="checkbox"]:checked').each(function() {
										edit_value.push(parseInt($(this).val()));
									});
									var updateRoleData = {
										roleId: parseInt(decodeURIComponent(common.getQueryString("id"))),
										name: $.trim($(".roles-name").val()),
										description: $.trim($(".roles-desc").val()),
										accessList: edit_value
									};
									common.postData(testUrl + urls.allUrls.editRoles, updateRoleData, callbackFun, true);
									break;
								default:
									return false;
							}

						}
					});
				}

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

		common.postData(testUrl + urls.allUrls.initRoles, {}, callbackInit, true);

		$('.purchase').bind("click", function() {
			$('.purchase').prop('checked', false);
			$(this).prop('checked', true);
		});
		$('.bidstart').bind("click", function() {
			$('.bidstart').prop('checked', false);
			$(this).prop('checked', true);
		});
		$('.bidend').bind("click", function() {
			$('.bidend').prop('checked', false);
			$(this).prop('checked', true);
		});
	};
	return controller;
});