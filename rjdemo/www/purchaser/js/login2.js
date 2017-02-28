/*create by lijinhua*/
define(['js/libs/jquery.validate.min','js/urls'], function(validates,urls) {
	var login = function() {
		var loginUrl=urls.allUrls.login;
		$(".common").bind({
			focus: function(){
				$(this).parent().css("border-color", "#008cd0");
				if($(this).attr("name")=="username"){
					$(this).nextAll(".login-icon").css({"border-color":"#008cd0","background-color":"#cef","background-position":"-400px -2px"});
				}else{
					$(this).nextAll(".login-icon").css({"border-color":"#008cd0","background-color":"#cef","background-position":"-400px -46px"});
				}
			},
			blur: function() {
				$(this).parent().css("border-color", "#999");
				if($(this).attr("name")=="username"){
					$(this).nextAll(".login-icon").css({"border-color":"#999","background-color":"#fff","background-position":"-440px -2px"});
				}else{
					$(this).nextAll(".login-icon").css({"border-color":"#999","background-color":"#fff","background-position":"-440px -46px"});
				}
				
			}
		});
		
		//表单验证
		$("#login-form").validate({
			rules:{
				username:{
					required:true
				},
				password:{
					required:true
				}
			},
			messages:{
				name:{
					required:"null"
				},
				password:{
					required:"null"
				}
			},
			errorClass:"login-error",
			errorPlacement:function(error,element){
				$(element).append(error);
			},
			highlight:function(element,errorClass){
				$(element).addClass("login-error");
				$(element).parent().css("border-color","#ff5555");
				$(element).nextAll(".login-icon").css("border-color","#ff5555");
			},
			submitHandler:function(){
				var loginFun=(function(){
					var loginData={
						username:$.trim($("#username").val()),
						password:$.trim($("#password").val())
					};
					var baseUrl=common.serverBaseUrl;
					var callbackFun=function(datas){
                        console.dir(datas.user);
						if(datas.code=="0000"){
							$.cookie('id',datas.user.id,{expires:1,path:'/'});
							$.cookie('username',datas.user.realName,{expires:1,path:'/'});
							$.cookie('organization',datas.user.organization.name,{expires:1,path:'/'});
							//console.log($.cookie('id'),$.cookie('username'))
							window.location.href="index.html";
						}else if(datas.code=="1006"){
							dialog({
                                title: '提示',
                                modal:true,
                                content: datas.message,
                                ok: function () {},
                                cancel: false,
                            }).width(320).show();
							/*$("#submit").removeAttr("disabled");*/
						}else{
							dialog({
                                title: '提示',
                                modal:true,
                                content: datas.message,
                                ok: function () {},
                                cancel: false,
                            }).width(320).show();
						}
					};
					return{
						loginMethod:function(){
							common.postData(baseUrl +loginUrl,loginData,callbackFun,false);
							/*$("#submit").attr("disabled","disabled");*/
						}
					};
				})();
				loginFun.loginMethod();
			}
		});
	};
	return login;
});
