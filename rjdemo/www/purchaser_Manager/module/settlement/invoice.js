define(['text!module/settlement/invoice.html','text!module/settlement/invoiceItem.html','css!module/settlement/style/invoice.css'],function(tpl,invoiceItemHtml){
	var controller=function(){
		var url=baseUrl+urls.allUrls.getSYXInvoice,
			printUrl=baseUrl+urls.allUrls.SYXprint,//打印出入库单地址
			ids=decodeURIComponent(common.getQueryString("ids")).split('-'),
			requestData={ids:ids},//请求参数
			callback=function(r){
				if(r.code=="0000"){
					$('#right-container').html(_.template(tpl,r));
					eventsBind();
				}else{
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: r.message,
	                    ok: function () {},
	                    cancel: false,
	                }).width(320).show();
				}
			};
		if(ids[0]){
			common.postData(url,requestData,callback,true);
		}else{
			var r={
				summaryInvoiceInfos:[],
				amount:0,
				count:0
			};
			$('#right-container').html(_.template(tpl,r));
			eventsBind();
		}
		
		function eventsBind(){
			var $totalMoney=$('#invoiceTotalMoney');//总金额
			var $totalOrder=$('#invoiceTotalOrder');//订单数量
			balancesCheck();
			//移除清单
			$(".invoice").on("click",'.invoice-balance-remove',function(){
				var money=parseFloat($(this).siblings('.invoice-balance-total-money').text().slice(1));
				var orderCount=$(this).find('.invoice-order-num').val();
				$(this).parents(".invoice-title-info").next().remove();
				$(this).parents(".invoice-title-info").remove();
				balancesCheck();
				var newMoney=parseFloat($totalMoney.text().slice(1)-money).toFixed(2);
				var newOrder=$totalOrder.text()-orderCount;
				$totalMoney.text('￥'+newMoney);
				$totalOrder.text(newOrder);
			})
			//添加发票清单
			$(".invoice-search-btn").on('click',function(){
				var $existedInvoice=$('.invoice-title-info .invoice-balance-number'),
					flag=false,//是否已存在结算汇总单
					url=baseUrl+urls.allUrls.addSYXInvoice,
					search=$('.invoice-search-box').val(),
					callback=function(r){
						if(r.code=="0000"){
							var data={i:r.summaryInvoiceInfo};
							$('.invoice-btn').before(_.template(invoiceItemHtml,data));
							balancesCheck();
							var newMoney=(parseFloat($totalMoney.text().slice(1))+parseFloat(data.i.amount)).toFixed(2);
							var newOrder=Number($totalOrder.text())+Number(data.i.orderCount);
							$totalMoney.text('￥'+newMoney);
							$totalOrder.text(newOrder);
						}else{
							dialog({
			                    title: '提示',
			                    modal:true,
			                    content: r.message,
			                    ok: function () {},
			                    cancel: false,
			                }).width(320).show();
						}
					};
				$existedInvoice.each(function(){
					if($(this).text()==search){
						flag=true;
						return false;
					}
				});
				if(flag){
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: '此结算汇总单已存在。',
	                    ok: function () {},
	                    cancel: false,
	                }).width(320).show();
	               	return false;
				}
				common.postData(url,{search:search},callback,true);
			});
			//输入框结算汇总单匹配
			var balanceMatchThrottle=_.debounce(balanceMatch,1500);
			$('.invoice-search-box').on('keyup',function(e){
				balanceMatchThrottle.call(this,e);
			}).on('blur',function(){
				$('.invoice-search-match').slideUp();
			});
			function balanceMatch(e){
				if(e.keyCode!=40&&e.keyCode!=38&&e.keyCode!=13){
					var url=baseUrl+urls.allUrls.matchSYXInvoice,
						search=$(this).val(),
						callback=function(r){
							if(r.code=="0000"){
								var str='';
								if(!r.nos){
									$('.invoice-search-match').hide();
									return false;
								}//不存在的汇总单不处理
								_.each(r.nos.slice(0,5),function(i){
									str+='<li>'+i+'</li>';
								});
								$('.invoice-search-match').html(str);
								$('.invoice-search-match').slideDown();
							}else{
								dialog({
				                    title: '提示',
				                    modal:true,
				                    content: r.message,
				                    ok: function () {},
				                    cancel: false,
				                }).width(320).show();
							}
						};
					if(search.length<5){
						return false;
					}else{
						common.postData(url,{search:search},callback,true);
					};
				}else if(e.keyCode==40){
					//键盘向下事件
					var $matchItems=$('.invoice-search-match li'),
						$selectedItem=$('.invoice-search-match-selected');
					if($matchItems.length){
						if($selectedItem.length){
							$selectedItem.next().addClass('invoice-search-match-selected').siblings().removeClass('invoice-search-match-selected');
						}else{
							$matchItems.eq(0).addClass('invoice-search-match-selected');
						}
					}else{
						return false;
					}
				}else if(e.keyCode==38){
					//键盘向上
					$selectedItem=$('.invoice-search-match-selected');
					if($selectedItem.length){
						$selectedItem.prev().addClass('invoice-search-match-selected').siblings().removeClass('invoice-search-match-selected');
					}else{
						return false;
					}
				}else{
					//enter事件
					var value=$('.invoice-search-match-selected').text();
					if(value){
						$('.invoice-search-box').val(value).blur();
						$('.invoice-search-btn').click();
					}
				}
			}
			//匹配点击选择
			$('.invoice-search-match').on('click','li',function(){
				var text=$(this).text();
				$('.invoice-search-box').val(text);
				$('.invoice-search-match').delay(300).slideUp();
			})	
			//确认接受
			$('.invoice-receive').on('click',confirmAccept.bind(this,false));
			//确认并打印
			$('.invoice-receive-print').on('click',confirmAccept.bind(this,true));
			function confirmAccept(isPrint){//true则为接收并打印
				var result=balancesCheck();
				if(!result){return false};
				var url=baseUrl+urls.allUrls.updateSYXStatus,
					$elems=$('.invoice-balance-id'),
					summaryNos=[],
					idList=[];
				$elems.each(function(){
					idList.push($(this).val());
				});
				$('.invoice-title-info .invoice-balance-number').each(function(){
					summaryNos.push($(this).text());
				});
				var data={
					idList:idList,
					status:1
				};
				var callback=function(r){
					if(r.code=="0000"){
						$('.invoice-balance-remove').click();
						if(isPrint){
							var callback=function(r){
								if(r.code=="0000"){
									var href=r.url;
									window.open(href);
								}else{
									dialog({
					                    title: '提示',
					                    modal:true,
					                    content: r.message,
					                    ok: function () {},
					                    cancel: false,
					                }).width(320).show();
								}
							}
							common.postData(printUrl,{summaryNos:summaryNos},callback,true);
						}
					}else{
						dialog({
		                    title: '提示',
		                    modal:true,
		                    content: r.message,
		                    ok: function () {},
		                    cancel: false,
		                }).width(320).show();
					}
				};
				dialog({
                    title: '提示',
                    modal:true,
                    content: isPrint?'确定接收并打印出入库单吗？':'确定接收发票清单吗？',
                    okValue:'确定',
                    ok: function () {
                    	common.postData(url,data,callback,true);
                    },
                    cancelValue:'取消',
                    cancel: function(){},
                }).width(320).show();
			}
		}
		//结算汇总单数量检测
		function balancesCheck(){
			if($(".invoice .invoice-title-info").length==0){
				$(".invoice-btn-one").css({'background-color':'#e4e4e4','color':'#999'});
				$(".invoice-no-content").show();
				return false;
			}else{
				$(".invoice-btn-one").css({'background-color':'#32ab94','color':'#fff'});
				$(".invoice-no-content").hide();
				return true;
			}
		}
	}
	return controller;
});
