define(['text!module/approval/approvalDetails.html', 'text!module/approval/header.html', 'text!module/approval/common_nav.html', 'css!module/approval/style/supplyDetails.css'], function(tpl, header, nav) {
	var controller = function(id,status) {
		userPermissions=JSON.parse($.cookie("permissions"))
		appView.html(_.template(header));
		var url=testUrl+urls.allUrls.accreditationInfo;//供应商详情
		var data={
			accreditationId:id
		};
		var callback=function(r){
			if(r.code=="0000"){
				if(r.licensePic==undefined){
					r.licensePic==null;
				}
				var data={
					nav:nav,
					data:r,
                    pic:r.licensePic,
                //    logo:r.logo.replace(/\"/g,"").replace(/\)/g,""),
                   // org:,
					status:status
				}
				$("#right-container").html(_.template(tpl,data))
				eventBind();
			}
		}
		common.postData(url,data,callback,true)
		
		function eventBind(){
			//返回上一级
			$(".supply-details-back").bind("click",function(){
				window.location.href="#approval";
			})
			window.scrollTo(0,0);
			
			//子导航 跳转
			$(".secondary-title").bind("click",function(){
				var index=$(this).index()
				window.location.href="#approval?index="+index
			})
			//提交审核
			var updateUrl=testUrl+urls.allUrls.accreditationApprove;
			$(".supply-details-submit").bind("click",function(){
                var chk=0;
                var chksupplyPass = document.getElementById("supplyPass");
                var chksupplyRejected = document.getElementById("supplyRejected");
                if(chksupplyPass.checked){
                    chk = 1;
                    var data={
                        accteditationId:id,
                        isAgree:true,
                        comment:$("#myCheck").val()
                    };
                }
                if(chksupplyRejected.checked){
                    chk = 0;
                    var data={
                        accteditationId:id,
                        isAgree:false,
                        comment:$("#myCheck").val()
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
                                window.location.href="#approval";
                            },
                            cancel: false,
                        }).width(320).show();
                    }else{
                        dialog({
                            title: '提示',
                            modal:true,
                            content:r.message,
                            ok: function () {
                                
                            },
                            cancel: false
                        }).width(320).show();
                    }
				};
				common.postData(updateUrl,data,callback,true);
			})
			
			
		}
	};
	return controller;
});