define(['text!module/hospital/editHospital.html', 'text!module/hospital/header.html', 'text!module/hospital/nav.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/hospital/style/hospital.css?'], function(tpl, header, nav) {
	var controller = function(id) {
		appView.html(_.template(header));

		function callback(d) {
			if(d.resultCode == "0000") {
				d.nav = nav;
				d.hostUrl=omsUrl;
				$('#right-container').html(_.template(tpl, d));
				eventFun();
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
		common.postData(omsUrl + urls.allUrls.getHospitalDetail + "/" + id, null, callback, true,false);

		function eventFun() {
			var exitName=$.trim($(".real").val());
			$(".color-contain").hide();

			//上传logo
			$(".hospital-file").unbind().on("click", function() {
				var f = $(this).prop("id");
				if(f == "colorful-logo") {
					$(".logo-upload").attr("data-flag", "colorful");
				} else {
					$(".logo-upload").attr("data-flag", "transparent");
				}
				$(".logo-upload").click();
			});
			$(".logo-upload").unbind().on("change", function() {
				var th = $(this);

				function callbackImageFun(c) {
					if(c.code == "0000") {
						var fg = th.attr("data-flag");
						if(fg == "colorful") {
							var str = '<span class="logo-colorful-wrap"><span class="logo-colorful-img"><img data-flag="' + c.id + '" src="' + c.url +
								'" /><span class="logo-delete" data-flag = "colorful"></span></span><p class="hospital-logo-desc">彩色LOGO</p></span>';
							$("#colorful").after(str);
							$("#colorful").hide();
						} else {
							var str = '<span class="logo-transparent-wrap"><span class="logo-transparent-img"><img data-flag="' + c.id + '" src="' + c.url +
								'" /><span class="logo-delete" data-flag = "transparent"></span></span><p class="hospital-logo-desc">透明LOGO</p></span>';
							$("#transparent").after(str);
							$("#transparent").hide();
						}
					} else if(c.code === "1020") {
						common.getOutFun();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: c.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				}
				common.fileUpload("logo-form", callbackImageFun);
			});

			//删除logo
			$(".logo-span-wrap").on("click", ".logo-delete", function() {
				var idDom = $(this).attr("data-flag");
				$(this).parent().parent().remove();
				$("#" + idDom).show();
			});

			//表单验证
			$("#hospital-form").validate({
				rules: {
					real: {
						required: true
					},
					alias: {
						required: true
					},
					username: {
						required: true
					},
					pass: {
						checkPassword: true
					}
				},
				messages: {
					real: {
						required: "此项为必填项"
					},
					alias: {
						required: "此项为必填项"
					},
					username: {
						required: "此项为必填项"
					}
				},
				errorPlacement: function(error, element) {
					$(element).next(".oms-hospital-error").html($(error));
				},
				submitHandler: function() {
					if(!$(".logo-colorful-wrap").length || !$(".logo-transparent-wrap").length) {
						$(".hospital-logo-span").next(".oms-hospital-error").html('<label class="error">请补全医院logo</label>');
						window.scrollTo(0, 0);
					} else {
						var data = {
							id: parseInt(id),
							alias: $.trim($(".alias").val()),
							colorfulLogo: $("#colorful").next(".logo-colorful-wrap").find("img").attr("data-flag"),
							transparentLogo: $("#transparent").next(".logo-transparent-wrap").find("img").attr("data-flag"),
							acceptanceMethod: parseInt($(".commit-method input:checked").val()),
							isShowProduct: parseInt($(".brand-method input:checked").val())
						};
						if(exitName!=$.trim($(".real").val())){
							data.name=$.trim($(".real").val());
						}
						var callbackFun = function(datas) {
							if(datas.resultCode === "0000") {
								window.location.href = "#hospital";
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
						common.postData(omsUrl + urls.allUrls.updateHospital, data, callbackFun, true,false);
					}
				}
			});
		}
	};
	return controller;
});