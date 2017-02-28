define(['text!module/cart/cart.html','common','module/cart/myCart','css!module/cart/style/cart.css',"domready!"], function (tpl,common,mycart) {
    var controller = function () {
			var _url=common.serverBaseUrl+urls.allUrls.getCartList,//购物车列表
			callback=function(r){
				if(r.code=="0000"){
					var cartData={						
					    cart:r.shoppingCart
					}
					appView.html(_.template(tpl,cartData));	
					common.search();
					mycart();
					if($(".cart-item").length!=0){
						$(".cart-null").hide();
					}else{
						$(".cart-content").hide();
					}	
				}	
			}
		//获取数据
		common.postData(_url,{},callback,true);
    }
    return controller;
});
