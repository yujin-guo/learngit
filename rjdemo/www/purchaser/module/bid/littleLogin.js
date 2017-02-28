/*create by lijinhua*/
define(['js/login'], function(login) {
	var c =function() {
		var pathPrefix = window.location.pathname.split("/").slice(0, -1).join("/");
		var currentProtocol = window.location.protocol;
		var currentHost = window.location.host;
		var absPrefix = currentProtocol + "//" + currentHost;
		var fp_target = pathPrefix + "/index.html#findpassword";
		fp_target = absPrefix + fp_target;

		var defaultSSOLoginSrc = "/store/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/bid/purchaseload.html") + "&fp_target=" + encodeURIComponent(fp_target);

		$("#loginFrame").prop("src", defaultSSOLoginSrc);
		//登录身份
		$(".login-title-01").on("click", function() {
			$(".login-title-01").removeClass("word-active");
			$(this).addClass("word-active");
			if($(this).attr("data-flag") == "supplier") {
				fp_target = pathPrefix + "/index.html#profindpassword";
				fp_target = absPrefix + fp_target;
				$(".login-litte-content").addClass("height-01");
				$("#loginFrame").prop("src", "/supp/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/bid/supplierload.html") +
					"&fp_target=" + encodeURIComponent(fp_target));
			} else {
				fp_target = pathPrefix + "/index.html#findpassword";
				fp_target = absPrefix + fp_target;
				$(".login-litte-content").removeClass("height-01");
				$("#loginFrame").prop("src", "/store/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/bid/purchaseload.html") +
					"&fp_target=" + encodeURIComponent(fp_target));
			}
		});
		login();
	};
	return c;
});