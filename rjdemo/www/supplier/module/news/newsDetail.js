define(['text!module/news/newsDetail.html', 'css!module/news/style/news.css'], function(tpl) {
	var controller = function(id) {
		var url=common.serverBaseUrl+"/api/user/message/MessgaeDetail";
		var messageDetailData={
			id:id
		};
		var callback=function(datas){
			if(datas.code=="0000"){
				appView.html(_.template(tpl,datas));
				common.tabFocus("消息列表");
			}
		};
		common.postData(url,messageDetailData,callback,true);
	}
	return controller;
});