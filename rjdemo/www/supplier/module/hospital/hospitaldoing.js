define(['text!module/hospital/hospital_doing.html','css!module/hospital/style/hospital.css'],function(tpl){
	var controller=function(){
		var detailData = {
			authId: parseInt(common.getQueryString("id"))
		};
		var callbackHosFun=function(datas){
			if(datas.code="0000"){
				var hospitalData={						
				    hospital:datas.authDetail
				}
				appView.html(_.template(tpl,hospitalData));
				common.tabFocus("医院管理");
                /* 撤回申请 */
                $('.control-link').bind("click",function(){
                    common.postData(baseUrl+"/api/org/orgAppWithdraw",detailData,callbackWithdraw,true);
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
        var callbackWithdraw=function(datas){
			if(datas.code="0000"){
				window.location.href="#hospital";
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