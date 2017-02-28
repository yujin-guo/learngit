define(["text!module/header/header01.html","text!module/bid_list/bidDetails.html",'text!module/bid_list/address.html','text!module/bid_list/addAddress.html','text!module/bid_list/reviseAddress.html','css!module/bid_list/style/bidDetails.css','js/libs/area',"js/libs/jquery.validate.min"],function(header,tpl,addressHtml,addAddress,reviseAddress){
	var controller=function(id){
		appView.html(header);
	    /*cookie信息*/
		if($.cookie('id') != undefined && $.cookie('id') != '' && $.cookie('id') != null) {
			$("#user-nav").append("<a href='../purchaser_Manager/index.html' id='user-name'>" + $.cookie('username') +
				"</a><a style='color:#333;' href='javascript:void(0)' class='pd-lf-8' id='out'>退出</a>")
			if($("#login")) {
				$("#login").remove();
			}
		} else {
			$("#user-nav").append("<a href='#login' id='login'>登录</a><em class='pd-lf-10 pd-rg-10'>|</em><a href='#providerfirst?key=login'>供应商注册</a>");
		}
		/*退出登录*/
		$("#out").on("click", function() {
            common.getOutFun();
		});
		$.cookie("order","yes");//可以进入我的订单
		var url=bidUrl+urls.allUrls.getBidDetails+id,//订单详情请求地址
			data={
				id:id
			},
			callback=function(r){
				if(r.resultCode=="0000"){
					var orderData={
						flows:r.flows,
						items:r.items||{},
						order:r.order||{},
						convert:convertTime,
					};
					$("#bidWrapper").html(_.template(tpl,orderData));
					$.cookie("biddetails","yes");//cookie记录访问竞价详情页面，按后退键将访问是否有此cookie刷新页面
					eventBind();
					//初选和终审驳回收货地址
					if(r.order.status==30||r.order.status==49){
						addressLoad();
					};
				}else{
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: r.msg,
	                    ok: function () {
	                    	location.href="#bidlist";
	                    	location.reload();
	                    },
	                    cancel: false
	                }).width(320).show();
				}
			};
		common.postData(url,data,callback,true);
		
		//时间转换
		var mydate=new Date();
		function convertTime(number){
			mydate.setTime(number);
			var y=mydate.getFullYear(),
			m=mydate.getMonth()+1,
			d=mydate.getDate(),
			h=mydate.getHours(),
			min=mydate.getMinutes(),
			s=mydate.getSeconds();
			m=m<10?"0"+m:m;
			d=d<10?"0"+d:d;
			h=h<10?"0"+h:h;
			min=min<10?"0"+min:min;
			s=s<10?"0"+s:s;
			return y+"-"+m+"-"+d+" "+h+":"+min+":"+s;
		}
		//初选中、终审驳回收货地址
		function addressLoad(){
			var url=baseUrl+urls.allUrls.getAddressList;
			var callback=function(r){
				if(r.code=="0000"){
					var data={
						address:r.addressList
					};
					$("#bidAddress").html(_.template(addressHtml,data));
					addressEvent();
				}else{
					dialog({
			    		title:"提示",
			    		content:r.message,
			    		modal:true,
			    		okValue:"确定",
			    		ok:function(){}
			    	}).width(320).show();
				}
			};
			common.postData(url,{},callback,true);
		}
		//收货地址事件绑定
		function addressEvent(){
			//添加新地址
			$(".cart-apply-address-add").bind("click",function(){
				$('body').append(addAddress)
				_init_area();
				//事件绑定
				$(".address-add-btn-confirm").bind("click",function(){
					formValidate();
				})
				$("#addressAddCofirm").bind("click",function(){
					var province=$(".address-add-province").val().trim();
					var city=$(".address-add-city").val().trim();
					var district=$(".address-add-district").val().trim();
					district=district=="市、县级市"?"":district;
					var url=baseUrl+"/api/user/deliveryAddress/AddDeliveryAddress",//新增地址
						data={
							consignee:$(".address-add-consignee").val().trim(),
							mobile:$(".address-add-mobile").val().trim(),
							telephone:$(".address-add-telephone").val().trim(),
							province:province,
							city:city,
							district:district,
							address:$(".address-add-extra").val().trim()
						},
						callback=function(r){
							if(r.code="0000"){
								$('.address-add').remove();
								addressLoad();//收货地址局部更新
							}
						};
					common.postData(url,data,callback,true);	
				})
				$(".address-add-btn-cancel").bind("click",function(){
					$('.address-add').remove();
				})
			})
			//删除地址
			$(".cart-apply-address-cancel").bind("click",function(){
				var url=baseUrl+"/api/user/deliveryAddress/DeleteDeliveryAddress",//删除地址
					data={
						id:$(this).parent().siblings(".cart-apply-address-id").val()
					},
					callback=function(r){
						if(r.code=="0000"){
							addressLoad();
						}
					};
				common.postData(url,data,callback,true);
			})
			//修改地址
			$(".cart-apply-address-revise").bind("click",function(){
				var url=baseUrl+"/api/user/deliveryAddress/GetDeliveryAddressDetail",//根据id获取地址信息
					id=$(this).parent().siblings(".cart-apply-address-id").val(),
					data={
						id:id,
					},
					callback=function(r){
						if(r.code=="0000"){
							$("body").append(_.template(reviseAddress,{data:r}));
							_init_area();
							$("#s_province").val(r.province);
							change(1);
							$("#s_city").val(r.city);
							change(2);
							$("#s_county").val(r.district);
							eventBind();
						}
					};
				common.postData(url,data,callback,true)
				function eventBind(){
					//事件绑定
					$(".address-add-btn-confirm").bind("click",function(){
						formValidate();
					})
					$("#addressAddCofirm").bind("click",function(){
						var url=baseUrl+"/api/user/deliveryAddress/UpdateDeliveryAddress",//新增地址
							district=$(".address-add-district").val().trim();
						district=district=="市、县级市"?"":district;
						var	data={
								id:id,
								consignee:$(".address-add-consignee").val().trim(),
								mobile:$(".address-add-mobile").val().trim(),
								telephone:$(".address-add-telephone").val().trim(),
								province:$(".address-add-province").val().trim(),
								city:$(".address-add-city").val().trim(),
								district:district,
								address:$(".address-add-extra").val().trim()
							},
							callback=function(r){
								if(r.code="0000"){
									$('.address-add').remove()
									addressLoad();
								}
							};
						
						common.postData(url,data,callback,true);	
					})
					$(".address-add-btn-cancel").bind("click",function(){
						$('.address-add').remove();
					})
				}
			})
			//设置默认地址
			$(".cart-apply-address-setting").bind("click",function(){
				var url=baseUrl+"/api/user/deliveryAddress/SetAsDefault",//设置默认地址
					data={
						id:$(this).parent().siblings(".cart-apply-address-id").val()
					},
					callback=function(r){
						if(r.code=="0000"){
							addressLoad();
						}
					};
				common.postData(url,data,callback,true);
			})
			//地址切换
			$(".cart-apply-address-item .cart-apply-address-checkbox").bind("click",function(){
				$(this).parent(".cart-apply-address-item").addClass("cart-apply-address-default").siblings(".cart-apply-address-item").removeClass("cart-apply-address-default");
			})
		}
		//表单验证
		function formValidate(){
			$("#addressForm").validate({
				rules:{
					consignee:"required",
					address:"required",
					mobile:{
						required:true,
						number:true,
						maxlength:11,
						minlength:11
					}
				},
				messages:{
					consignee:null,
					address:null,
					mobile:null
				},
				errorPlacement:function(error,element){
					$(element).next(".address-error-wrap").append(error);
				},
				submitHandler:function(){	
					if($("#s_province").val()=="省份"){
						dialog({
		                    title: '提示',
		                    modal: true,
		                    content: '请选择省份。',
		                    ok: function() {},
		                    cancel: false
		                }).width(320).show();
						return false;
					};
					if($("#s_city").val()=="地级市"){
						dialog({
		                    title: '提示',
		                    modal: true,
		                    content: '请选择市。',
		                    ok: function() {},
		                    cancel: false,
		                }).width(320).show();
						return false;
					};
					if($("#s_county").val()=="市、县级市"){
						dialog({
		                    title: '提示',
		                    modal: true,
		                    content: '请选择县级市。',
		                    ok: function() {},
		                    cancel: false
		                }).width(320).show();
						return false;
					};
					$("#addressAddCofirm").click();
				}
			})
			
		}
		//事件绑定
		function eventBind(){
			var bidId=$("#bidId").val();//竞价单id
			var deptId=$("#bidDeptId").val();//部门id
			//提交初审
			$(".b-details-submit").bind("click",function(){
				var url=bidUrl+urls.allUrls.submitBid+bidId,
				    requestData={
				    	id:bidId
				    },
				    callback=function(r){
				    	if(r.resultCode=="0000"){
				    		dialog({
					    		title:"提示",
					    		content:"提交成功。",
					    		modal:true,
					    		okValue:"确定",
					    		ok:function(){
					    			$(".b-details-submit,.b-details-revise,.b-details-cancel").hide();
					    			location.reload();
					    		},
					    	}).width(320).show();
				    	}else{
				    		dialog({
					    		title:"提示",
					    		content:r.msg,
					    		modal:true,
					    		okValue:"确定",
					    		ok:function(){}
					    	}).width(320).show();
				    	}
				    };
				dialog({
		    		title:"提示",
		    		content:"确定提交初审吗?",
		    		modal:true,
		    		okValue:"确定",
		    		ok:function(){
		    			common.postData(url,requestData,callback,true)
		    		},
		    		cancelValue:"取消",
		    		cancel:function(){}
		    	}).width(320).show();
			});
			//撤回申请
			$(".b-details-revoke").bind("click",function(){
            	var $that=$(this);
            	var url=bidUrl+urls.allUrls.revokeBid;
            	var data={
            		id:bidId
            	};
            	var callback=function(r){
            		if(r.resultCode=="0000"){
                    	$that.remove();
                    	dialog({
		                    title: '提示',
		                    modal:true,
		                    content:"申请撤回成功。",
		                    ok: function () {
		                    	location.reload();
		                    },
		                    cancel: false
		                }).width(320).show();
            		}else{
            			dialog({
		                    title: '提示',
		                    modal:true,
		                    content:r.msg,
		                    ok: function () {},
		                    cancel: false,
		                }).width(320).show();
            		}
            	};
            	dialog({
                    title: '提示',
                    modal:true,
                    content: "您确定撤回申请吗？",
                    okValue:"确定",
                    ok: function () {
                    	common.postData(url,data,callback,true);
                    },
                    cancelValue:"取消",
                    cancel: function(){}
                }).width(320).show();
            });
			//修改竞价
            $(".b-details-revise").bind("click",function(){
           		 window.location.href="#newbidsec?id="+bidId+"&deptId="+deptId;
           		 window.location.reload();
            })
            //面包屑竞价列表跳转
            $(".bread-hover-bidlist").bind("click",function(){
            	location.href="#bidlist";
            	location.reload();
            	return false;
            })
            //全部放弃
            $(".b-details-abandon-o").bind("click",function(){
            	var $that=$(this);
            	dialog({
		    		title:"提示",
		    		content:"确定全部放弃吗?",
		    		modal:true,
		    		okValue:"确定",
		    		ok:function(){
		    			var $table=$that.parents("table");
		    			$table.addClass("table-three");
		    			$table.find(".b-details-winner-reason").parents("tr").remove();
		    			$table.find(".b-bid").remove();
		    			$that.parents("tbody").append('<tr><td colspan=11 class="b-details-winner-reason">放弃理由：<input type="text" class="b-details-abandon-reason"></td></tr>');
		    			$table.find(".b-details-abandon-reason").focus();
		    			$table.find("input:radio").attr({"disabled":"disabled","checked":false});
		    			$that.unbind();
		    		},
		    		cancelValue:"取消",
		    		cancel:function(){}
		    	}).width(320).show();
            })
            //选择供应商
           $(".b-details-choose").bind("click",function(){
            	var $that=$(this),
            		$parent=$that.parents(".b-details-radio");
            	if(!$that.hasClass("checked")){
	            	$that.addClass("checked");
	            	$that.parents("tr").siblings().find(".b-details-choose").removeClass("checked");
	            	$that.parents("tr").siblings().find(".b-bid").remove();
	            	$that.parents("tbody").find(".b-details-winner-reason").parents('tr').remove();
	            	var $tr=$(this).parents("tr");
	            	$tr.after('<tr><td colspan=11 class="b-details-winner-reason">选择理由：<input type="text" class="b-details-choose-reason"></td></tr>')
	            	$tr.siblings().find(".b-details-choose-reason").focus();
	            	var str='<div class="b-bid" style="position:absolute"><p class="b-bid-top"></p><p class="b-bid-middle"><span>中标</span></p><p class="b-bid-bottom"></p></div>';
	            	$that.parents(".b-details-radio").append(str);
	            	$parent.find(".b-bid").css({left:$parent.width()+2+"px",top:0});
	            	var height=$parent.parent().height()+$parent.parent().next("tr").height()-14;
	            	$parent.find(".b-bid-middle").css({height:height/2+18,"padding-top":(height/2-18)+"px"});
	            };
            })
           //已选中供应商
            $(".b-bid").each(function(){
            	$(this).css({left:$(this).parent().width()+2+"px",top:0});
            	var height=$(this).parents("tr").height()+$(this).parents("tr").next("tr").height()-14;
            	$(this).find(".b-bid-middle").css({height:height/2+18,"padding-top":(height/2-18)+"px"});
            })
            
            //删除草稿竞价单
            $(".b-details-cancel").bind("click",function(){
            	var url=bidUrl+urls.allUrls.deleteBid+id,
            		requestData={
            			id:id
            		},
            		callback=function(r){
            			if(r.resultCode=="0000"){
	         				dialog({
				         		title:"提示",
				         		content:"草稿删除成功。",
				         		modal:true,
				         		okValue:"确定",
				         		ok:function(){
				         			location.href="#bidlist";
				         			location.reload();
				         		},
				         		cancel:false
				         	}).width(320).show();
	         			}else{
	         				dialog({
				         		title:"提示",
				         		content:r.msg,
				         		modal:true,
				         		okValue:"确定",
				         		ok:function(){},
				         		cancel:false
				         	}).width(320).show();
	         			}
            		};
            	dialog({
	         		title:"提示",
	         		content:"确定删除吗？",
	         		modal:true,
	         		okValue:"确定",
	         		ok:function(){
	         			common.postData(url,requestData,callback,true);
	         		},
	         		cancelValue:"取消",
	         		cancel:function(){}
	         	}).width(320).show();
            })
            //初选提交
            $(".b-details-supplier-submit").bind("click",function(){
            	var url=bidUrl+urls.allUrls.supplierSelected,
            	    $tables=$(".table-two"),
            	    operations=[],
            	    callback=function(r){
            	    	if(r.resultCode=="0000"){
            	    		dialog({
	            				title:"提示",
	            				content:"提交成功。",
	            				modal:true,
	            				okValue:"确定",
	            				ok:function(){
	            					location.href="#bidlist";
	            					location.reload();
	            				}
	            			}).width(320).show();
            	    	}else{
            	    		dialog({
	            				title:"提示",
	            				content:r.msg,
	            				modal:true,
	            				okValue:"确定",
	            				ok:function(){
	            					/*location.href="#bidlist";
	            					location.reload();*/
	            				}
	            			}).width(320).show();
            	    	}
            	    },
            	    flag=false;//全部商品完成操作标识,全部完成为false
            	$tables.each(function(){
            		var itemId=$(this).find(".b-details-item-id").val(),
            		    $bidElem=$(this).find(".b-details-choose:radio:checked"),
            		    $abandonReason=$(this).find(".b-details-abandon-reason"),
            		    bidId,
            		    status=$(this).find(".b-details-item-id").attr("data-status"),
            		    reason;
            		if($bidElem.length>0){
            			bidId=$bidElem.siblings(".b-details-bid-id").val();
            			reason=$(this).find(".b-details-choose-reason").val();
            			if(!reason){
            				dialog({
	            				title:"提示",
	            				content:"选择理由不能为空。",
	            				modal:true,
	            				okValue:"确定",
	            				ok:function(){}
	            			}).width(320).show();
	            			flag=true;
	            			return false;
            			}
            		}else if($abandonReason.length>0){
            			bidId=null;
            			reason=$(this).find(".b-details-abandon-reason").val();
            			if(!reason){
            				dialog({
	            				title:"提示",
	            				content:"放弃理由不能为空。",
	            				modal:true,
	            				okValue:"确定",
	            				ok:function(){}
	            			}).width(320).show();
	            			flag=true;
	            			return false;
            			}
            		}else if($(this).find("input:radio").length==0){
            			bidId=null;
            			reason=null;
            		}else{
            			flag=true;
            			dialog({
            				title:"提示",
            				content:"请完成全部竞价商品的操作。",
            				modal:true,
            				okValue:"确定",
            				ok:function(){}
            			}).width(320).show();
            			return false;
            		};
            		var obj={
            			itemId:itemId,
            			bidId:bidId,
            			reason:reason,
            			status:status,
            		};
            		operations.push(obj);
            	});
            	if(flag){return false};
            	dialog({
    				title:"提示",
    				content:"确定提交吗?",
    				modal:true,
    				okValue:"确定",
    				ok:function(){
    					var orderId=$("#bidId").val();
    					var addressId=$(".cart-apply-address-default .cart-apply-address-id").val();
    					var data={
    						orderId:orderId,
    						addressId:addressId,
    						operations:operations
    					};
    					common.postData(url,data,callback,true);
    				},
    				cancelValue:"取消",
    				cancel:function(){}
    			}).width(320).show();
            })
		};
	}
	return controller;
});