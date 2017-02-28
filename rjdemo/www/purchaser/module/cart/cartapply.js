define(['text!module/cart/cartApply.html','common','module/cart/myCart','css!module/cart/style/cart.css',"domready!"],function(tpl,common,mycart,addFundCardHtml){
	var controller=function(){
		var ids=decodeURIComponent(common.getQueryString("ids"));
		ids=ids.split(",");
		var base=common.serverBaseUrl;
		var url=base+"/api/order/loadShoppingCard",//购物车商品详情请求地址
			data={},
			callback=function(r){
				if(r.code=="0000"){
					data.r=r;
					data.details=r.shoppingCart;
					common.postData(url2,{},callback2,true);
				}else{
					dialog({
	                    title: '提示',
	                    modal: true,
	                    content: showErrMsg(r.list),
	                    ok: function() {},
	                    cancel: false,
	                }).width(320).show();
					window.history.back();
					
				}
			};
		//获取购物车商品生成采购单数据
		common.postData(url,{ids:ids},callback,true);
		
		var url2=common.serverBaseUrl+"/api/order/getDepartmentAndFundCard",//经费卡请求地址
			callback2=function(r){
				if(r.code=="0000"){
					$.extend(data,{card:r.departmentModels});
					common.postData(addressUrl,{},addressCallback,true);
				}
			};
		var addressUrl=base+"/api/user/deliveryAddress/GetDeliveryAddress",//请求收货地址
			addressCallback=function(r){
				if(r.code=="0000"){
					data.address=r.addressList;
					appView.html(_.template(tpl,data));
					
					common.search();
					mycart();
					$(".cart-apply-success").hide();
				}
			}
		//商品下架或者库存不足提示	
		function showErrMsg(list){
			var str="";
			_.each(list,function(i){
				if(i.sku||i.sku==0){
					str+=i.name+":"+i.errMsg+",库存"+i.sku+"<br>"
				}else{
					str+=i.name+":"+i.errMsg+"<br>"
				}
			})
			return str;
		}
	}
	return controller;
})
