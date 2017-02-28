define(['text!module/hospital/hospital_pass.html','css!module/hospital/style/hospital.css'],function(tpl){
	var controller=function(){
		var detailData = {
			authId: parseInt(common.getQueryString("id"))
		};
		var callbackHosFun=function(datas){
			if(datas.code="0000"){
                var id=parseInt(common.getQueryString("id"));
                var orgId=parseInt(common.getQueryString("orgId"));
				var hospitalData={						
				    hospital:datas.authDetail
				}
				appView.html(_.template(tpl,hospitalData));
				common.tabFocus("医院管理");
                $('.control-link').bind("click",function(){
                    window.location.href="#hospitalapply?id="+id+"&orgId="+orgId;
                });
			}else{
				dialog({
                    title: '提示',
                    modal: true,
                    content: datas.message,
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
			}
		};
		common.postData(baseUrl+"/api/org/orgAuthInfo",detailData,callbackHosFun,true);
	};
	return controller;
});