/*create by lijinhua*/
define(['text!module/door/door.html', 'text!module/header/nav.html', 'js/login', 'common', 'css!module/home/style/style.css?', 'css!module/door/style/door.css?seq=' + Date.parse(new Date())], function(tpl, nav, login, common) {
	var controller = function() {
		var getPurcharseCenterUrl = baseUrl + urls.allUrls.getPurcharseCenter;
		var getSuppCenterUrl=common.providerBaseUrl+urls.allUrls.getSuppCenter;

		//登录
		var pathPrefix = window.location.pathname.split("/").slice(0, -1).join("/");
		var currentProtocol = window.location.protocol;
		var currentHost = window.location.host;
		var absPrefix = currentProtocol + "//" + currentHost;
		var fp_target = pathPrefix + "/index.html#findpassword";
		fp_target = absPrefix + fp_target;

		var defaultSSOLoginSrc = "/store/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/login/purchaseSuccess.html") + "&fp_target=" + encodeURIComponent(fp_target);

		//$(".header").css("display","none");
		var allDatas = {
			nav: nav,
			defaultSSOLoginSrc: defaultSSOLoginSrc
		};
		appView.html(_.template(tpl, allDatas));

		//登录身份
		$(".login-title-01").on("click", function() {
			$(".login-title-01").removeClass("word-active");
			$(this).addClass("word-active");
			if($(this).attr("data-flag") == "supplier") {
				fp_target = pathPrefix + "/index.html#profindpassword";
				fp_target = absPrefix + fp_target;
				$(".login-content").addClass("height-01");
				$(".supp-register").css("margin-top", "-5px");
				$("#loginFrame").prop("src", "/supp/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/login/supplySuccess.html") +
					"&fp_target=" + encodeURIComponent(fp_target));
			} else {
				fp_target = pathPrefix + "/index.html#findpassword";
				fp_target = absPrefix + fp_target;
				$(".login-content").removeClass("height-01");
				$(".supp-register").css("margin-top", "0px");
				$("#loginFrame").prop("src", "/store/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/login/purchaseSuccess.html") +
					"&fp_target=" + encodeURIComponent(fp_target));
			}
		});
		login();

		//登录后
		if($.cookie("id")) {
			$(".after-login-pur").css("display", "block");
			$(".after-login-supp").css("display", "none");
			$(".login-content").css("display", "none");

			$(".after-info-name").html($.cookie("username"));
			$(".after-info-email").html($.cookie("userEmail"));

			userPermissions = JSON.parse($.cookie("permissions"));
			var purchaser_limit = userPermissions.indexOf('采购人中心');

			if(purchaser_limit == -1) {
				$(".after-order").html("欢迎您");
				$(".purchase-per").css("display", "none");
			} else {
				common.postData(getPurcharseCenterUrl, null, function(d) {
					if(d.code == "0000") {
						$(".pur-deliver").html(d.notDeliverOrderCount);
						$(".pur-receive").html(d.notTakeOrderCount);
						$(".pur-account").html(d.notBanlanceOrderCount);
						$(".pur-accounting").html(d.settlingOrderCount);
					} else {
						common.getOutFun();
					}
				}, true);
			}
		} else if($.cookie("id1")) {
			$(".after-login-pur").css("display", "none");
			$(".after-login-supp").css("display", "block");
			$(".login-content").css("display", "none");

			$(".after-info-name").html($.cookie("username1"));
			$(".after-info-email").html($.cookie("userEmail1"));
			
			common.postData(getSuppCenterUrl, null, function(d) {
					if(d.code == "0000") {
						$(".supp-new").html(d.newOrder);
						$(".supp-deliver").html(d.toBeShipped);
						$(".supp-receiver").html(d.toBeReceived);
						$(".supp-accounting").html(d.toBeBanlance);
					} else {
						common.getOutFun();
					}
				}, true);
		} else {
			$(".after-login-pur").css("display", "none");
			$(".after-login-supp").css("display", "none");
			$(".login-content").css("display", "block");
		}

	};
	return controller;
});