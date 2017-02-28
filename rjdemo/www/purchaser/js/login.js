/*create by lijinhua*/
define(['js/libs/jquery.validate.min', 'js/urls'], function(validates, urls) {
	var login = function() {
		var loginUrl = urls.allUrls.login;
		$(".common").bind({
			focus: function() {
				$(this).parent().css("border-color", "#008cd0");
				if($(this).attr("name") == "username") {
					$(this).nextAll(".login-icon").css({
						"border-color": "#008cd0",
						"background-color": "#cef",
						"background-position": "-400px -2px"
					});
				} else {
					$(this).nextAll(".login-icon").css({
						"border-color": "#008cd0",
						"background-color": "#cef",
						"background-position": "-400px -46px"
					});
				}
			},
			blur: function() {
				$(this).parent().css("border-color", "#999");
				if($(this).attr("name") == "username") {
					$(this).nextAll(".login-icon").css({
						"border-color": "#999",
						"background-color": "#fff",
						"background-position": "-440px -2px"
					});
				} else {
					$(this).nextAll(".login-icon").css({
						"border-color": "#999",
						"background-color": "#fff",
						"background-position": "-440px -46px"
					});
				}
			}
		});

		//表单验证
		$("#login-form").validate({
			rules: {
				username: {
					required: true
				},
				password: {
					required: true
				}
			},
			messages: {
				name: {
					required: "null"
				},
				password: {
					required: "null"
				}
			},
			errorClass: "login-error",
			errorPlacement: function(error, element) {
				$(element).html(error);
			},
			highlight: function(element, errorClass) {
				$(element).addClass("login-error");
				$(element).parent().css("border-color", "#ff5555");
				$(element).nextAll(".login-icon").css("border-color", "#ff5555");
			},
			submitHandler: function() {
				var loginFlag = $(".word-active").attr("data-flag");
				var loginFun = (function() {
					var loginData = {
						username: $.trim($("#username").val()),
						password: $.trim($("#password").val())
					};

					//供应商回调
					var callbackSFun = function(datas) {
						if(datas.code == "0000") {
							 $.cookie('id1', datas.user.id, {
								expires: 1,
								path: '/'
							});
							$.cookie('username1', datas.user.fcontactman, {
								expires: 1,
								path: '/'
							}); 
							//window.location.href = "../supplier/index.html";
						} else if(datas.code == "1006") {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
							/*$("#submit").removeAttr("disabled");*/
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

					//采购人回调
					var callbackPFun = function(datas) {
						if(datas.code == "0000") {
							 $.cookie('id', datas.user.id, {
								expires: 1,
								path: '/'
							});
							$.cookie('username', datas.user.realName, {
								expires: 1,
								path: '/'
							});
							$.cookie('organization', datas.user.organization.name, {
								expires: 1,
								path: '/'
							});
							$.cookie("departments",datas.user.departments,{
								expires:1,
								path:'/'
							}) 
							window.location.href = "index.html";
						} else if(datas.code == "1006") {
							dialog({
								title: '提示',
								modal: true,
								content: datas.message,
								ok: function() {},
								cancel: false,
							}).width(320).show();
							/*$("#submit").removeAttr("disabled");*/
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
					var pathPrefix = window.location.pathname.split("/").slice(0,-1).join("/");
                    var currentProtocol = window.location.protocol;
                    var currentHost = window.location.host;
                    var absPrefix = currentProtocol + "//" + currentHost;
                    var fpTargetPrefix = absPrefix + pathPrefix;
					return {
						supplierLoginMethod: function() {
							var cb_target = encodeURIComponent(pathPrefix + "/module/login/supplySuccess.html");
							var fp_target = encodeURIComponent(fpTargetPrefix + "/index.html#profindpassword");
                            $("#loginFrame").prop("src", "/supp/sso/login?cb_target=" + cb_target + "&fp_target=" + fp_target);
						//	common.postData(common.providerBaseUrl + loginUrl, loginData, callbackSFun, false);p
							/*$("#submit").attr("disabled","disabled");*/
						},
						purchaseLoginMethod: function() {
							var cb_target = encodeURIComponent(pathPrefix + "/module/login/purchaseSuccess.html");
							var fp_target = encodeURIComponent(fpTargetPrefix + "/index.html#findpassword");
                            $("#loginFrame").prop("src", "/store/sso/login?cb_target=" + cb_target + "&fp_target=" + fp_target);
                        //  common.postData(baseUrl + loginUrl, loginData, callbackPFun, false);
							/*$("#submit").attr("disabled","disabled");*/
						}

					};
				})();

				switch(loginFlag) {
					case "supplier":
						loginFun.supplierLoginMethod();
						break;
					case "purchase":
						loginFun.purchaseLoginMethod();
						break;
					default:
						dialog({
							title: '提示',
							modal: true,
							content: "请重新填写",
							ok: function() {},
							cancel: false,
						}).width(320).show();
				} 

			}
		}); 
	};
	return login;
});