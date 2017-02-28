define(['text!module/login/login.html', 'text!module/header/header01.html', 'js/libs/jquery.validate.min', 'css!module/login/style/style.css?'], function(tpl, headerHtml, validates) {
	var controller = function() {
		var currentProtocol = window.location.protocol;
		var currentHost = window.location.host;
		var absPrefix = currentProtocol + "//" + currentHost;

		var pathPrefix = window.location.pathname.split("/").slice(0,-1).join("/");

		var fp_target = absPrefix + pathPrefix + "/index.html#findPassword";

		var ssoLoginSrc = "/oms/sso/login?type=oms&cb_target=" + encodeURIComponent(pathPrefix + "/loginSuccess.html") + "&fp_target=" + encodeURIComponent(fp_target);
		var allData = {
			header: headerHtml,
			ssoLoginSrc: ssoLoginSrc
		};
		appView.html(_.template(tpl, allData));
		var loginUrl = urls.allUrls.login;

		$(".common").bind({
			focus: function() {
				$(this).parent().css({
					"border-color": "#008cd0"
				});
				$(this).next("span").css({
					"background-color": "#cef",
					"border-left-color": "#008cd0"
				});
				if($(this).prop("name") == "username") {
					$(this).nextAll(".login-icon-user").css({
						"background-position": "-400px -2px"
					});
				} else {
					$(this).nextAll(".login-icon-pass").css({
						"background-position": "-400px -46px"
					})
				}
			},
			blur: function() {
				$(this).parent().css({
					"border-color": "#ccc"
				});
				$(this).next("span").css({
					"background-color": "#fff",
					"border-left-color": "#ccc"
				});
				if($(this).prop("name") == "username") {
					$(this).nextAll(".login-icon-user").css({
						"background-position": "-440px -2px"
					});
				} else {
					$(this).nextAll(".login-icon-pass").css({
						"background-position": "-440px -46px"
					})
				}
			}
		});

		//表单验证
	/*	$("#login-form").validate({
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
				$(element).append($(error));
			},
			highlight: function(element, errorClass) {
				$(element).addClass("login-error");
				$(element).parent().css("border-color", "#ff5555");
				$(element).nextAll("span").css("border-color", "#ff5555");
			},
			submitHandler: function() {
				var loginData = {
					username: $.trim($("#username").val()),
					password: $.trim($("#password").val())
				};
				var callbackFun = function(datas) {
					if(datas.code == "0000") {
						$.cookie('id', datas.user.id, {
							expires: 1,
							path: '/'
						});
						$.cookie('username', datas.user.realName, {
							expires: 1,
							path: '/'
						});	
                        
						var permission_list=datas.user.permissions;
						var new_arr=[];
				        for(var i=0;i<permission_list.length;i++){
					　　         var items=permission_list[i].name;
					       　　   if($.inArray(items,new_arr)==-1){
					　　　　        new_arr.push(items);
					　　          }
				        }
				        window.userPermissions=new_arr;
                    
				        var a=JSON.stringify(new_arr);
				      
				        $.cookie("permissions",a,{path:"/"});
						window.location.href = "#control";
					} else if(datas.code == "1006") {
                            dialog({
                                title: '提示',
                                modal:true,
                                content: datas.message,
                                ok: function () {},
                                cancel: false
                            }).width(320).show();
						/*$("#submit").removeAttr("disabled");*/
					/*} else {
						dialog({
                            title: '提示',
                            modal:true,
                            content: datas.message,
                            ok: function () {},
                            cancel: false
                        }).width(320).show();
					}
				};
				common.postData(testUrl + loginUrl, loginData, callbackFun, false);
			}
		});*/

	};
	return controller;
});
