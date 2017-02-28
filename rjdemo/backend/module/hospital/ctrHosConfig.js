define(['text!module/hospital/ctrHosConfig.html', 'text!module/hospital/header.html', 'text!module/hospital/nav.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/hospital/style/hospital.css?'], function(tpl, header, nav) {
	var controller = function(id) {
		var hosCtrSubmitUrl = omsUrl + urls.allUrls.hosCtrSubmit, //新增、修改医院
			hospitalListUrl = omsUrl + urls.allUrls.hospitalList,
			hosCtrDetailUrl = omsUrl + urls.allUrls.hosCtrDetail; //医院审批详情
		appView.html(_.template(header));
		$('#right-container').html(nav + tpl);
		$(".secondary-title").eq(1).addClass("secondary-active").siblings().removeClass("secondary-active");
		eventFun();
		common.postData(hospitalListUrl, null, function(p) {
			if(p.resultCode == "0000") {
				var selectDom = $(".hos-config-select"),
					str = null;
				$.each(p.list, function(key, value) {
					str == null ? str = '<option value="' + value.id + '">' + value.name + '</option>' : str += '<option value="' + value.id + '">' + value.name + '</option>';
				});
				selectDom.append(str);

			} else if(p.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: p.msg,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
		}, true, false);

		id ? (function() {
			common.postData(hosCtrDetailUrl + "/" + id, null, callback, true, false);

			function callback(d) {
				if(d.resultCode == "0000") {
					d.dto.hasOwnProperty("orgName") ? $(".hos-config-select").val(d.dto.orgId) : null;
					d.dto.hasOwnProperty("code") ? $(".code").val(d.dto.code) : null;
					d.dto.hasOwnProperty("displayOrder") ? $(".sort").val(d.dto.displayOrder) : null;
					d.dto.hasOwnProperty("name") ? $(".hos-name").val(d.dto.name) : null;
					d.dto.hasOwnProperty("value") ? $(".zhi").val(d.dto.value) : null;
					d.dto.hasOwnProperty("desc") ? $(".hos-config-desc").val(d.dto.desc) : null;
					$(".hos-config-select,.code").prop("disabled","true");
				} else if(d.resultCode == "1001") {
					common.getOutFun();
				} else {
					dialog({
						title: '提示',
						modal: true,
						content: d.msg,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			}

		})() : null;

		function eventFun() {

			//表单验证
			$("#hospital-form").validate({
				rules: {
					allhos: {
						required: true
					},
					code: {
						required: true
					},
					sort:{
						required: true,
						digits:true
					},
					hosName: {
						required: true
					},
					zhi: {
						required: true,
						digits: true
					}
				},
				messages: {
					allhos: {
						required: "此项为必填项"
					},
					code: {
						required: "此项为必填项"
					},
					sort:{
						required: "此项为必填项",
						digits:"请输入数字"
					},
					hosName: {
						required: "此项为必填项"
					},
					zhi: {
						required: "此项为必填项",
						digits: "请输入数字"
					}
				},
				errorPlacement: function(error, element) {
					$(element).next(".oms-hospital-error").html($(error));
				},
				submitHandler: function() {
					var data = {
						name: $.trim($(".hos-name").val()),
						code: $.trim($(".code").val()),
						displayOrder:$.trim($(".sort").val()),
						value: $(".zhi").val(),
						desc: $.trim($(".hos-config-desc").val()),
						orgId: parseInt($(".hos-config-select").val())
					};
					id ? data.id = id : null;
					var callbackFun = function(datas) {
						if(datas.resultCode === "0000") {
							window.location.href = "#hospitalConfig";
						} else if(datas.resultCode === "1001") {
							common.getOutFun();
						} else {
							dialog({
								title: '提示',
								modal: true,
								content: datas.msg,
								ok: function() {},
								cancel: false,
							}).width(320).show();
						}
					};
					common.postData(hosCtrSubmitUrl, data, callbackFun, true, false);
				}
			});
		}
	};
	return controller;
});