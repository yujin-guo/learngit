/**
 * Created by guoyujin on 2016/11/18.
 */
define(['text!module/information/infodetails.html', 'css!module/information/style/information.css'], function(tpl){
	var controller = function(id,time) {
		$(".header").css("display","block");
		var url=cmsUrl+urls.allUrls.getInfoDetail+id,
			data={
				id:id
			},
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
		common.postData(url,data,callback,true);
	};
	return controller;
});