define(['text!module/hospital/hospital_apply.html','css!module/hospital/style/hospital.css'],function(tpl){
	var controller=function(){
        common.tabFocus("医院管理");
		appView.html(tpl); 
        //获取平台入驻详情
        var detailData = {
			authId: parseInt(common.getQueryString("id"))
		};
		var applyInfoCallback=function(datas){
			if(datas.code=="0000"){
                $(".content").text(datas.authDetail.appReason);
			}else{
				dialog({
                    title: '提示',
                    modal: true,
                    content: datas.message,
                    ok: function() {},
                    cancel: false
                }).width(320).show();
			}
		};
        if(!common.isNull(parseInt(common.getQueryString("id")))){
            common.postData(baseUrl+urls.allUrls.orgAuthInfo,detailData,applyInfoCallback,true);     
        }   
        //提交申请        
		$(".submit-link").bind("click",function(){
			var submitData = {
				appReason:$(".content").val(),
				orgId: parseInt(common.getQueryString("orgId"))
			};
			var submitCallback=function(datas){
				if(datas.code=="0000"){
					window.location.href="#waiting";
				}else{
					dialog({
                        title: '提示',
                        modal: true,
                        content: datas.message,
                        ok: function() {},
                        cancel: false
                    }).width(320).show();
				}
			};
			common.postData(baseUrl+urls.allUrls.orgApp,submitData,submitCallback,true);	
		});
	};
	return controller;
});