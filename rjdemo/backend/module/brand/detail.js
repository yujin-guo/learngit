define(['text!module/brand/detail.html', 'text!module/brand/header.html', 'text!module/brand/nav.html', 'js/libs/jquery.validate.min', 'css!module/brand/style/brand.css'], function(tpl, header, nav) {
	var controller = function(id) {
		//userPermissions = JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));

		var callback = function(datas) {
			if(datas.resultCode == "0000") {
				datas.nav = nav;
				//模块内容
				$('#right-container').html(_.template(tpl, datas));

				//子导航 跳转
				$(".secondary-title").bind("click", function() {
					var index = $(this).index();
					window.location.href = "#brandlist?index=" + index;
				});
				
				//审批字数
				$("#reason").on("keyup",function(){
					var n=$(this).val().length;
					$(".brand-num").html(n);
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
							id: parseInt(id),
							status: parseInt($("input:checked").val()),
							opinion: $("#reason").val()
						};

						var callbackApp = function(datasA) {
							if($("input:checked").val() == "1") {
								content = "审核通过";
							}
							if($("input:checked").val() == "2") {
								content = "审核驳回";
							}
							if(datasA.resultCode == "0000") {
								dialog({
									title: '提示',
									modal: true,
									content: content,
									ok: function() {
										window.location.reload();
									},
									cancel: false
								}).width(320).show();

							} else {
								dialog({
									title: '提示',
									modal: true,
									content: datasA.msg,
									ok: function() {

									},
									cancel: false
								}).width(320).show();
							}
						};
						if($("input:checked").val() == "2") {
							if(!$.trim($("#reason").val())) {
								dialog({
									title: '提示',
									modal: true,
									content: "请填写驳回理由",
									ok: function() {},
									cancel: false
								}).width(320).show();
							} else {
								common.postData(omsUrl + urls.allUrls.getBrandAppApproval, approvalData, callbackApp, true,false);
							}
						} else {
							common.postData(omsUrl + urls.allUrls.getBrandAppApproval, approvalData, callbackApp, true,false);
						}
					}
				});
			} else if(datas.resultCode == "1001") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: datas.msg,
					ok: function() {

					},
					cancel: false
				}).width(320).show();
			}

		};

		common.postData(omsUrl + urls.allUrls.getBrandsInfo + id, null, callback, true,false);
	};
	return controller;
});