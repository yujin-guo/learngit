/**
 * Created by guoyujin on 2016/11/18.
 */
define(['text!module/information/infodetails.html', 'css!module/information/style/information.css'], function(tpl){
	var controller = function(id,time) {
		var url=cmsUrl+urls.allUrls.getInfoDetail+id,
			data={
				id:id
			},
			callback=function(r){
				if(r.resultCode=="0000"){
					r.time=time;
					appView.html(_.template(tpl,r));
				}
			}
		common.postData(url,data,callback,true);
	};
	return controller;
});