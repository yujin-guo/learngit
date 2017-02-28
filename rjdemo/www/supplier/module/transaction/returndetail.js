define(['text!module/transaction/return_detail.html', 'module/transaction/transaction', 'css!module/transaction/style/transaction.css'], function(tpl, deal) {
	var controller = function() {
		//清掉邮箱地址
		$.cookie("saveSuppLoginUrl", '', {
			path: "/"
		});

		var returnDetailData = {
			detailId: parseInt(common.getQueryString("detailId"))
		};
		var returnCallback = function(datas) {
			if(datas.code == "0000") {
				appView.html(_.template(tpl, datas));
				deal();
				var len = datas.goodsReturnInfo.goodsReturns;

				//菜单栏tab选中
				common.tabFocus("退货管理");
				
				//监测退货说明/文字说明字数
				$("#refuse-textarea").on("keyup", function() {
					var l = $(this).val();
					$("#num").html(l.length);
				});
				
				/*更改退货状态*/
				var dataCommon = {};

				function callbackFun(updateDatas) {
					if(updateDatas.code == '0000') {
						window.location.reload();
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: updateDatas.message,
							ok: function() {},
							cancel: false,
						}).width(320).show();
					}
				};
				$(".event-btn").unbind().on("click", function(event) {
					event.stopPropagation();
					var dataFlag = $(this).attr("data-flag");
					if(dataFlag == "agree") {
						$(".info-wrap").addClass("show");
						$("h4").text("同意退货");
						$(".change-word").text("退货说明：");
						dataCommon = {
							id: parseInt(len[0].returnId),
							goodsReturnOperate: "AGREE"
						};
					} else if(dataFlag == "refuse") {
						$(".info-wrap").addClass("show");
						$("h4").text("请填写拒绝理由");
						$(".change-word").text("*文字说明：");
						dataCommon = {
							id: parseInt(len[0].returnId),
							goodsReturnOperate: "REFUSE"
						};
					} else if(dataFlag == "recieve") {
						dataCommon = {
							id: parseInt(len[0].returnId),
							goodsReturnOperate: "SUCCESS"
						};
						common.postData(baseUrl + urls.allUrls.updateReturnStatus, dataCommon, callbackFun, true);
					}
				});
				$(".sure").unbind().on("click", function(event) {
					event.stopPropagation();
					dataCommon.picth = $('.refuse-pic-select img').prop("src");
					if(dataCommon.goodsReturnOperate == "AGREE") {
						dataCommon.agreeReason = $.trim($("#refuse-textarea").val());
						common.postData(baseUrl + urls.allUrls.updateReturnStatus, dataCommon, callbackFun, true);
					} else if(dataCommon.goodsReturnOperate == "REFUSE") {
						if(!$.trim($("#refuse-textarea").val())) {
							$("#refuse-textarea").focus();
							return false;
						} else {
							dataCommon.refuseReason = $.trim($("#refuse-textarea").val());
							common.postData(baseUrl + urls.allUrls.updateReturnStatus, dataCommon, callbackFun, true);
						}
					}
					//$(".info-wrap").removeClass("show");
				});

				//放大/缩小图片
				$(".message-img img").on("click", function() {
					$(".pic-big-div").addClass("show");
					$(".pic-big-div img").prop("src", $(this).prop("src"));
				});
				$(".pic-big-div img").on("click", function() {
					$(".pic-big-div").removeClass("show");
				});
			} else if(datas.code == "1020") {
				$.cookie("saveSuppLoginUrl", window.location.href, {
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
		common.postData(baseUrl + urls.allUrls.getReturnDetail, returnDetailData, returnCallback, true);
	};
	return controller;
});