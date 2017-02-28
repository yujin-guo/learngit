define(['text!module/news/newsDetail.html', 'css!module/news/style/news.css'], function(tpl) {
	var controller = function() {
		var ids=common.getQueryString("id");
		var messageDetailData={
			id:ids
		};
		var callbackDetailFun=function(datas){
			if(datas.code=="0000"){
				$('#right-container').html(_.template(tpl,datas));
				
				common.tabFocus("消息通知");
				//面包屑导航
				$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#newsList' class='purchase-bread'>消息列表</a></span><span class='bread-span'>&gt;&nbsp;消息详情</span>");
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
		common.postData(baseUrl+urls.allUrls.getMessageDetail,messageDetailData,callbackDetailFun,true);
	}
	return controller;
});