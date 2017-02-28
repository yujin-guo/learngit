define(['text!module/department/addDepartment.html', 'text!module/department/header.html', 'text!module/department/nav.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/my/style/my.css?', 'css!module/department/style/department.css?'], function(tpl, header, nav, validate) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav));
		var keyWord = decodeURIComponent(common.getQueryString("key"));
		var id = decodeURIComponent(common.getQueryString("id"));
		var department = decodeURIComponent(common.getQueryString("depart"));
		var type = common.getQueryString("type");
		var manageId = parseInt(decodeURIComponent(common.getQueryString("managerId")));

		switch(keyWord) {
			case "add":
				common.postData(testUrl + urls.allUrls.getDepartmentList, {}, callbackFun, true);
				break;
			case "edit":
				common.postData(testUrl + urls.allUrls.getDepartmentList, {}, callbackFun, true);
				break;
		}

		//初始页面回调函数
		function callbackFun(datas) {
			if(datas.code === "0000") {
				datas.flag = keyWord;
				datas.department = department;
				datas.type = type;
				datas.editDepartId = parseInt(id);
				$('#right-container').append(_.template(tpl, datas));
				
				//修改上级默认选择已有上级
				if(keyWord == "edit") {
					$.each(datas.departmentItems, function(key, value) {
						if(value.id == parseInt(id)) {
							$("#department-select").val(value.parentId);
						}
					});
				}

				$("#department-form").validate({
					rules: {
						dename: {
							required: true,
							maxlength: 20
						},
						roles: {
							required: true
						}
					},
					messages: {
						dename: {
							required: "此项为必填项",
							maxlength: "部门名称不超过20个字符，请重新输入"
						},
						roles: {
							required: "此项为必填项"
						}

					},
					errorPlacement: function(error, element) {
						if($(element).prop("name") == "roles") {
							$(element).parent().nextAll(".find-error").html($(error));
						} else {
							$(element).nextAll(".find-error").html($(error));
						}
					},
					highlight: function(element, errorClass) {
						$(element).css("border-color", "#ff5555");
					},
					submitHandler: function() {
						//新增部门数据
						var addData = {
							name: $("#name").val(),
							type: parseInt($("input:checked").val()),
							parentId: parseInt($(".department-select").val())
						};

						//编辑部门数据
						var editData = {
							managerId: manageId,
							name: $("#name").val(),
							id: parseInt(id),
							parentId: parseInt($(".department-select").val())
						};
						var callback = function(r) {
							if(r.code === "0000") {
								window.history.back();
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: r.message,
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						};
						switch(keyWord) {
							case "add":
								common.postData(testUrl + urls.allUrls.addDepartment, addData, callback, true);
								break;
							case "edit":
								common.postData(testUrl + urls.allUrls.editDepartment, editData, callback, true);
								break;
						}

					}
				});
			} else if(datas.code == "1020") {
				$("#out-login").click();
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

	};
	return controller;
});