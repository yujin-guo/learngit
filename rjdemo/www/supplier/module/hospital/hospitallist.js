define(['text!module/hospital/hospital_list.html','css!module/hospital/style/hospital.css'],function(tpl){
	var controller=function(){
		var hospitalListCallback=function(datas){
			if(datas.code=="0000"){	
				var hospitalData={						
				    hospital:datas.authBrandList
				}
				appView.html(_.template(tpl,hospitalData));
				common.tabFocus("医院管理");
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
		common.postData(baseUrl+urls.allUrls.orgAuthList,{},hospitalListCallback,true);
	};
	return controller;
});