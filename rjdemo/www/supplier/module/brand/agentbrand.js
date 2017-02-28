define(['text!module/brand/agentBrand.html','css!module/brand/style/agentBrand.css'],function(tpl){
	var controller=function(id){
		var base=common.serverBaseUrl,
			url=base+"/api/brand/brandInfo",//品牌详情
			brandId,
			callback=function(r){
				if(r.code=="0000"){
					var data={
						basic:r.brand,
						auth:r.brandAuthDetail,
					};
					brandId=r.brandAuthDetail.authId;
					appView.html(_.template(tpl,data));
					eventBind()
				};
			}
		common.postData(url,{id:id},callback,true)
		
		function eventBind(){
			$(".brand-cancel").bind("click",function(){
				var url=base+"/api/brand/brandDel",//删除品牌授权
					data={id:$(".a-brand-authid").val()},
					callback=function(r){
						if(r.code=="0000"){
							window.location.href="#brand";
						}else{
                            dialog({
                                title: '提示',
                                modal: true,
                                content:r.message ,
                                ok: function() {},
                                cancel: false
                            }).width(320).show();
                        }
					};
				common.postData(url,data,callback,true);
			});
			
			$(".brand-modify").bind("click",function(){
				var self=$(".a-brand-level").val()==0? 1:0;//self=1为自有品牌
				window.location.href="#certificationinfo?self="+encodeURIComponent(self)+"&id="+encodeURIComponent(brandId);
			});
			common.tabFocus("品牌管理");//菜单栏tab选中
		}

	}
	
	return controller;
});