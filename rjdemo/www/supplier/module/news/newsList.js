define(['text!module/news/newsList.html', 'css!module/news/style/news.css'], function(tpl) {
	var controller = function() {
		var url=common.serverBaseUrl+"/api/user/homepage/GetSupplierMessage";
		var callback=function(datas){
			if(datas.code=="0000"){
				appView.html(_.template(tpl,datas));
				common.tabFocus("消息列表");//菜单栏tab选中
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
		common.postData(url,{},callback,true);
	}
	return controller;
});