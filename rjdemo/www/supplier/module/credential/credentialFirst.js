define(['text!module/credential/credentialFirst.html','css!module/credential/style/credential.css'],function(tpl){
	var controller=function(){
		appView.html(tpl);
		common.tabFocus("资质认证");
		$(".credential-checkbox").bind("click",function(){
		    $(this).toggleClass("active");
		});
		$(".credential-nextstep").bind("click",function(){
		    if($(".credential-checkbox").hasClass("active")){
				window.location.href="#credentialSecond";
			}
			else{
				dialog({
                    title: '提示',
                    modal: true,
                    content: "您还没同意协议",
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
			}
		})
	};
	return controller;
});