define(['text!module/settleaccount/accountDetail.html','css!module/settleaccount/style/accountDetail.css','css!module/settleaccount/style/settleaccount.css'],function(tpl){
	var controller=function(){
		var base=common.serverBaseUrl;
		var url=base+"/api/user/statement/GetStatementDetail";//结算单详情
		var detailData = {
			statementNo: common.getQueryString("balanceId")
		};
		var callback=function(r){
		
			if(r.code="0000"){
				var data={
				    list:r,
					s:r.statementDetailList
				};
				appView.html(_.template(tpl,data));
                $('.balance-details-amend').bind("click",function(){
                    var finishurl=base+"/api/user/statement/BanlanceStatement";
                    var finishcallback=function(k){
                        if(k.code="0000"){
                            $('.balance-details-amend').hide();
                        }
                    };
                    $('.balance-details-statusimg').attr("src","module/settleaccount/style/image/04.png");
                    common.postData(finishurl,{statementId:r.statementId},finishcallback,true);
                });
			}
		};
		common.postData(url,detailData,callback,true);
	}	
	return controller;
});