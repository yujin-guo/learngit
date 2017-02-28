define(['text!module/config/config.html', 'text!module/config/header.html', 'text!module/config/common_nav.html', 'css!module/config/style/config.css'], function(tpl, header, nav, loadHtml) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));

		var bidApproveUrl = testUrl + urls.allUrls.getAptSetup; //获取竞价审批信息
		var purApproveUrl = testUrl + urls.allUrls.getPurSetup; //获取采购审批信息
		var savePurUrl = testUrl + urls.allUrls.saveAptSetup; //保存采购审批信息
		var departmentId = parseInt(common.getQueryString("departmentId"));

		var callback = function(r) {
			if(r.code = "0000") {
				var d = {};
				d.nav = nav;
				d.r = r;
				$("#right-container").html(_.template(tpl, d));
				eventbind(r.approvalConfModel.status, r.approvalConfModel.id);

				/*common.postData(bidApproveUrl, {
					deptId: departmentId
				}, callbackFinFun, true);*/
				/*function callbackFinFun(d) {
					if(d.code == "0000") {
						d.nav = nav;
						d.r = r;
						$("#right-container").html(_.template(tpl, d));
						eventbind(d.approvalConfModel.status);
					}
				}*/
			}
		}

		common.postData(purApproveUrl, {
			deptId: departmentId
		}, callback, true);

		function eventbind(purStatus, purId) {
			$(".hms-config-select").val(purStatus);
			var s = $(".hms-config-select").val();
			if(s == "0" || s == "10") {
				$(".hms-chose-option").hide();
			}

			//竞价
			/*var b = $(".config-flag input:checked").attr("data-flag");
			if(b == "0") {
				$(".hms-bid-chose-option").hide();
			}*/

			//采购方式
			$(".hms-config-select").on("change", function() {
				if($(this).val() == "20" || $(this).val() == "30") {
					$(".hms-chose-option").show();
					if($(this).val() == "30") {
						$(".hms-chose-option .hms-config-flag").prop("placeholder", "请输入采购商品单价");
					} else {
						$(".hms-chose-option .hms-config-flag").prop("placeholder", "请输入采购总额");

					}
				} else {
					$(".hms-chose-option").hide();
				}
			});

			//竞价配置
			/*$(".hms-config-bid-final").on("click", function() {
				if($(this).attr("data-flag") == "1" || $(this).attr("data-flag") == "2") {
					$(".hms-bid-chose-option").show();
					if($(this).attr("data-flag") == "2") {
						$(".hms-bid-chose-option .hms-config-flag").prop("placeholder", "请输入采购商品单价");
					} else {
						$(".hms-bid-chose-option .hms-config-flag").prop("placeholder", "请输入采购总额");
					}
				} else {
					$(".hms-bid-chose-option").hide();
				}
			});*/
			
			function callbackSaveFun(s) {
				if(s.code == "0000") {
					dialog({
						title: '提示',
						modal: true,
						content: "修改成功",
						ok: function() {
							window.location.reload();
						},
						cancel: false
					}).width(320).show();
				}else{
					dialog({
						title: '提示',
						modal: true,
						content: s.message,
						ok: function() {},
						cancel: false
					}).width(320).show();
				}
			}

			//保存采购配置信息
			$("#content-save").on("click", function() {
				var saveData = {
					status: $.trim($(".hms-config-select").val()),
					type: 10,
					confItems: 101,
					id: purId,
					deptId:departmentId
				};
				if($.trim($(".hms-config-select").val()) == "20") {
					saveData.amount = $.trim($("#hms-pur-money").val());
				}
				if($.trim($(".hms-config-select").val()) == "30") {
					saveData.price = $.trim($("#hms-pur-money").val());
				}
				common.postData(savePurUrl, saveData, callbackSaveFun, true);
			});

		}
	};
	return controller;
});