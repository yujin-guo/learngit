define(['text!module/order/comment.html','text!module/header/header01.html','css!module/order/style/order.css',],function(tpl,header){
	var controller=function(orderNo){
		appView.html(header);
		$.cookie("order","yes");//可以进入我的订单
		var base=common.serverBaseUrl;
		var url=base+urls.allUrls.getOrderList,
			data={
				search:orderNo
			},
			callback=function(r){
				if(r.code=="0000"){
					$("#bidWrapper").html(_.template(tpl,r.orderLists[0]));
					//面包屑
					$(".header-01-bread").html('<a href="" class="bread-hover">采购人中心</a><span class="header01-arrow">&gt;</span><a href="javascript:;" class="bread-hover back-to-commentlist">评价列表</a><span class="header01-arrow">&gt;</span><a href="javascript:;">商品评价</a>')
					$(".back-to-commentlist").bind("click",function(){
						window.location.href="#commentlist";
						window.location.reload();
					})
					submit();
				}
			};
		common.postData(url,data,callback,true)
		
		
		function submit(){
			//发表评论提交按钮
			$(".comment-submit").bind("click",function(){
				var dataArr=[],//请求数据数组
					url=base+"/api/order/addProductComment",
					flag=0,//若为1则评论有漏填项
					$elem=$('.comment-content .comment-item');
				$elem.each(function(){
					var level=$(this).find("input:radio:checked").val();
					var comments=$(this).find(".comment-item-input").val();
					if(validate(level)){
						flag=1;
						return false;
					};//数据是否有空
					var data={
						detailId:$(this).find(".comment-detail-id").val(),
						level:level,
						comment:comments
					};
					dataArr.push(data)
				});
				if(flag){return false};
				var requestData={
					comments:dataArr
				},
				callback=function(r){
					if(r.code=="0000"){
						dialog({
		                    title: '提示',
		                    modal:true,
		                    content: '恭喜完成评价。',
		                    ok: function () {
		                    	window.location.href="#order";
		                    	window.location.reload();
		                    },
		                    cancel: false,
		                }).width(320).show();
					}else{
						dialog({
		                    title: '提示',
		                    modal:true,
		                    content: r.message,
		                    ok: function () {
		                    	window.location.href="#order";
		                    	window.location.reload();
		                    },
		                    cancel: false,
		                }).width(320).show();
					}
				}
				common.postData(url,requestData,callback,true)
			})
			/*cookie信息*/
			if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
				$("#user-nav").append("<a href='../purchaser_Manager/index.html' id='user-name'>" + $.cookie('username') +
					"</a><a href='javascript:void(0)' class='pd-lf-8' id='out'>退出</a>")
				if($("#login")) {
					$("#login").remove();
				}
			} else {
				$("#user-nav").append("<a href='#/login' id='login'>登录</a><em class='pd-lf-10 pd-rg-10'>|</em><a href='#/providerfirst?key=login'>供应商注册</a>");
			}
			/*退出登录*/
			$("#out").on("click", function() {
	            common.getOutFun();
			});
	        /*输入字数显示*/
	       	$(".comment-item-input").bind("keyup",function(){
	       		var num=$(this).val().length;
	       		if(num>=200){
	       			$(this).css("borderColor","red");
	       			var value=$(this).val().slice(0,200);
	       			$(this).val(value);
	       			num=200;
	       		}else{
	       			$(this).css("border-color","#999");
	       		}
	       		$(this).next().find(".comment-words").text(num);
	       	})
		}
		//商品评价验证数据是否为空
		function validate(level){
			if(level==undefined){
				dialog({
                    title: '提示',
                    modal:true,
                    content: '商品打分不能为空。',
                    ok: function () {},
                    cancel: false,
                }).width(320).show();
                return true;
			}
		}
	}
	return controller;
});
