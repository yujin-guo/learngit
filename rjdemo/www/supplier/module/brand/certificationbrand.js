define(['text!module/brand/certificationBrand.html','css!module/brand/style/certificationBrand.css'],function(tpl){
	var controller=function(){
		appView.html(_.template(tpl));
		common.tabFocus("品牌管理");		
		//品牌选择
		$(".c-brand-option-a").bind("click",function(){
			$(this).addClass("c-brand-choose").siblings().removeClass("c-brand-choose")
		})
		//下一步
		$(".c-brand-next-step").bind("click",function(){
			if($(".c-brand-choose").length==0){
				dialog({
                    title: '提示',
                    modal: true,
                    content: "请选择品牌类型",
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
			}else{
				if($(".c-brand-choose").text()=="自有品牌"){
					window.location.href="#certificationinfo?self=1";
				}else{
					window.location.href="#certificationinfo?self=0";
				}
			}
		})
	}
	return controller;
});