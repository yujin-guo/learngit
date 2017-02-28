define(['text!module/account/accountDetails.html', 'text!module/account/header.html', 'text!module/account/common_nav.html', 'css!module/account/style/accountDetails.css'], function(tpl, header, nav) {
	var controller = function(statementNo, status, done) {
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		var url = testUrl + urls.allUrls.getStatementDetail; //结算单详情地址
		var updateInvoiceUrl = testUrl + urls.allUrls.updateInvoiceStatus; //发票清单（汇总单）更新状态
		var data = {
			statementNo: statementNo
		};
		var callback = function(r) {
			if(r.code == "0000") {
				var data = {
					nav: nav,
					data: r,
					status: status
				};
				$("#right-container").html(_.template(nav));
				$("#right-container").append(_.template(tpl, data));
				eventBind();
			} else if(r.code == "1020") {
				common.getOutFun();
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
		common.postData(url, data, callback, true);

		function eventBind() {
			$(".secondary-title").each(function() {  //左导航选中项
				var $th = $(this);
				var dataFlag = $th.attr("data-flag");
				if(dataFlag == status) {
					$th.addClass("secondary-active").siblings(".secondary-title").removeClass("secondary-active");
				}
			});
			
			//返回上一级
			$(".account-details-back").bind("click", function() {
				window.location.href = "#account";
			})
			window.scrollTo(0, 0);

			//子导航 跳转
			$(".secondary-title").bind("click", function() {
				var index = $(this).attr("data-flag");
				$.cookie("accountIndex", index, {  //存储状态，采用这种方法目的是防止结算列表在其他状态下刷新时仍然请求最初状态
					expires: 0.004,
					path: "/"
				});
				window.location.href = "#account";
			});
			//接受资料和提交财务
			var updateUrl = testUrl + urls.allUrls.updateAccountStatus;
			$(".account-details-receive").bind("click", function() {
				var $that = $(this);
				var data = {
					statementNo: statementNo,
					status: 1
				};
				var callback = function(r) {
					if(r.code == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: '接收资料成功。',
							ok: function() {},
							cancel: false,
						}).width(320).show();
						$that.hide().unbind();
						location.href += "/1";
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
				common.postData(updateUrl, data, callback, true);
			})
			$(".account-details-submit").bind("click", function() {
				var $that = $(this);
				var singleData = {
					SummaryNo: statementNo,
					summaryType: "WaitingToPay"
				};
				var callback = function(r) {
					if(r.code == "0000") {
						dialog({
							title: '提示',
							modal: true,
							content: '提交财务成功。',
							ok: function() {},
							cancel: false,
						}).width(320).show();
						$that.hide().unbind();
						location.href += "/1";
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
				common.postData(updateInvoiceUrl, singleData, callback, true);
			});
			//提交操作记录
			if(done) {
				$(".account-details-operation").hide().unbind();
			}
		}
	};
	return controller;
});