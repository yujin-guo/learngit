define(['text!module/order/orderDetails.html', 'text!module/order/header.html', 'text!module/order/common_nav.html', 'css!module/order/style/orderDetails.css'], function(tpl, header, nav) {
	var controller = function(orderId) {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var url=testUrl+urls.allUrls.getOrderInfo;//订单详情地址
		var data={
			id:orderId
		};
		var callback=function(r){
			if(r.code=="0000"){
				var data={
					nav:nav,
					order:r.orderInfo.order,
					details:r.orderInfo.orderDetails,
					status:r.orderInfo.order.status,
					card:r.orderInfo.fundCard,
					returned:r.orderInfo.returnInfos
				}
				$("#right-container").html(_.template(tpl,data));
				eventBind();
			}
		}
		common.postData(url,data,callback,true);
		
		function eventBind(){
			$(".order-details-back").bind("click",function(){
				window.location.href="#order";
			})
			window.scrollTo(0,0);
			$(".secondary-title").bind("click",function(){
				var index=$(this).index();
				window.location.href="#order?index="+index;
			})
			//菜单栏高度重置
			setTimeout(function(){
				var height=$(document).height()-50;
				$(".nav-left").height(height);
				$(".nav-inner-left").height(height);
			},500);
		}
	};
	return controller;
});