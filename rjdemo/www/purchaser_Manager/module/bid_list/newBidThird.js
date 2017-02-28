define(['text!module/bid_list/newBidThird.html','css!module/bid_list/style/newBid.css'],function(tpl){
	var controller=function(){
        var bidId = common.getQueryString("id");
		$('#right-container').html(tpl);
        $('#bidDet').bind("click",function(){
            window.location.href="#biddetails/"+bidId;
        })
        common.tabFocus("新建竞价");
        $(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;提交初审成功</span>");
	}
	return controller;
});