/*create by lijinhua*/
define(['text!module/help/help.html', 'text!module/header/nav.html', 'text!module/help/loadhelp.html', 'css!module/help/style/help.css'], function(tpl, nav, loadHtml) {
	var controller = function() {
		/* var allDatas = {
			nav: nav
		};
		appView.html(_.template(tpl, allDatas)); */
		$(".header").css("display","block");

		var url = cmsUrl + urls.allUrls.getRootlist,
			listurl = cmsUrl + urls.allUrls.getonlinesbycolumn,
			callback = function(r) {
				if(r.resultCode == "0000") {

					if(r.entities == undefined) {
						r.entities = null;
					}
					appView.html(_.template(tpl, r));
					eventBind();
					
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

					common.postData(listurl, {id: r.dto.id}, callbackFun, true);
				}
			};
		common.postData(url, {}, callback, true);

		function callbackFun(d) {
			if(d.resultCode == "0000") {
				d.convert = convertTime;
				$(".help-items").html(_.template(loadHtml, d));
			}
		}

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

		function eventBind() {

			//导航事件
			$(".help-li-link").on("click", function() {
				if($(this).nextAll(".help-next-ul").hasClass("show")) {
					$(this).removeClass("help-up").nextAll(".help-next-ul").removeClass("show");
				} else {
					$(this).addClass("help-up").nextAll(".help-next-ul").addClass("show");
				}
				
				common.postData(listurl, {id: $(this).attr("data-id")}, callbackFun, true);
			});
			
			//常见问题分类
			/*$(".help-li-header").on("click",function(){
				
			});*/
			
			$(".help-next-ul").on("click", "li", function() {
				$(this).siblings("li").removeClass("help-li-active");
				$(this).addClass("help-li-active");
				var listCallback = function(r) {
					if(r.resultCode == "0000") {
						r.convert = convertTime;
						$(".help-items").html(_.template(loadHtml, r));
					}
				};
				common.postData(listurl, {
					id: $(this).attr("data-id")
				}, listCallback, true);
			});
		}
	};
	return controller;
});