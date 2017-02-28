define(['text!module/home/home.html', 'css!module/home/style/style.css'], function(tpl) {
	var controller = function() {
		userPermissions = JSON.parse($.cookie("permissions"));
		var messageData = {};
		var callbackMessageFun = function(dataB) {
			if(dataB.code == "0000") {
				var inters = {
					pageNo: 1,
					pageSize: 12
				}

				function callbackInterestFun(datas) {
					if(datas.code == "0000") {
						datas.H = dataB;
						$('#right-container').html(_.template(tpl, datas));
						var urlStr='url("'+location.protocol+'//'+location.host+'/cms/file/downLoad?type=image&category=ORG_LOGO&about=' + $.cookie('orgId') + '&serial=0")';
						$(".home-head-inner").css({
							"background-image": urlStr,
							"background-size": "52px 52px"
						});
						$(".purchaser-name").html($.cookie('username'));
						$(".purchaser-desc").html($.cookie('organization'));
						common.postData(bidUrl + urls.allUrls.getPurchaseCenterBid, {}, bidNumCallback, true);
					} else if(datas.code == "1020") {
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

				}
				//获取首页竞价相关信息
				function bidNumCallback(r) {
					if(r.resultCode == "0000") {
						$('.my-price-content01 a').text(r.bidding);
						$('.my-price-content02 a').text(r.choosing);
					} else if(r.resultCode == "1001") {
						return false;
					} else {
						dialog({
							title: '提示',
							modal: true,
							content: r.msg,
							ok: function() {},
							cancel: false
						}).width(320).show();
					}
				}
				common.postData(baseUrl + urls.allUrls.getInterestList, inters, callbackInterestFun, true);

			} else if(dataB.code == "1020") {
				common.getOutFun();
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: dataB.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();
			}
			common.tabFocus("中心首页");
		};
		common.postData(baseUrl + urls.allUrls.getPurcharseCenter, messageData, callbackMessageFun, true);

	}
	return controller;
});