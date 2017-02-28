define(['text!module/cart/addAddress.html','text!module/cart/reviseAddress.html','text!module/cart/addressInfo.html','text!module/cart/addFundCard.html','js/libs/area',"js/libs/jquery.validate.min"],function (addAddress,reviseAddress,updateAddress,addFundCardHtml,area) {	
	return function(){	
//cart页面 动态效果	
/* 购物车商品总价钱和总件数更新*/
		function update(){
			var $el=$(".cart-bottom-price");
			$el.sum=0;
			$(".cart-item-body .cart-checkbox-highlight").siblings(".cart-item-tprice").each(function(){
				var price=$(this).text().slice(1);
				$el.sum+=parseFloat(price);
			})
			$el.html("￥"+$el.sum.toFixed(2)+"元");
			var $num=$(".cart-bottom-num");
			$num.sum=0;
			$(".cart-item-body .cart-checkbox-highlight").siblings(".cart-item-num").find(".cart-item-num-input").each(function(){
				var num=$(this).val();
				$num.sum+=parseInt(num);
			});
			$num.html($num.sum);
		}
		//购物车数量更新
		function numUpdate(){
			var url=common.serverBaseUrl+urls.allUrls.getCartList;
			var callback=function(r){
				if(r.code=="0000"){
					if(r.total!=0){
						$(".basket-num").html("("+r.total+")")
					}else{
						$(".basket-num").html("")
					}
				}
			}
			common.postData(url,{},callback,true);
		}
		
		//商品数量增减
		$(".cart-item-num em").bind("click",function(){changeProductNum.apply(this)});
		$(".cart-item-num .cart-item-num-input").bind("keyup",function(){changeProductNum.apply(this)});
		function changeProductNum(){
			var $input=$(this).parent().find(".cart-item-num-input"); //购物车数量
			var $sku=$(this).parents(".cart-item-num").find(".cart-item-stock").text();//库存
			var $skuElem=$(this).parents(".cart-item-num").find(".cart-item-sku");//库存标签
            var txt=parseInt($input.val());
            if($(this).text()=="+"){
            	if(txt>=$sku){
            		$skuElem.removeClass("cart-hide");
                }else{
                	txt++;
	                $input.val(txt);
					$skuElem.addClass("cart-hide");
                }
            };
            if($(this).text()=="-"){
             	//if($input.val()<=1){return false};
               	txt--;
              	$input.val(txt);
               	if(txt<=1){
	               	txt=1;
	                $input.val(1);
               }
               	if(txt<$sku){
               		$skuElem.addClass("cart-hide");
               	}else{
               		$skuElem.removeClass("cart-hide");
               		$input.val($sku);
               	}
            };
            if(txt>$sku){
            	$skuElem.removeClass("cart-hide");
            }else{
            	$skuElem.addClass("cart-hide");
            }
			var url=common.serverBaseUrl+urls.allUrls.saveToShoppingCart,//商品数量增减
				data={
					productSn:$(this).parent().siblings("input").val(),
					amount:$(this).parent().find(".cart-item-num-input").val()
				},
				callback=function(r){
					if(r.code=="0000"){
						numUpdate();
					}
				};
			common.postData(url,data,callback,true)	;
			//单种产品总价钱更新效果
			var price=$(this).parent().siblings(".cart-item-price").text().slice(1);
			var tprice=price*txt;
			$(this).parent().siblings(".cart-item-tprice").text("￥"+tprice.toFixed(2));	
			update();
        };
		//加入关注
       $(".cart-add-attention").bind("click",function(){
       		var arr=[];
       		arr.push($(this).parent().siblings(".cart-product-sn").val());
	       	var url=common.serverBaseUrl+urls.allUrls.updateInterestProduct;
	       	var data={
	       	 	productSns:arr,
	       	 	isInteresting:true
	       	};
	       	var callback=function(r){
	       	 	if(r.code=="0000"){
	       	 		dialog({
	                    title: '提示',
	                    modal:true,
	                    content: '商品关注成功。',
	                    ok: function () {},
	                    cancel: false
	                }).width(320).show();
	       	 	}
       	 	};
       	 	dialog({
                title: '提示',
                modal:true,
                content: '确定移入我的关注吗？',
                okValue:"确认",
                ok: function () {
                	common.postData(url,data,callback,true)
                },
                cancelValue:"取消",
                cancel: function(){}
            }).width(320).show();
       })
		
		//输入框占位符效果
        $(".cart-header-search-box").focus(function(){
            this.val="输入名称、货号、商家名称进行搜索";
            if($(this).val()==this.val){
                $(this).val(" ");
            }
        }).blur(function(){
            if($(this).val()==" "){
                $(this).val(this.val);
            }	
        })
		//购物车产品勾选效果及商品项目和总价实时计算
		$(".cart-item-body .cart-checkbox").bind("click",function(){
			$(this).toggleClass("cart-checkbox-highlight");
			var i=0;
			var j=0;
			var cartCheckbox=$(this).parent().parent().find(".cart-checkbox");
			var cartCheckBoxTitle=$(".cart-item-title .cart-checkbox");
			cartCheckbox.each(function(){
				if(!$(this).hasClass("cart-checkbox-highlight")){
					i++;
				}
			});
			if(i==0){
				$(this).parent().parent().siblings(".cart-item-title").children(".cart-checkbox").addClass("cart-checkbox-highlight");
			}else{
				$(this).parent().parent().siblings(".cart-item-title").children(".cart-checkbox").removeClass("cart-checkbox-highlight");
			}
			cartCheckBoxTitle.each(function(){
				if(!$(this).hasClass("cart-checkbox-highlight")){
					j++;
				}
			});
			if(j==0){
				$(".cart-content-bottom .cart-checkbox").addClass("cart-checkbox-highlight");
			}else{
				$(".cart-content-bottom .cart-checkbox").removeClass("cart-checkbox-highlight");
			}
		});

		//单个项目全选效果
		$checkbox=$(".cart-item-title .cart-checkbox");
		$checkbox.bind("click",function(){
			if(!$(this).hasClass("cart-checkbox-highlight")){
				$(this).addClass("cart-checkbox-highlight").parent().siblings(".cart-item-body").find(".cart-checkbox").addClass("cart-checkbox-highlight");
			}else{
				$(this).removeClass("cart-checkbox-highlight").parent().siblings(".cart-item-body").find(".cart-checkbox").removeClass("cart-checkbox-highlight");
			}
			var z=0;
			var cartCheckBoxTitle1=$(".cart-item-title .cart-checkbox");
			cartCheckBoxTitle1.each(function(){
				if(!$(this).hasClass("cart-checkbox-highlight")){
					z++;
				}
			});
			if(z==0){
				$(".cart-content-bottom .cart-checkbox").addClass("cart-checkbox-highlight");
			}else{
				$(".cart-content-bottom .cart-checkbox").removeClass("cart-checkbox-highlight");
			}
		});
		//全选效果
		$checkAll=$(".cart-content-bottom .cart-checkbox");
		$checkAll.bind("click",function(){
			if(!$(this).hasClass("cart-checkbox-highlight")){
				$(".cart-checkbox").addClass("cart-checkbox-highlight");
				//$(".cart-item-body").find(".cart-checkbox").addClass("cart-checkbox-highlight");
			}else{
				$(".cart-checkbox").removeClass("cart-checkbox-highlight");
				//$(".cart-item-body").find(".cart-checkbox").removeClass("cart-checkbox-highlight");
			}
		})
		//当行删除后检测 时间绑定
		$(".cart-item-body-right .cart-item-del").bind("check",function(){
			var $that=$(this);
			var $length=$that.parents("li").siblings("li").length;
			if($length!=0){
				$that.parents("li").remove();
			}else{
				$that.parents(".cart-item").remove();
			};
			update();
			if($(".cart-item").length==0){
				$(".cart-content").hide();
				$(".cart-null").show();
			}
		});
		//当行删除 
		$(".cart-item-body-right .cart-item-del").bind("click",function(){
			var $that=$(this);
			var url=common.serverBaseUrl+urls.allUrls.deleteFromShoppingCart,//删除商品服务地址
			    data={
					productSns:[$that.parent().siblings(".cart-product-sn").val()]
				};	
			dialog({
                title: '提示',
                modal:true,
                content: '确定删除商品吗？',
                okValue:"确认",
                ok: function () {
                	common.postData(url,data,function(r){
                		if(r.code=="0000"){
                			$that.trigger("check");
                			numUpdate();
                		}else{
                			dialog({
			                    title: '提示',
			                    modal:true,
			                    content: r.message,
			                    ok: function () {},
			                    cancel: false      
			                }).width(320).show();
                		}
                	},true);
                },
                cancelValue:"取消",
                cancel: function(){},
                
            }).width(320).show();
		});
		//删除选中商品
		$(".cart-bottom-del").bind("click",function(){
			var num=$(".cart-item-body .cart-checkbox-highlight").length;
			if(num==0){
				dialog({
                    title: '提示',
                    modal:true,
                    content: '您未选中商品。',
                    ok: function () {},
                    cancel: false
                }).width(320).show();
				return false;
			};
			var $elems=$(".cart-checkbox-highlight").parent("li").find(".cart-product-sn");
			var $delBtns=$(".cart-checkbox-highlight").parent("li").find(".cart-item-del");
			var url=common.serverBaseUrl+urls.allUrls.deleteFromShoppingCart;
			var productSns=[];
			$elems.each(function(){
				productSns.push($(this).val());
			});
			var data={
				productSns:productSns
			};
			dialog({
                title: '提示',
                modal:true,
                content: '确定删除商品吗？',
                okValue:"确认",
                ok: function () {
                	common.postData(url,data,function(r){
                		if(r.code=="0000"){
                			$delBtns.each(function(){
	                			$(this).trigger("check");//触发自定义事件
	                		})
                			numUpdate();
                		};
                	},true)
                },
                cancelValue:"取消",
                cancel: function(){},
                
            }).width(320).show();
		});
		//选中商品移入关注
		$(".cart-my-concern").bind("click",function(){
			var $elems=$(".cart-item-body .cart-checkbox-highlight");
			if($elems.length==0){
				dialog({
                    title: '提示',
                    modal:true,
                    content: '请选择商品。',
                    ok: function () {},
                    cancel: false,
                    
                }).width(320).show();
				return false;
			}else{
				var url=common.serverBaseUrl+urls.allUrls.updateInterestProduct;
				var arr=[];
				$elems.each(function(){
					var value=$(this).parents("li").find(".cart-product-sn").val();
					arr.push(value);
				});
		       	var data={
		       	 	productSns:arr,
		       	 	isInteresting:true
		       	};
		       	var callback=function(r){
		       		if(r.code=="0000"){
		       			dialog({
		                    title: '提示',
		                    modal: true,
		                    content: '商品成功移入我的关注。',
		                    ok: function() {},
		                    cancel: false         
		                }).width(320).show();
		       		}else{
		       			dialog({
		                    title: '提示',
		                    modal: true,
		                    content: '关注失败。',
		                    ok: function() {},
		                    cancel: false
		                }).width(320).show();
		       		}
		       	};
		       	dialog({
                    title: '提示',
                    modal: true,
                    content: '确定将商品移入我的关注吗？',
                    okValue:"确认",
                    ok: function() {
                    	common.postData(url,data,callback,true)
                    },
                    cancelValue:"取消",
                    cancel: function(){}
                }).width(320).show();
			}		
		});
		//商品项目和总价实时计算
		$(".cart-checkbox").bind("click",function(){
			update();
		});
		//生成采购申请单
		$(".cart-my-list").bind("click",function(){
			var hospitalName=$.cookie('organization');
			var $elems=$(".cart-item-body .cart-checkbox-highlight");
			var ids=[];//商品id数组
			if($elems.length==0){
				dialog({
                    title: '提示',
                    modal: true,
                    content: '请选择商品。',
                    ok: function() {},
                    cancel: false,
                    
                }).width(320).show();
				return false;
			}else{
				$elems.each(function(){
					var id=$(this).siblings(".cart-item-id").val();
					ids.push(id);
				});
				hospitalName=='浙江省肿瘤医院' ? location.href="#zzcartapply?ids="+encodeURIComponent(ids) : location.href="#cartapply?ids="+encodeURIComponent(ids);
			}
		})
		
//cartApply页面
		//经费卡选择
		var fundCards=[];//经费卡数组
		var $cards=$(".cart-apply-card-choosed:visible");
		$cards.each(function(){
			var arr={};
			arr.id=$(this).find("input").val();
			arr.cardNo=$(this).find("p").eq(1).text();
			arr.name=$(this).find("p").eq(0).text();
			fundCards.push(arr);
		});
		//经费卡勾选效果
		$(".cart-apply-card-name").click(fundcardClick);
		function fundcardClick(){
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
		};
		$(".cart-apply-checkbox").click(function(){
			$(this).siblings(".cart-apply-card-name").click();
		});
		//查询收货地址
		function addressUpdate(){
			var url=common.serverBaseUrl+urls.allUrls.getDeliveryAddress,//查询收货地址
				callback=function(r){
					if(code="0000"){
						$(".cart-apply-address").html(_.template(updateAddress,{address:r.addressList}));//局部刷新收货地址
						addressOperate();//事件绑定
					}
				};
			common.postData(url,{},callback,true)
		}
		
		function addressOperate(){
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
					var url=common.serverBaseUrl+urls.allUrls.addDeliveryAddress,//新增地址
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
								addressUpdate();//收货地址局部更新
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
				var url=common.serverBaseUrl+urls.allUrls.deleteDeliveryAddress,//删除地址
					data={
						id:$(this).parent().siblings(".cart-apply-address-id").val()
					},
					callback=function(r){
						if(r.code=="0000"){
							addressUpdate();
						}else{
							dialog({
			                    title: '提示',
			                    modal: true,
			                    content: r.message,
			                    ok: function() {},
			                    cancel: false
			                }).width(320).show();
						}
					};
				common.postData(url,data,callback,true);
			})
			//修改地址
			$(".cart-apply-address-revise").bind("click",function(){
				var url=common.serverBaseUrl+"/api/user/deliveryAddress/GetDeliveryAddressDetail",//根据id获取地址信息
					id=$(this).parent().siblings(".cart-apply-address-id").val(),
					data={
						id:id
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
						var url=common.serverBaseUrl+"/api/user/deliveryAddress/UpdateDeliveryAddress",//新增地址
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
                                addressUpdate();
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
				var url=common.serverBaseUrl+"/api/user/deliveryAddress/SetAsDefault",//设置默认地址
					data={
						id:$(this).parent().siblings(".cart-apply-address-id").val()
					},
					callback=function(r){
						addressUpdate();
					};
				common.postData(url,data,callback,true);
			})
			//地址切换
			$(".cart-apply-address-item .cart-apply-address-checkbox").bind("click",function(){
				$(this).parent(".cart-apply-address-item").addClass("cart-apply-address-default").siblings(".cart-apply-address-item").removeClass("cart-apply-address-default");
			})
		}
		addressOperate();
		
		//增加地址表单验证
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
		                    cancel: false
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
		//课题组和经费卡绑定
		$(".cart-apply-card").hide();
		$(".cart-apply-card").eq(0).show();
		$(".cart-apply-purchaser-choose").change(function(){
			var id=this.value.split("-")[1];
			$(".cart-apply-card").eq(id).show().siblings("ul").hide();
			fundCards=[];
			$(".cart-apply-card-choosed").click();
		});
		//添加经费卡
		$(".add-fundcard .cart-apply-card-name").off().on("click",function(){
			$("body").append(addFundCardHtml);
			//取消添加经费卡
			$(".fundcard-add-btn-cancel").bind("click",function(){
				$(".fundcard-add").remove();
			});
			//确定添加经费卡
			$(".fundcard-add-btn-confirm").bind("click",function(){
				fundcardFormValidate();
			});
			//经费卡匹配
			var fundcardMatch=_.debounce(fundcardMatch,1500);
			$(".fundcard-add-number").on("keyup",function(){
				fundcardMatch.call(this);
			}).blur(function(){
				$(".fundcard-alike").hide();
			});
			function fundcardMatch(){
				var $that=$(this);
				var fundcardUrl=baseUrl+urls.allUrls.matchFundcard;
				var keyword=$(".fundcard-add-number").val();
				var deptId=parseInt($(".cart-apply-purchaser-choose").val().split("-")[0]);
				var requestData={
					deptId:deptId,
					keyword:keyword,
				};
				var callback=function(r){
					if(r.code=="0000"){
						$(".fundcard-add-item-number .fundcard-alike").remove();
						var depStr='<ul class="fundcard-alike"><%if(typeof(suggestions)!="undefined"){_.each(suggestions,function(i){%><li><span class="fundcard-alike-number"><%=i%></span></li><%})}%></ul>';
						$(".fundcard-add-item-number").append(_.template(depStr,r));
						var addNumber=$that.val();//输入的号码
						var $fundcardAlike=$(".fundcard-alike li");
						$fundcardAlike.each(function(){
							var alikeNumber=$(this).find(".fundcard-alike-number").text();//匹配的号码
							if(alikeNumber.indexOf(addNumber)==0){
								$(this).show();
								var pipeiStr='<em style="color:#f00;font-style:normal">'+addNumber+'</em>'+alikeNumber.slice(addNumber.length);
								$(this).find(".fundcard-alike-number").html(pipeiStr);
							}else{
								$(this).hide();
							}
						});
						if($(".fundcard-alike li:visible").length==0){
							$(".fundcard-alike").hide();
						};
					}else{
						dialog({
	                        title: '提示',
	                        modal: true,
	                        content: r.message,
	                        ok: function() {},
	                        cancel: false,
	                    }).width(320).show();
					}
				};
				if(keyword.length>0){
					common.postData(fundcardUrl,requestData,callback,true);
				};
			}
			//确定提交经费卡
			$("#fundcardAddCofirm").bind("click",function(){
				var url=common.serverBaseUrl+urls.allUrls.addCard,
					cardNo=$(".fundcard-add-number").val().trim(),
					departmentId=$(".cart-apply-purchaser-choose").val().split("-")[0],
					name=$(".fundcard-add-name").val().trim(),
					requestData={
						cardNo:cardNo,
						departmentId:departmentId,
						name:name
					},
					callback=function(r){
						if(r.code=="0000"){
							var fundcardStr='<li class="cart-hascard"><div class="cart-apply-card-name"><p>'+name+'</p><p>'+cardNo+'</p><input type="hidden" value="'+r.id+'"></div><span class="cart-apply-checkbox"></span></li>';
							$(".cart-apply-card .add-fundcard").before(fundcardStr);
							//经费卡事件重新绑定
							$(".cart-hascard .cart-apply-card-name").unbind().bind("click",fundcardClick);
							$(".cart-apply-checkbox").unbind().click(function(){
								$(this).siblings(".cart-apply-card-name").click();
							});
							$(".fundcard-add").remove();
						}else{
							$(".fundcard-add-item-number .fundcard-error-wrap").html(r.message);
						}
					};
				common.postData(url,requestData,callback,true);
			});
		})
		//经费卡添加表单验证
		function fundcardFormValidate(){
			$("#fundcardForm").validate({
				rules:{
					fundcardname:{
						required:true,
						maxlength:8
					},
					fundcardnumber:{
						required:true,
						number:true,
						maxlength:20
					},
				},
				messages:{
					fundcardname:{
						required:"必填项",
						maxlength:"经费卡名称长度不能超过8"
					},
					fundcardnumber:{
						required:"必填项",
						number:"号码格式错误，请输入数字",
						maxlength:"经费卡号码长度不能超过20"
					},
				},
				errorPlacement:function(error,element){
					$(element).next(".fundcard-error-wrap").append(error);
				},
				errorElement:"em",
				submitHandler:function(){	
					$("#fundcardAddCofirm").click();
				}
			})
		};
		
		//提交采购申请单数据
		$(".cart-apply-submit").bind("click",function(){
			if($(".cart-apply-address-spec").text()==false){
				dialog({
                    title: '提示',
                    modal: true,
                    content: '请填写收货地址。',
                    ok: function() {},
                    cancel: false
                }).width(320).show();
				return false;
			};
			var ids=[];//商品id数组
			$(".cart-apply-return-id").each(function(){
				var id=$(this).val();
				ids.push(id);
			});
			
			var url=common.serverBaseUrl+"/api/order/addPurchaseApply",
			    data={
			    	applyInfo:$(".cart-apply-desc").val().trim(),
			    	fundCards:fundCards,
			    	tdeliveryAddress:{
			    		address:$(".cart-apply-address-default .cart-apply-address-spec").text(),
			    		consignee:$(".cart-apply-address-default .cart-apply-consignee").text(),
			    		mobile:$(".cart-apply-address-default .cart-apply-mobile").text(),
			    		id:$(".cart-apply-address-default .cart-apply-address-id").val()
			    	},
			    	ids:ids,
			    	department:{
			    		id:$(".cart-apply-purchaser-choose").val().split("-")[0],
			    		name:$(".cart-apply-purchaser-choose").find("option:selected").text().trim(),
			    		users:[]
			    	}
			    },
			    callback=function(r){
					if(r.code=="0000"){
						$(".cart-apply-flow").hide();
			    		$(".cart-apply-success").show();
					}else{
						dialog({
		                    title: '提示',
		                    modal: true,
		                    content: r.message,
		                    ok: function() {},
		                    cancel: false
		                }).width(320).show();
					}
			   };
			//采购申请单单提交    
			common.postData(url,data,callback,true);    
		})
   }   
});
