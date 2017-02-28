define(['text!module/member/editMember.html', 'text!module/member/header.html', 'text!module/member/nav.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/member/style/member.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		$("#right-container").html(_.template(nav));

		var _id = parseInt(decodeURIComponent(common.getQueryString("id")));

		var listData = {
			id: _id
		};

		//初始化回调函数
		var callbackFun = function(datas) {
			if(datas.code == "0000") {
				datas.nav = nav;

				if(datas.email == undefined) {
					datas.email = null;
				}
				if(datas.mobile == undefined) {
					datas.mobile = null;
				}
				$('#right-container').append(_.template(tpl, datas));

				/*展开密码修改*/
				var flag = true;
				$(".link-pass").click(function() {
					if(flag == true) {
						$(".flag-div").removeClass("pass-hide");
						flag = false;
					} else {
						$(".flag-div").addClass("pass-hide");
						flag = true;
					}
				});

				//表单验证
				$("#member-form").validate({
					rules: {
						real: {
							required: true
						},
						mobile: {
							required: true,
							checkMobile: true
						},
						email: {
							required: true,
							email: true
						},
						again: {
							equalTo: "#pass"
						}
					},
					messages: {
						real: {
							required: "此项为必填项"
						},
						mobile: {
							required: "此项为必填项"
						},
						email: {
							required: "此项为必填项",
							email: "请输入正确的email格式"
						},
						again: {
							equalTo: "密码不一致"
						}
					},
					submitHandler: function() {
						var data = {
							id: _id,
							name: $.trim($(".real").val()),
							mobile: $.trim($(".mobile").val()),
							email: $.trim($(".email").val())
						};
						$.trim($("#pass").val())?data.password = $("#pass").val():null;
						$.trim($(".job-number").val())?data.jobNumber=$.trim($(".job-number").val()):null;
						var callbackFun = function(datas) {
							if(datas.code === "0000") {
								window.location.href = "#member";
							} else if(datas.code === "1020") {
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

						common.postData(testUrl + urls.allUrls.updateMember, data, callbackFun, true);
					}
				});
			} else if(datas.code === "1020") {
				common.getOutFun();
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

		common.postData(testUrl + urls.allUrls.getMemberDetail, listData, callbackFun, true);

	};
	return controller;
});