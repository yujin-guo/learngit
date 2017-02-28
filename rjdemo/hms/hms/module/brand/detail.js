define(['text!module/brand/detail.html', 'text!module/brand/header.html', 'text!module/brand/nav.html', 'js/libs/jquery.validate.min', 'css!module/brand/style/brand.css'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));

		var detailData = {
			suppBrandId: parseInt(common.getQueryString("id"))
		};

		var callback = function(datas) {
			if(datas.code == "0000") {
				datas.nav = nav;
				datas.isLongAuth = datas.isLongAuth || false;
				//模块内容
				$('#right-container').html(_.template(tpl, datas));

				//子导航 跳转
				$(".secondary-title").bind("click", function() {
					var index = $(this).index();
					window.location.href = "#brandlist?index=" + index;
				});

				//提交申请
				$("#app-form").validate({
					rules: {
						status: {
							required: true
						}
					},
					messages: {
						status: {
							required: "必须选择其中一个"
						}
					},
					errorPlacement: function(error, element) {
						$(".error-span").html($(error));
					},
					submitHandler: function() {
						var approvalData = {
							suppBrandId: parseInt(common.getQueryString("id")),
							passStatus: $("input:checked").val(),
							approvalComment: $("#reason").val()
						};

						var callbackApp = function(datasA) {
							if($("input:checked").val() == "1") {
								content = "审核通过";
							}
							if($("input:checked").val() == "0") {
								content = "审核驳回";
							}
							if(datasA.code == "0000") {
								dialog({
									title: '提示',
									modal: true,
									content: content,
									ok: function() {
										window.location.href = "#brandlist";
									},
									cancel: false
								}).width(320).show();

							} else {
								dialog({
									title: '提示',
									modal: true,
									content: datasA.message,
									ok: function() {},
									cancel: false
								}).width(320).show();
							}
						};
						//console.log(approvalData)
						common.postData(testUrl + urls.allUrls.getBrandAppApproval, approvalData, callbackApp, true);
					}
				});
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

		common.postData(testUrl + urls.allUrls.getBrandsInfo, detailData, callback, true);
	};
	return controller;
});