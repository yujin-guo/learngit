define(['text!module/settlement/preSettle.html','text!module/settlement/loadPreSettle.html','text!module/settlement/submitSettle.html','module/settlement/submitsettle','text!module/settlement/reviseCard.html','text!module/settlement/addFundCard.html','text!module/settlement/popup.html','js/libs/laydate.dev','css!module/settlement/style/settlement.css','css!module/settlement/style/popup.css',"pagination","js/libs/jquery.validate.min"],function(tpl,preSettle,submitSettle,submitsettle,reviseCardHtml,addFundCardHtml,popupHtml){
	var controller=function(){
		var url=baseUrl+urls.allUrls.getNoBanOrders,  //待结算列表服务地址
		    depUrl=baseUrl+urls.allUrls.getDeptsW,  //部门接口
		    totalNum,//待结算单总条数
		    pageSize=20,
		    orderData={},//template数据
		    data={
		    	pageNo:1,
		    	pageSize:pageSize
		    },
		    callback=function(r){
		    	if(r.code=="0000"){
		    		orderData.list=r.orderList;
		    		totalNum=r.totalPages*pageSize;
					$("#right-container").html(_.template(tpl,orderData));
					$(".total-page-num").text(r.totalPages);
					if(r.orderList.length==0){
						$(".list-page,.settle-more-btn,.settle-submit-wrap").hide();
					}else{
						$(".list-page,.settle-more-btn,.settle-submit-wrap").show();
					};
					//面包屑导航
					$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#settlement' class='purchase-bread'>结算列表</a></span><span class='bread-span'>&gt;&nbsp;待结算</span>");
					loadPreSettle();
		    	}else{
		    		dialog({
                        title: '提示',
                        modal: true,
                        content: r.message,
                        ok: function() {history.back()},
                        cancel: false,
                    }).width(320).show();
		    	}
		    };
		var depCallback=function(r){
        	if(r.code=="0000"){
        		orderData.depts=r.depts;
        		common.postData(url,data,callback,true);
        	}
       };
		common.postData(depUrl,{},depCallback,true)
		
		//获取当天时间
		function nowTime(){
			var mydate=new Date();
			var y=mydate.getFullYear();
			var m=mydate.getMonth()+1;
			var d=mydate.getDate();
			m=m<10?"0"+m:m;
			d=d<10?"0"+d:d;
			return y+"-"+m+"-"+d;
		}
		//结算单金额超十万提示
		
		function loadPreSettle(){
			/**
			 * 分页设置
			 * @param {Object} data 搜索条件
			 * @return {function} 分页回调函数
			 * */
			function page(data){
				var pageCallback=function(i){
					var baseData={
						pageSize:pageSize,
						pageNo:i+1
					},
					callback=function(r){
						if(r.code=="0000"){
							var data={
								list:r.orderList
							};
							$("#settleContent").html(_.template(preSettle,data));
							eventBind();
							window.scrollTo(0,0);
							if(r.orderList.length==0){
								$(".list-page,.settle-submit-wrap").hide();
							}else{
								$(".list-page,.settle-submit-wrap").show();
							}
						}
					};
					$.extend(data,baseData);
					common.postData(url,data,callback,true);
				}
				return pageCallback;
			}
			common.pageFun(totalNum,1,pageSize,page({}));//页面初始化
			
			//更多搜索部门
			$(".settle-more-department").focus(function(){
				$(".settle-department-choices").slideDown("slow")
			}).blur(function(){
				$(".settle-department-choices").delay(200).slideUp("slow");
			});
			$(".settle-department-choices li").bind("click",function(){
				var txt=$(this).text();
				$(".settle-more-department").val(txt);
			});
			
			//顶部采购部门搜索
			$(".settle-search-department").focus(function(){
				$(".settle-top-department-choices").slideDown("slow")
			}).blur(function(){
				$(".settle-top-department-choices").delay(200).slideUp("slow");
			})
			$(".settle-top-department-choices li").bind("click",function(){
				var txt=$(this).text();
				$(".settle-search-department").val(txt);
			});
			//重置
			$(".settle-more-btn-reset").bind("click",function(){
				$(".settle-more-num,.settle-more-department,.settle-more-buyer,.settle-more-fund,#startTime,#endTime").val("");
			})
			//更多搜索
			$(".settle-more-btn-search").bind("click",function(){
				var orderNo=$.trim($(".settle-more-num").val()),
				department=$.trim($(".settle-more-department").val()),
				buyer=$.trim($(".settle-more-buyer").val()),
				fundcard=$.trim($(".settle-more-fund").val()),
				startTime=$.trim($("#startTime").val())||"1975-01-01",
				endTime=$.trim($("#endTime").val())||nowTime();
				var searchData={
					pageNo:1,
		    		pageSize:pageSize,
			    	querySet:{}
				};
				if(orderNo!=""){
					searchData.querySet.orderNo=orderNo;
				};
				if(department!=""){
					searchData.querySet.department=department;
				};
				if(buyer!=""){
					searchData.querySet.buyer=buyer;
				};
				if(fundcard!=""){
					searchData.querySet.fundcard=fundcard;
				};
				if(startTime!=""){
					searchData.querySet.startTime=startTime;
				};
				if(endTime!=""){
					searchData.querySet.endTime=endTime;
				};
			    var	callback=function(r){
					if(r.code=="0000"){
						var data={
							list:r.orderList
						};
						totalNum=r.totalPages*pageSize;
						$("#settleContent").html(_.template(preSettle,data));
						eventBind();
						window.scrollTo(0,0);
						common.pageFun(totalNum,1,pageSize,page(searchData));//页面初始化
						$(".total-page-num").text(r.totalPages);
						if(r.orderList.length==0){
							$(".list-page,.settle-submit-wrap").hide();
						}else{
							$(".list-page,.settle-submit-wrap").show();
						}
					}
				};
				common.postData(url,searchData,callback,true);
			})
			//分页内的绑定事件
			function eventBind(){
				//结算金额的实时计算
				function totalMoney(){
					$(".settle-money-num").each(function(){
						var $items=$(this).parents(".settle-content-title").siblings(".settle-content-item").find(".settle-checkbox-selected").parent().siblings(".settle-order-money");
						var sum=0;
						$items.each(function(){
							sum+=parseFloat($(this).text());
						})
						$(this).text(sum.toFixed(2))
					});
				}
				//修改经费卡
				var orderId;//订单id
				var $theReviseOrder;//指向修改的订单栏
				$(".settle-revise").bind("click",function(){
					$theReviseOrder=$(this);//绑定修改的订单栏
					var $fundCards=$(this).parents(".settle-title-revise").find("p");
					var fundCards=[];//列表中已选的经费卡数组
					var hasCards=[];//已选的经费卡
					var notChoosed=[];//未选的经费卡
					$fundCards.each(function(){
						fundCards.push($(this).text());
					});
					orderId=$(this).next(".settle-order-id").val();
					var getCardUrl=baseUrl+urls.allUrls.getOrderCard,//获取经费卡
					    updateCardUrl=baseUrl+urls.allUrls.updateOrderCard,//更新经费卡
						getCardData={
							orderId:orderId
						},
						reviseCardData={
							fundcards:[{id:"",cardNo:"",cardName:""}]
						},
						callback=function(r){
							if(r.code=="0000"){
								_.each(r.fundCards,function(i){
									var num=0;
									_.each(fundCards,function(item){
										if(i.cardNo==item){
											hasCards.push(i);
											return false;
										}else{
											num++;
										}
									})
									if(num==fundCards.length){
										notChoosed.push(i);
									}
								})
								var data={
									hasCards:hasCards,
									notChoosed:notChoosed,
								}
								$("body").append(_.template(reviseCardHtml,data));
								cardEventBind();
							}
						}
					common.postData(getCardUrl,getCardData,callback,true)
				})
				//经费卡事件绑定
				function cardEventBind(){
					var fundcardsArr=[];//选择的经费卡号
					$(".card-cell-choose").each(function(){
						var $that=$(this);
							var data={
								id:$that.find(".card-hidden").attr("data-id"),
								cardNo:$that.find(".card-num").text(),
								cardName:$that.find(".class-card-icon").text(),
							};
							fundcardsArr.push(data)
					})
					//关闭经费卡
					$(".card-head-icon,.card-sure-cancel").bind("click",function(){
						$(".purchase-card-wrap,.card-wrap").remove();
					});
					//选择经费卡
					$(".card-cell").bind("click",function(){
						var $that=$(this);
						$(this).toggleClass("card-cell-choose");
						$(this).next().find(".fundcard-checkbox").toggleClass("fundcard-checkbox-selected");
						if($(this).hasClass("card-cell-choose")){
							var data={
								id:$that.find(".card-hidden").attr("data-id"),
								cardNo:$that.find(".card-num").text(),
								cardName:$that.find(".class-card-icon").text(),
							};
							fundcardsArr.push(data)
						}else{
							var cardId=$that.find(".card-hidden").attr("data-id");
							_.each(fundcardsArr,function(item,index){
								if(item.id==cardId){
									fundcardsArr.splice(index,1)
								}
							});
						};
					})
					$(".fundcard-checkbox").bind("click",function(){
						$(this).parent().siblings(".card-cell").click();
					})
					//提交经费卡
					$(".card-sure-link").bind("click",function(){
						var url=baseUrl+urls.allUrls.updateOrderCard;
						var requestData={
							fundCards:fundcardsArr,
							orderId:orderId
						};
						var callback=function(r){
							if(r.code=="0000"){
								dialog({
			                        title: '提示',
			                        modal: true,
			                        content: "修改成功。",
			                        ok: function() {},
			                        cancel: false,
			                    }).width(320).show();
			                    $(".purchase-card-wrap,.card-wrap").remove();//关闭修改经费卡号弹窗
			                    var str='<%_.each(fundCards,function(i){%><p><%=i.cardNo%></p><%})%>';
			                    $theReviseOrder.siblings("span").html(_.template(str,{fundCards:fundcardsArr}))
							}
						};
						common.postData(url,requestData,callback,true)
					});

					//添加经费卡
					$(".card-cell-add").off().on("click",function(){
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
						$(".fundcard-add-number").on("keyup",function(){
							var $that=$(this);
							var fundcardUrl=baseUrl+urls.allUrls.matchFundcard;
							var keyword=$(".fundcard-add-number").val();
							var deptId=parseInt($theReviseOrder.parents(".settle-content").find(".settle-department-id").val());
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
							}
						}).blur(function(){
							$(".fundcard-alike").hide();
						})
						//确定提交经费卡
						$("#fundcardAddCofirm").bind("click",function(){
							var url=baseUrl+urls.allUrls.addFundcard,
								cardNo=$(".fundcard-add-number").val().trim(),
								departmentId=$theReviseOrder.parents(".settle-content").find(".settle-department-id").val(),
								name=$(".fundcard-add-name").val().trim(),
								requestData={
									cardNo:cardNo,
									departmentId:departmentId,
									name:name,
								},
								callback=function(r){
									if(r.code=="0000"){
										var fundcardStr='<li><span class="card-cell"><p class="class-card-icon">'+name+'</p><p class="card-num">'+cardNo+'</p><input class="card-hidden" type="hidden" data-id="'+r.id+'"></span><div><span class="fundcard-checkbox"></span></div></li>';
										$(".card-cell-add").parent("li").before(fundcardStr);
										//经费卡事件重新绑定
										$(".card-cell").unbind().bind("click",function(){
											$(this).toggleClass("card-cell-choose");
											$(this).next().find(".fundcard-checkbox").toggleClass("fundcard-checkbox-selected");
										})
										$(".fundcard-checkbox").bind("click",function(){
											$(this).parent().siblings(".card-cell").click();
										})
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
	
				}
				//结算勾选效果
				$(".settle-content-item .settle-checkbox").bind("click",function(){
					$(this).toggleClass("settle-checkbox-selected")
					var $elems=$(this).parents("table").find(".settle-content-item");
					var $target=$(this).parents("table").find(".settle-content-title .settle-checkbox")
					if($elems.length==$elems.find(".settle-checkbox-selected").length){
						$target.click()
					}else{
						$target.removeClass("settle-checkbox-selected");
						$target[0].num=0;
					}
					totalMoney();
				});
				var $elem=$(".settle-content-title .settle-checkbox");
				$elem.each(function(){this.num=0;})
				$(".settle .settle-checkbox").bind("click",function(){
					var thisDep=$(this).parents("table").find(".settle-department-name").text();
					var thatDep=$(this).parents("table").siblings().find(".settle-checkbox-selected").parents("table").find(".settle-department-name").eq(0).text();
					if(thisDep!=thatDep&&thatDep!=""){
						$(".settle-checkbox").removeClass("settle-checkbox-selected");
						$elem.each(function(){this.num=0;})
					}
				});
				$elem.bind("click",function(){
					if(this.num==0){
						this.num=1;
						$(this).addClass("settle-checkbox-selected");
						$(this).parents(".settle-content-title").nextAll(".settle-content-item").find(".settle-checkbox").addClass("settle-checkbox-selected");
					}else{
						this.num=0;
						$(this).removeClass("settle-checkbox-selected");
						$(this).parents(".settle-content-title").nextAll(".settle-content-item").find(".settle-checkbox").removeClass("settle-checkbox-selected");
					}
					totalMoney();
				});
			}	
			eventBind();
            /*时间控件*/
            laydate({
                elem: '#startTime'
            });
            laydate({
                elem: '#endTime'
            });
			//提交结算
			$(".settle .settle-header-submit").bind("click",function(){
				var url=baseUrl+urls.allUrls.submitStatement,  //提交结算地址
				$items=$(".settle-content-item .settle-checkbox-selected"),
				orderNos=[];
				$.each($items,function(){
					var orderNo=$(this).parents('td').next().text();
					orderNos.push(orderNo);
				});
				if(orderNos.length==0){
					dialog({
                        title: '提示',
                        modal: true,
                        content: "请选择订单",
                        ok: function() {},
                        cancel: false,
                    }).width(320).show();
                    return false;
				}
				var data={
					orderNos:orderNos,
					departmentId:$(".settle-content-item .settle-checkbox-selected").parents("table").find(".settle-department-id").eq(0).val()
				},
				callback=function(r){
					if(r.code=="0000"){
						var data={
							list:r.statements
						}
						$("#right-container").html(_.template(submitSettle,data));
						submitsettle();
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
				common.postData(url,data,callback,true);
			});
			//"待结算"选项卡选中
			common.tabFocus("待结算");
		}
	}
	return controller;
});
