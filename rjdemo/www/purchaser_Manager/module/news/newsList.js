define(['text!module/news/newsList.html', 'css!module/news/style/news.css'], function(tpl) {
	var controller = function() {
		var messageData={};
		var callbackMessageFun=function(datas){
			if(datas.code=="0000"){
				$('#right-container').html(_.template(tpl,datas));
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;消息列表</span>");
			}else{
				dialog({
                    title: '提示',
                    modal: true,
                    content: datas.message,
                    ok: function() {
                        window.location.href="../purchaser/index.html";
                    },
                    cancel: false,
                }).width(320).show();
			}
			common.tabFocus("消息通知");
		};
		common.postData(baseUrl+urls.allUrls.getPurcharseMessage,messageData,callbackMessageFun,true);
	}
	return controller;
});