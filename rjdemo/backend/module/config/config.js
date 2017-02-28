define(['text!module/config/config.html','text!module/config/header.html','text!module/config/common_nav.html','css!module/config/style/config.css'],function(tpl,header,nav,loadHtml){
	var controller = function() {
		appView.html(_.template(header));
		
		var url=testUrl+urls.allUrls.getAptSetup;//获取验收方式
		
		var callback=function(r){
			if(r.code="0000"){
				r.nav=nav;
				$("#right-container").html(_.template(tpl,r));
				if(r.crossAcceptance==1){
                    $("#jiaocha").attr("checked",true);
                }else{
                    $("#self").attr("checked",true);
                }
                eventbind();
			}
		}
        var saveCallback=function(r){
			if(r.code="0000"){
				dialog({
                    title: '提示',
                    modal:true,
                    content: '保存验收方式成功',
                    ok: function () {},
                    cancel: false
                }).width(320).show();
			}else{
                dialog({
                    title: '提示',
                    modal:true,
                    content: r.message,
                    ok: function () {},
                    cancel: false
                }).width(320).show(); 
            }
		}
        
		common.postData(url, {}, callback, true);
        function eventbind(){
            $('.content-save').bind("click",function(){
                var id=0;
                if($('#jiaocha').prop('checked') == true){
                    id=1;
                }else{
                    id=0;
                }     
                var data={
                    crossAcceptance:id 
                }
                common.postData(testUrl+urls.allUrls.saveAptSetup, data, saveCallback, true); 
            });
        }
	};
	return controller;
});
