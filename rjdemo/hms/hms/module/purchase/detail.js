define(['text!module/purchase/detail.html', 'text!module/purchase/header.html', 'text!module/purchase/nav.html', 'js/libs/jquery.validate.min', 'css!module/purchase/style/purcharse.css?'], function(tpl, header, nav) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));

		var detailData = {
			id: parseInt(decodeURIComponent(common.getQueryString("id")))
		};

		var callbackDetailFun = function(datas) {
			if(datas.code == "0000") {
				//清掉邮箱地址
				$.cookie("saveHmsLoginUrl", '', {
					path: "/"
				});

				datas.nav = nav;

				//模块内容
				$('#right-container').html(_.template(tpl, datas));

				//余额不足审批按钮不可用
				datas.hasOwnProperty('projectMsg') ? (function() {
					var available = parseFloat(datas.projectMsg.available),
						fprevbudgetamount = parseFloat(datas.purchaseApply.fprevbudgetamount);
					(available < fprevbudgetamount) ? (function() {
						$("#pass").prop({
							"checked": "false"
						}, {
							"disabled": "true"
						});
						$("#refuse").prop({
							"checked": "true"
						});
					})() : null;
				})() : null;

				//判断从详情里面查询的订单状态
				$(".secondary-title").removeClass("secondary-active");
				$(".purchase-status-0" + datas.purchaseApply.status).parent().addClass("secondary-active");

				//次级导航
				$(".secondary-nav").on("click", "a", function() {
					$(".secondary-title").removeClass("secondary-active");
					$(this).parent().addClass("secondary-active");
					var flagText = $(this).text();
					var status = $(this).attr("data-status");
					if(status == "0") {
						listData = {};
						window.location.href = "#purcharseManger";
					} else if(status == "1") {
						listData = {};
						listData.status = 1;
						window.location.href = "#purcharseManger?status=1";
					} else if(status == "4") {
						listData = {};
						listData.status = 4;
						window.location.href = "#purcharseManger?status=4";
					} else if(status == "3") {
						listData = {};
						listData.status = 3;
						window.location.href = "#purcharseManger?status=3";
					}
				});

				/*提交申请*/
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
							id: parseInt(decodeURIComponent(common.getQueryString("id"))),
							approveStatus: $("input:checked").val(),
							opinion: $("#reason").val()
						};

						var callbackApp = function(datasA) {
							if(datasA.code == "0000") {
								window.location.reload();
							} else {
								dialog({
									title: '提示',
									modal: true,
									content: datasA.message,
									ok: function() {},
									cancel: false,
								}).width(320).show();
							}
						};
						//console.log(approvalData)
						common.postData(testUrl + urls.allUrls.getApply, approvalData, callbackApp, true);
					}
				});
			} else if(datas.code == "1020") {
				$.cookie("saveHmsLoginUrl", window.location.href, {
					expires: 0.004,
					path: "/"
				});
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

		common.postData(testUrl + urls.allUrls.getPurcharseDetail, detailData, callbackDetailFun, true);
	};
	return controller;
});