define(['text!module/import/importConfirm.html','css!module/import/style/import.css'],function(tpl){
	var controller=function(){
		var base=common.serverBaseUrl;
		var url=base+"/api/product/verifyProductDocument";//商品导入地址		
		var path="http://"+decodeURIComponent(common.getQueryString("path"));
		var requestData={
			path:path,
			type:"NONE"
		};
		var callback=function(r){
			if(r.code=="0000"){
				var data={
					r:r.report
				}
				appView.html(_.template(tpl,data));
				eventBind();
			}else{
				dialog({
                    title: '提示',
                    modal: true,
                    content: r.message,
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
                window.history.back();
			}
		}
		common.postData(url,requestData,callback,true)
		
		
		function eventBind(){
			$(".import-confirm .import-btn").bind("click",function(){
				var type=$(".import-repeat-choose:checked").val();
				switch(type){
					case "1":type="INPUT_NO_REPEAT";
					break;
					case "2":type="INPUT_UPDATE_REPEAT"
				}
				requestData={
					"type":type,
					"path":path
				}
				var callback=function(r){
					if(r.code=="0000"){
						window.location.href="#importsuccess"
					}else{
						dialog({
		                    title: '提示',
		                    modal: true,
		                    content: "导入失败。",
		                    ok: function() {},
		                    cancel: false,
		                }).width(320).show();
					}
				}
				common.postData(url,requestData,callback,true)
			})
		}
	}
	return controller;
});