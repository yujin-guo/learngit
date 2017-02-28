define(['text!module/cart/addAddress.html','text!module/cart/reviseAddress.html','text!module/cart/addressInfo.html','text!module/cart/addFundCard.html','text!module/cart/popup.html','js/libs/area',"js/libs/jquery.validate.min",'css!module/cart/style/popup.css'],function (addAddress,reviseAddress,updateAddress,addFundCardHtml,popupHtml,area) {	
	return function(){	
		//项目选择
		var $projects=$('.cart-apply-project-choose'),//项目
			$subpros=$('.cart-apply-subpro-choose'),//子项目
			$subjects=$('.cart-apply-subject-choose');//科目
		$subpros.hide();//子项目隐藏，真实数据只有项目和科目两级，后台返回的子项目为假数据
		$projects.on('change',function(){
			$subpros.find('option').first().show().siblings().hide();
			$subpros.find('option').first().prop('selected',true);
			$subjects.find('option').first().show().siblings().hide();
			$subjects.find('option').first().prop('selected',true);
			var index=$(this).find('option:selected').attr('data-index');
			if(index!=0){
				$subpros.find('option').first().siblings().each(function(){
					if($(this).attr('data-index').split('-')[0]==index){
						$(this).show();
					}else{
						$(this).hide();	
					}
				});
				$subpros.find('option:eq('+index+')').prop('selected',true);
				$subpros.change();
			}
			
		});
		$subpros.on('change',function(){
			$subjects.find('option').first().show().siblings().hide();
			$subjects.find('option').first().prop('selected',true);
			var index=$(this).find('option:selected').attr('data-index');
			if(index!=0){
				$subjects.find('option').first().siblings().each(function(){
					if($(this).attr('data-index').split('-')[0]==index.split('-')[0]){
						$(this).show();
					}else{
						$(this).hide();	
					}
				});
			}
		});
		$subjects.on('change',function(){
			var index=$(this).find('option:selected').attr('data-index');
			if(index!=0){
				projectMoney();
			}
		})
		//科目余额情况
		function projectMoney(){
			var projectId=$subjects.val();
			var url=baseUrl+urls.allUrls.getUserProjectDetail;
			var ids=[];//商品id数组
			$(".cart-apply-return-id").each(function(){
				var id=$(this).val();
				ids.push(id)
			});
			var requestData={
				ids:ids,
				id:projectId
			};
			var callback=function(r){
				if(r.code=="0000"){
					if(r.enough){
						$('.cart-apply-project-money').text('充足');
					}else{
						$('.cart-apply-project-money').text('不足');
					}
				}
			};
			common.postData(url,requestData,callback,true);
		}
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
			var url=baseUrl+"/api/user/deliveryAddress/GetDeliveryAddress",//查询收货地址
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
				var url=baseUrl+"/api/user/deliveryAddress/DeleteDeliveryAddress",//删除地址
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
				var url=baseUrl+"/api/user/deliveryAddress/SetAsDefault",//设置默认地址
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
		                    cancel: false,
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
		                    cancel: false,
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
			var id=this.value.split("-")[1]
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
				var url=baseUrl+urls.allUrls.addCard,
					cardNo=$(".fundcard-add-number").val().trim(),
					departmentId=$(".cart-apply-purchaser-choose").val().split("-")[0],
					name=$(".fundcard-add-name").val().trim(),
					requestData={
						cardNo:cardNo,
						departmentId:departmentId,
						name:name,
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
						maxlength:8,
					},
					fundcardnumber:{
						required:true,
						number:true,
						maxlength:20,
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
                    cancel: false,
                    
                }).width(320).show();
				return false;
			};
			if($subjects.val()==0){
				dialog({
                    title: '提示',
                    modal: true,
                    content: '请选择项目和科目。',
                    ok: function() {},
                    cancel: false,
                }).width(320).show();
				return false;
			}
			var ids=[];//商品id数组
			$(".cart-apply-return-id").each(function(){
				var id=$(this).val();
				ids.push(id)
			});
			
			var url=baseUrl+"/api/order/addPurchaseApply",
			    data={
			    	applyInfo:$(".cart-apply-desc").val().trim(),
			    	fundCards:fundCards,
			    	tdeliveryAddress:{
			    		address:$(".cart-apply-address-default .cart-apply-address-spec").text(),
			    		consignee:$(".cart-apply-address-default .cart-apply-consignee").text(),
			    		mobile:$(".cart-apply-address-default .cart-apply-mobile").text(),
			    		id:$(".cart-apply-address-default .cart-apply-address-id").val(),
			    	},
			    	ids:ids,
			    	department:{
			    		id:$(".cart-apply-purchaser-choose").val().split("-")[0],
			    		name:$(".cart-apply-purchaser-choose").find("option:selected").text().trim(),
			    		users:[]
			    	},
			    	id:$subjects.val()
			    },
			    callback=function(r){
					if(r.code=="0000"){
						$(".cart-apply-flow").hide();
			    		$(".cart-apply-success").show();
					}else if(r.code=="4010"){
						$('body').append(popupHtml);
						$('.popup-close,.popup-confirm').on('click',function(){
							$('.popup').remove();
						});
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
			common.postData(url,data,callback,true)    
		})
   }   
});
