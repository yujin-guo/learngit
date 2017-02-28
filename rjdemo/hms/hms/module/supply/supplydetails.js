define(['text!module/supply/supplyDetails.html', 'text!module/supply/header.html', 'text!module/supply/common_nav.html', 'css!module/supply/style/supplyDetails.css'], function(tpl, header, nav) {
	var controller = function(id,status) {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var url=testUrl+urls.allUrls.getSupplierDetails;//供应商详情
		var data={
			id:id
		};
		var callback=function(r){
			if(r.code=="0000"){
				var data={
					nav:nav,
					data:r,
					status:status
				};
				$("#right-container").html(_.template(tpl,data));
				eventBind();
			}
		}
		common.postData(url,data,callback,true);
		
		function eventBind(){
			//返回上一级
			$(".supply-details-back").bind("click",function(){
				window.location.href="#supply";
			})
			window.scrollTo(0,0);
			
			//子导航 跳转
			$(".secondary-title").bind("click",function(){
				var index=$(this).index();
				window.location.href="#supply?index="+index;
			})
			//提交审核
			var updateUrl=testUrl+urls.allUrls.updateSupplierStatus;
			$(".supply-details-submit").bind("click",function(){
                if($("input:checked").val()=="1"){
                    var data={
                        id:id,
                        status:2,
                        approvalOpinion:$("#myopion").val()
                    };
                }
                if($("input:checked").val()=="0"){
                    var data={
                        id:id,
                        status:3,
                        approvalOpinion:$("#myopion").val()
                    };
                }
				var callback=function(r){
                    if($("input:checked").val()=="1"){
                        content="审核通过";
                    }
                    if($("input:checked").val()=="0"){
                        content="审核驳回";
                    }
                    if(r.code=="0000"){
                        dialog({
                            title: '提示',
                            modal:true,
                            content: content,
                            ok: function () {
                                window.location.href="#supply";
                            },
                            cancel: false
                        }).width(320).show();
                    }else{
                        dialog({
                            title: '提示',
                            modal:true,
                            content:r.message,
                            ok: function () {},
                            cancel: false
                        }).width(320).show();
                    }
				};
				common.postData(updateUrl,data,callback,true);
			});		
		}
	};
	return controller;
});