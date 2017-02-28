define(['text!module/my/my.html', 'text!module/my/header.html', 'text!module/my/nav.html', 'text!module/my/ctrlPersonal.html', 'js/libs/jquery.validate.min', 'js/libs/additional.methods', 'css!module/my/style/my.css?'], function(tpl, header, nav, ctrlHtml) {
	var controller = function() {
		common.postData(testUrl + urls.allUrls.getPersonalDetail, {}, callback, true);
		userPermissions = JSON.parse($.cookie("permissions"));
		appView.html(_.template(header));
		$('#right-container').html(nav);

		function callback(dataS) {
			if(dataS.code=="0000") {
                var a='';
                for(var i=0;i<dataS.depRoles.length;i++){
                    var b="";
                    for(var j=0;j<dataS.depRoles[i].roles.length;j++){
                        if(j==dataS.depRoles[i].roles.length-1){
                            b+=dataS.depRoles[i].roles[j];
                            break;
                        }
                        b+=dataS.depRoles[i].roles[j]+",";
                    }
                    if(dataS.depRoles[i].roles.length==0){
                        a+=dataS.depRoles[i].department+"-不担任任何角色;";
                        continue;
                    }
                    a+=dataS.depRoles[i].department+"-"+b+"；";
                }
                dataS.department=a;
                
                if(dataS.jobNumber==undefined){
                	dataS.jobNumber=null;
                }
                if(dataS.mobile==undefined){
                	dataS.mobile=null;
                }
                if(dataS.email==undefined){
                	dataS.email=null;
                }
				$('#right-container').append(_.template(tpl, dataS));

				var datas = {};

				//修改
				$(".my-common-event").on("click", function() {
					//$(".secondary-title").removeClass("secondary-active");
					//$(this).addClass("secondary-active");
					var flagWord = $(this).attr("data-flag");
					if(flagWord == 'editMobile') {
						datas.keyWords = "editMobile";
					} else if(flagWord == 'editEmail') {
						datas.keyWords = "editEmail";
					} else if(flagWord == 'editPass') {
						datas.keyWords = "editPass";
					} else {
						window.location.reload();
					}
					$('#wrap-div').html(_.template(ctrlHtml, datas));
					$(".common").bind({
						focus: function() {
							if($(this).prop("name") == "code") {
								$(this).parent().css("border-color", "#008cd0");
							} else if($(this).prop("name") == "mobile") {
								$(this).nextAll(".error-span").html(null);
							}
						},
						blur: function() {
							if($(this).prop("name") == "code") {
								$(this).parent().css("border-color", "#ccc");
							} else {
								$(this).css("border-color", "#ccc");
							}

						}
					});

					//获取验证码
					$("#code-link").on("click", function() {
						var self = $(this);
						if($.trim($("#mobile").val())) {
							var codeData = {
								mobile: $("#mobile").val(),
								useraction: "HmsUpdateMobile"

							};
							var callbackCodeFun = function(dataC) {
								if(dataC.code === "0000") {
									//时钟
									var seconds = 60;
									var times = null;

									function clocks() {
										clearTimeout(times);
										if(seconds !== 0) {
											seconds--;
											self.html("剩" + seconds + "秒");
											times = setTimeout(clocks, 1000);
										} else {
											clearTimeout(times);
											seconds = 60;
											self.html("点击免费获取");
										}
									}
									clocks();
								}
							
							}
							common.postData(testUrl + urls.allUrls.getMobileCode, codeData, callbackCodeFun, true);
						} else {
							$("#mobile").nextAll(".error-span").html("<label class='error'>请输入手机号码</label>");
						}
					});

					$("#my-form").validate({
						rules: {
							mobile: {
								required: true,
								checkMobile: true
							},
							code: {
								required: true
							},
							email: {
								required: true,
								email: true
							},
							pass: {
								required: true
							},
							newp: {
								required: true,
								checkPassword: true,
								minlength: 6,
								maxlength: 10
							},
							again: {
								required: true,
								equalTo: "#pass"
							}
						},
						messages: {
							mobile: {
								required: "此项为必填项"
							},
							code: {
								required: "此项为必填项"
							},
							email: {
								required: "此项为必填项",
								email: "请输入正确的email格式"
							},
							pass: {
								required: "此项为必填项"
							},
							newp: {
								required: "此项为必填项",
								minlength: "密码由6-20个字符组成",
								maxlength: "密码由6-20个字符组成"
							},
							again: {
								required: "此项为必填项",
								equalTo: "两次输入密码不一致"
							}
						},
						errorPlacement: function(error, element) {
							if($(element).prop("name") == "code") {
								$(element).parent().nextAll(".error-span").html($(error));
							} else {
								$(element).nextAll(".error-span").html($(error));
							}
						},
						highlight: function(element, error) {
							if($(element).prop("name") == "code") {
								$(element).parent().css({
									"border-color": "#ff0000"
								});
							} else {
								$(element).css({
									"border-color": "#ff0000"
								});
							}
						},
						submitHandler: function() {
							var callback = function(datas) {
								if(datas.code === "0000") {
									window.location.reload();
								} else if(datas.code === "0002") {
									$("#old-pass").nextAll(".error-span").html("<label class='error'>"+datas.message+"</label>");
								}else if(datas.code === "1020"){
									common.getOutFun();
								} else {
									dialog({
										title: '提示',
										modal: true,
										content: datas.message,
										ok: function() {},
										cancel: false
									}).width(320).show();
								}
							};

							//修改手机
							var mobileData = {
								mobile: $("#mobile").val(),
								pin: $("#code").val()
							};
							var updateMobileFun = function() {
								common.postData(testUrl + urls.allUrls.updateMobile, mobileData, callback, true);
							};

							//修改邮箱
							var emailData = {
								email: $("#email").val()
							};
							var updateEmailFun = function() {
								common.postData(testUrl + urls.allUrls.updateEmail, emailData, callback, true);
							};

							//修改密码
							var passData = {
								oldPassword: $("#old-pass").val(),
								newPassword: $("#pass").val()
							};
							var updatePassFun = function() {
								common.postData(testUrl + urls.allUrls.updatePass, passData, callback, true);
							};

							switch(flagWord) {
								case 'editMobile':
									updateMobileFun();
									break;
								case 'editEmail':
									updateEmailFun();
									break;
								case 'editPass':
									updatePassFun();
									break;
							}
						}
					});
				});
			} else if(dataS.code=="1020") {
				common.getOutFun();
			}else{
				dialog({
					title: '提示',
					modal: true,
					content: dataS.message,
					ok: function() {},
					cancel: false
				}).width(320).show();
			}
		}
	};
	return controller;
});