/**
 * Created by guoyujin on 2016/11/18.
 */
define(['text!module/information/information.html', "text!module/information/loadInfo.html", 'css!module/information/style/information.css', "pagination"], function(tpl, loadHtml) {
	var controller = function() {
		$(".header").css("display","block");
		var url = cmsUrl + urls.allUrls.getInformation,
			pageSize = 20,
			data = {
				currentPage: 1,
				pageSize: pageSize,
			},
			callback = function(r) {
				if(r.resultCode == "0000") {
					r.convert = convertTime;
					appView.html(_.template(tpl, r));
					common.pageFun(r.total, 1, pageSize, pageCallback);
					if(r.entities.length == 0) {
						$("#pagination").hide();
					} else {
						$("#pagination").show();
					}
					
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

				}
			};
		common.postData(url, data, callback, true);
		//时间转换
		var mydate = new Date();

		function convertTime(number) {
			mydate.setTime(number);
			var y = mydate.getFullYear(),
				m = mydate.getMonth() + 1,
				d = mydate.getDate(),
				h = mydate.getHours(),
				min = mydate.getMinutes(),
				s = mydate.getSeconds();
			m = m < 10 ? "0" + m : m;
			d = d < 10 ? "0" + d : d;
			h = h < 10 ? "0" + h : h;
			min = min < 10 ? "0" + min : min;
			s = s < 10 ? "0" + s : s;
			return y + "-" + m + "-" + d;
		};
		//分页回调函数
		function pageCallback(index) {
			var data = {
					currentPage: index + 1,
					pageSize: pageSize
				},
				callback = function(r) {
					if(r.code == "0000") {
						r.convert = convertTime;
						$(".information-items").html(_.template(loadHtml, r));
						if(r.entities.length == 0) {
							$("#pagination").hide();
						} else {
							$("#pagination").show();
						};
					}
				}
			common.postData(url, data, callback, true)
		}
	};
	return controller;
});