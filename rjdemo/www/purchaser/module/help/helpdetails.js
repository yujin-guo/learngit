define(['text!module/help/helpdetails.html', 'css!module/information/style/information.css'], function(tpl){
	var controller = function(id,time) {
		$(".header").css("display","block");
		var url=cmsUrl+urls.allUrls.noticeDetails+id,
			callback=function(r){
				if(r.resultCode=="0000"){
					r.time=time;
					appView.html(_.template(tpl,r));
					
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
				}
			}
		common.getData(url,null,callback,true);
	};
	return controller;
});