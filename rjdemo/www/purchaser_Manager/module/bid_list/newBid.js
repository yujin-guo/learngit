define(['text!module/bid_list/newBid.html','css!module/bid_list/style/newBid.css', 'js/libs/laydate.dev'],function(tpl){
	var controller=function(){
		//$('#right-container').html(tpl);

        //获取竞价单详情
        var bidId = common.getQueryString("id");  
        var fundCards=[];//经费卡数组
        var getDeptListCallback = function(datas) {  
            if(datas.code == "0000") {
                $('#right-container').html(_.template(tpl, datas));
                cardEvents();
                if(bidId!=""){
                    var getInfoCallback = function(datas) {  
                      //  $('#right-container').html(_.template(tpl, datas));
                        if(datas.resultCode == "0000") {
                            var d=new Date(datas.order.endDate);
                            var localtime=common.getLocalTime(d);
                            var deptName=datas.order.deptName;//返回的部门名称
                            var $hasDeps=$(".status-absolute dt");//拥有的部门名称
                            $hasDeps.each(function(){//选择返回的已选的部门
                            	if($(this).text()==deptName){
                            		$(this).click();
                            	}
                            });
                            $('#bidendtime').val(localtime);
                            $('#bid-beizhu').val(datas.order.remark);
                            var choosedCards=datas.order.fundCards;//返回的已选经费卡
                            var $hasFundcards=$(".cart-apply-card:visible .cart-apply-card-name");//拥有的经费卡
                            $hasFundcards.each(function(){//选择返回的已选的经费卡
                            	var $that=$(this);
                            	_.each(choosedCards,function(i){
                            		if($that.find("input").val()==i.id){
                            			$that.click();
                            		}
                            	})
                            })
                        }
                    }
                    common.postData(bidUrl+urls.allUrls.getBasicBid+bidId,{id:bidId},getInfoCallback,true); 
                }   
                eventbind();
            }
        };
        //经费卡请求地址
        var cardUrl=baseUrl+"/api/order/getDepartmentAndFundCard";
        common.postData(cardUrl,{},getDeptListCallback,true);
		function cardEvents(){
			//经费卡选择
			var $cards=$(".cart-apply-card-choosed:visible");
			$cards.each(function(){
				var arr={};
				arr.id=$(this).find("input").val();
				arr.cardNo=$(this).find("p").eq(1).text();
				arr.name=$(this).find("p").eq(0).text();
				fundCards.push(arr);
			});
			//经费卡勾选效果
			$(".cart-apply-card-name").click(function(){
				$(this).toggleClass("cart-apply-card-choosed");
				$(this).siblings(".cart-apply-checkbox").toggleClass("cart-apply-checkbox-highlight");
				if($(this).hasClass("cart-apply-card-choosed")){
					var arr={};
					arr.id=$(this).find("input").val();
					arr.cardNo=$(this).find("p").eq(1).text();
					arr.name=$(this).find("p").eq(0).text();
					fundCards.push(arr); 
				}else{
					var id=$(this).find("input").val();
					_.each(fundCards,function(i,index){
						if(i.id==id){
							fundCards.splice(index,1);
						}
					})
				}
			});
			$(".cart-apply-checkbox").click(function(){
				$(this).siblings(".cart-apply-card-name").click();
			});
			//课题组和经费卡绑定
			$(".cart-apply-card").hide();
			$(".cart-apply-card").eq(0).show();
			$(".status-absolute dt").click(function(){
				var index=$(this).index();
				$(".cart-apply-card").eq(index).show().siblings("ul").hide();
				fundCards=[];
				$(".cart-apply-card-choosed").click();
			});
		};

        var commonFun=function(callback,listData){
           common.postData(bidUrl+urls.allUrls.saveBid,listData,callback,true);
        };
        common.tabFocus("新建竞价");
        function eventbind(){
            //点击保存竞价单的回调函数，跳到新建竞价单第二步
            var newFun = function(datas) {  
                var deptId=$("#order-recon").attr("value");
                if(datas.resultCode == "0000") {
                    window.location.href="#newbidsec?id="+datas.id+"&deptId="+deptId;
                }else if(datas.resultCode=="1001"){
                    common.getOutFun();
                }else{
                    dialog({
	                    title: '提示',
	                    modal:true,
	                    content: datas.msg,
	                    ok: function () {},
	                    cancel: false
	                }).width(320).show();
                } 
            };
            
            /* 所属部门下拉列表 */
            $("#p_dept").click(function(){
                if($(this).nextAll(".status-absolute").hasClass("show")){
                    $(this).nextAll(".status-absolute").removeClass("show");
                }else{
                    $(this).nextAll(".status-absolute").addClass("show");
                }
            });
            $("dt").click(function(){
                var dataValue=$(this).attr("data-value");
                var dataText=$(this).html();
                $(this).parent().siblings("input[type='hidden']").prop("value",dataValue);
                deptId=$(this).parent().siblings("input[type='hidden']").prop("value");
                $(this).parent().siblings(".search-cell").prop("value",dataText);
                $(this).parent().removeClass("show");
            });
            //点击保存竞价单      
            $('.bid-next-step').bind('click',function(){
                if($('#p_dept').val()==""){
                    dialog({
	                    title: '提示',
	                    modal:true,
	                    content: '请选择所属部门',
	                    ok: function () {},
	                    cancel: false
	                }).width(320).show();  
                }else{
                    var deptId=$("#order-recon").attr("value");
                    if(bidId!=""){
                        var listData={
                            id:bidId,
                            deptId:deptId,
                            endDate:Date.parse(new Date($('#bidendtime').val())),
                            fundCards:fundCards,
                            remark:$('#bid-beizhu').val()
                        };    
                    }else{
                       var listData={
                            deptId:deptId,
                            endDate:Date.parse(new Date($('#bidendtime').val())),
                            fundCards:fundCards,
                            remark:$('#bid-beizhu').val()
                        };     
                    }        
                    
                    if(listData.deptId==""||listData.endDate==""){
                         dialog({
                            title: '提示',
                            modal:true,
                            content: "请填写截标时间或所属部门",
                            ok: function () {},
                            cancel: false
                        }).width(320).show();
                    }else{
                       commonFun(newFun,listData); 
                    }     
                }
            });
            /*时间控件*/
            laydate({
                elem: '#bidendtime',
                istime:true,
                format: 'YYYY-MM-DD hh:mm:ss',
                min: laydate.now(), 
                choose:function(dates){
                    $("#bidendtime").attr("disabled",false);
                }
            });     
        } 
	}
	return controller;
});
