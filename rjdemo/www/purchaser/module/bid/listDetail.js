define(["text!module/bid/listDetail.html", "text!module/header/bidHeader.html", "text!module/header/bidnavigation.html", "text!littleLogin.html", "module/bid/littleLogin", "css!module/bid/style/bid.css?", "css!style/littleLogin.css?"], function(tpl, header, nav, littleLogin, load) {
	var controler = function() {
		var bidBaseUrl = common.bidBaseUrl;
		var bidUrl = bidBaseUrl + urls.allUrls.getListDetail;
		var bidId = common.getQueryString("id");

		var data = {
			id: bidId
		}

		common.postData(bidUrl, data, getListCallbackFun, true, true, function(response) {
			return response.isLogin == false;
		});

		function pageCallback(page) {
			data.page = page + 1;
			common.postData(bidUrl, data, conditionCallback, true);
		}

		function conditionCallback(d) {
			if(d.resultCode === "0000") {
				if(d.entities != undefined || d.entities.length) {
					d.flag = true;
					d.nav = header + nav;
					$("#bid-content-table").html(_.template(loadHtml, d));

				}
			} else {
				dialog({
					title: '提示',
					modal: true,
					content: d.message,
					ok: function() {},
					cancel: false,
				}).width(320).show();

			}
		}

		function getListCallbackFun(datas) {
			if(datas.resultCode === "0000") {
				datas.nav = header + nav;
				datas.little = littleLogin;
				$("#container").html(_.template(tpl, datas));

				//采购人/供应商/未登录的导航头部判断
				if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
					$("#f").css({
						"display": "inline-block"
					});
					$("#s").css({
						"display": "none"
					});
				} else {
					$("#f").css({
						"display": "none"
					});
					$("#s").css({
						"display": "inline-block"
					});
				}
				//结束日期
				var a = datas.endDate.split("-");
				var b = a[2].split(" ");
				var c = b[1].split(":");
				var y = parseInt(a[0]),
					m = parseInt(a[1]),
					d = parseInt(b[0]),
					h = parseInt(c[0]),
					i = parseInt(c[1]),
					s = parseInt(c[2]);


				function ShowCountDown() {
					
					clearInterval(bidTime);

					var now = new Date();
					var endDate = new Date(y, m - 1, d, h, i, s + 15);
					var leftTime = endDate.getTime() - now.getTime();

					var leftsecond = parseInt(leftTime / 1000);

					//天
					var day1 = Math.floor(leftsecond / (60 * 60 * 24));

					//时
					var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);

					//分
					var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);

					//秒
					var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);

					day1 = day1 < 10 ? '0' + day1 : day1;
					hour = hour < 10 ? '0' + hour : hour;
					minute = minute < 10 ? '0' + minute : minute;
					second = second < 10 ? '0' + second : second;

					var cc = $("#list-detail-clock"),
						str = '<span class="time-span listdetail-day">' + day1 + '</span> 天' +
						'<span class="time-span listdetail-hours">' + hour + '</span> 小时' +
						'<span class="time-span listdetail-munite">' + minute + '</span> 分' +
						'<span class="time-span listdetail-seconds">' + second + '</span> 秒';
					cc.html(str);
					if((day1 == 00 && hour == 00 && minute == 00 && second == 01) || day1 == "0-1") {
						window.location.reload(true);
					} else {
						bidTime = setTimeout(ShowCountDown, 1000);
					}

				}

				if(datas.status == 4) {
					ShowCountDown();
				} else {
					clearInterval(bidTime);
					var str = '<span class="listdetail-day">00</span> 天' +
						'<span class="listdetail-hours">00</span> 小时' +
						'<span class="listdetail-munite">00</span> 分' +
						'<span class="listdetail-seconds">00</span> 秒';
					$("#list-detail-clock").html(str);
				}

				//登录
				$("#list-login").on("click", function() {
					$(".login-litte-wrap,.login-litte-content").show();
				});
				$(".login-litte-wrap").on("click", function() {
					$(".login-litte-wrap,.login-litte-content").hide();
				});
				if(datas.isLogin == false) {
					load();
				}
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
	};
	return controler;
});