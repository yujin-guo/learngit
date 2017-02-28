define(['text!module/member/addMember.html', 'text!module/member/header.html', 'text!module/member/nav.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/member/style/member.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions=JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(_.template(nav + tpl));
		//表单验证
		$("#member-form").validate({
			rules: {
				real: {
					required: true
				},
				mobile: {
					required: true,
					checkMobile:true
				},
				email: {
					required: true,
					email: true
				},
				jobNumber:{
					maxlength:50
				},
				pass: {
					required: true,
					checkPassword:true
				},
				again: {
					required: true,
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
				jobNumber:{
					maxlength:"请输入小于50个字符"
				},
				pass: {
					required: "此项为必填项"
				},
				again: {
					required: "此项为必填项",
					equalTo: "密码不一致"
				}
			},
			submitHandler: function() {
				var data = {
					name: $.trim($(".real").val()),
					mobile: $.trim($(".mobile").val()),
					email: $.trim($(".email").val()),
					password: $.trim($("#pass").val())
				};
				$.trim($(".job-number").val())?data.jobNumber=$.trim($(".job-number").val()):null;
				var callbackFun = function(datas) {
					if(datas.code === "0000") {
						window.location.href = "#member";
					}else if(datas.code === "1020"){
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
				common.postData(testUrl + urls.allUrls.addMember, data, callbackFun, true);
			}
		});

	};
	return controller;
});