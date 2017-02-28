/*create by lijinhua*/
define(['text!module/login/login.html','text!module/header/nav.html','js/login','css!module/home/style/style.css?','css!module/login/style/login.css?seq='+Date.parse(new Date())],function(tpl,nav,login,common){
	var controller=function(){
		var pathPrefix = window.location.pathname.split("/").slice(0,-1).join("/");
        var currentProtocol = window.location.protocol;
        var currentHost = window.location.host;
        var absPrefix = currentProtocol + "//" + currentHost;
		var fp_target = pathPrefix + "/index.html#findpassword";
        fp_target = absPrefix + fp_target;

		var defaultSSOLoginSrc = "/store/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/login/purchaseSuccess.html") + "&fp_target=" + encodeURIComponent(fp_target);

		$(".header").css("display","none");
		var allDatas={
            nav:nav,
			defaultSSOLoginSrc:defaultSSOLoginSrc
        };
        appView.html(_.template(tpl,allDatas));

        //登录身份
        $(".login-title-01").on("click",function(){
        	$(".login-title-01").removeClass("word-active");
        	$(this).addClass("word-active");
        	if($(this).attr("data-flag")=="supplier"){
                fp_target = pathPrefix + "/index.html#profindpassword";
                fp_target = absPrefix + fp_target;
        		$(".login-content-01").addClass("height-01");
        		$(".supp-register").css("margin-top","-5px");
                $("#loginFrame").prop("src", "/supp/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/login/supplySuccess.html")
					+ "&fp_target=" + encodeURIComponent(fp_target));
        	}else{
                fp_target = pathPrefix + "/index.html#findpassword";
                fp_target = absPrefix + fp_target;
        		$(".login-content-01").removeClass("height-01");
        		$(".supp-register").css("margin-top","0px");
                $("#loginFrame").prop("src", "/store/sso/login?cb_target=" + encodeURIComponent(pathPrefix + "/module/login/purchaseSuccess.html")
					+ "&fp_target=" + encodeURIComponent(fp_target));
        	}
        });
		login(); 
		
	};
	return controller;
});