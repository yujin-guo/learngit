define(['text!module/brand/brand.html','css!module/brand/style/brand.css'],function(tpl){
	var controller=function(){
		var base=common.serverBaseUrl,
			url=base+"/api/brand/brandAuthList",//品牌列表请求
			callback=function(r){
				if(r.code="0000"){
					var data={
						list:r.authBrandList,
					}
					appView.html(_.template(tpl,data));
					common.tabFocus("品牌管理");
					if(r.authBrandList&&r.authBrandList.length!=0){
						$(".brand-list").show();
						$(".brand-none").hide();
					}else{
						$(".brand-list").hide();
						$(".brand-none").show();
					}
				};
			}
		common.postData(url,{},callback,true)
	}
	return controller;
});