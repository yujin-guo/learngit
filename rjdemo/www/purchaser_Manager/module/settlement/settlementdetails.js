define(['text!module/settlement/settlementDetails.html', "text!module/settlement/reviseCard.html", 'js/libs/pdfobject','css!module/settlement/style/settlement.css'], function(tpl, reviseCardHtml) {
	var controller = function() {
		var isSYX=$.cookie("organization")=="中山大学附属第二医院"||$.cookie("organization")=="中山大学孙逸仙纪念医院",//Boolean值，判断是否为孙逸仙医院
			urlNum=common.getQueryString('num'),//url中的结算号
			urlId=common.getQueryString('id'),//url中的结算id
			settlementDetails = {},//模板数据
			pdfUrl = isSYX?baseUrl + urls.allUrls.SYXprint:baseUrl + urls.allUrls.multiPrint, //pdf文件请求地址
			pdfData = isSYX?{summaryNos:[urlNum]}:{idList: [urlId]},
			
			SYXUrl=(urlNum.indexOf("JS")!=-1)?(baseUrl+urls.allUrls.getSYXStatementDetails):(baseUrl + urls.allUrls.getSYXStatementDetails2),//孙逸仙医院，判断请求地址
			SYXRequstData=(urlNum.indexOf("JS")!=-1)?{summaryId:urlId}:{statementId:urlId},//结算单和结算汇总单请求参数判断，JS开头为结算汇总单
			url = isSYX?SYXUrl:(baseUrl + urls.allUrls.getStatementDetails), //isSYX为true，则请求孙逸仙医院结算单地址
			data = isSYX?SYXRequstData:{statementNo:urlNum},//孙逸仙和其他医院请求参数判断
			callback = function(r) {
				if(r.code == "0000") {
					settlementDetails = {
						details: r,
						status: common.getQueryString('status'),
					};
					$("#right-container").html(_.template(tpl, settlementDetails));
					eventsBind();
					common.postData(pdfUrl, pdfData, pdfCallback, true)
				}else{
					dialog({
						title: '提示',
						modal: true,
						content: r.message,
						ok: function() {},
						cancel: false,
					}).width(320).show();
				}
			},
			pdfCallback = function(r) {
				if(r.code == "0000") {
					var pdf=isSYX?r.url: baseUrl+"/"+r.url;
					$('.s-details-print,.s-details-preview').attr('href',pdf);
				}
			};
		common.postData(url, data, callback, true);
		
		function eventsBind() {
			//面包屑导航
			$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;<a href='#settlement' class='purchase-bread'>结算列表</a></span><span class='bread-span'>&gt;&nbsp;结算详情</span>");
			//接收发票清单
			$('.s-details-receive').off().on('click',function(){
				var $that=$(this);
				var url=baseUrl+urls.allUrls.updateSYXStatus,
					data={
						idList:[urlId],
						status:1
					},
					callback=function(r){
						if(r.code=="0000"){
							location.reload();
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
				dialog({
					title: '提示',
					modal: true,
					content: "确定提交发票清单吗？",
					okValue:"确定",
					ok: function() {
						common.postData(url,data,callback,true);
					},
					cancelValue:"取消",
					cancel: function(){},
				}).width(320).show();
			})
			//修改经费卡
			var orderId; //订单id
			var $theReviseOrder; //指向修改的订单栏
			$(".settle-revise").bind("click", function() {
				$theReviseOrder = $(this); //绑定修改的订单栏
				var $fundCards = $(this).parents(".settle-title-revise").find("p");
				var fundCards = []; //列表中已选的经费卡数组
				var hasCards = []; //已选的经费卡
				var notChoosed = []; //未选的经费卡
				$fundCards.each(function() {
					fundCards.push($(this).text());
				});
				orderId = $(this).next(".settle-order-id").val();
				var getCardUrl = baseUrl + urls.allUrls.getOrderCard, //获取经费卡
					updateCardUrl = baseUrl + urls.allUrls.updateOrderCard, //更新经费卡
					getCardData = {
						orderId: orderId
					},
					reviseCardData = {
						fundcards: [{
							id: "",
							cardNo: "",
							cardName: ""
						}]
					},
					callback = function(r) {
						if(r.code == "0000") {
							_.each(r.fundCards, function(i) {
								var num = 0;
								_.each(fundCards, function(item) {
									if(i.cardNo == item) {
										hasCards.push(i);
										return false;
									} else {
										num++;
									}
								})
								if(num == fundCards.length) {
									notChoosed.push(i);
								}
							})
							var data = {
								hasCards: hasCards,
								notChoosed: notChoosed,
							}
							
							$("body").append(_.template(reviseCardHtml, data));
							window.scroll(0,0);
							cardEvents();
						}
					}
				common.postData(getCardUrl, getCardData, callback, true)
			})

			function cardEvents() {
				$(".card-cell-add").hide();//隐藏添加经费卡
				var fundcardsArr=[];//选择的经费卡号
					$(".card-cell-choose").each(function(){
						var $that=$(this);
						var data={
							id:$that.find(".card-hidden").attr("data-id"),
							cardNo:$that.find(".card-num").text(),
							cardName:$that.find(".class-card-icon").text(),
						};
						fundcardsArr.push(data);
					})
				//关闭经费卡
				$(".card-head-icon,.card-sure-cancel").bind("click", function() {
					$(".purchase-card-wrap,.card-wrap").remove();
				});
				//选择经费卡
				$(".card-cell").bind("click", function() {
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
								fundcardsArr.splice(index,1);
							}
						});
					};
				});
				$(".fundcard-checkbox").bind("click",function(){
					$(this).parent().siblings(".card-cell").click();
				});
				//提交经费卡
				$(".card-sure-link").bind("click", function() {
					var url = baseUrl + urls.allUrls.updateOrderCard;
					var requestData = {
						fundCards: fundcardsArr,
						orderId: orderId
					};
					var callback = function(r) {
						if(r.code == "0000") {
							dialog({
								title: '提示',
								modal: true,
								content: "修改成功。",
								ok: function() {},
								cancel: false,
							}).width(320).show();
							$(".purchase-card-wrap,.card-wrap").remove(); //关闭修改经费卡号弹窗
							var str = '<%_.each(fundCards,function(i){%><p><%=i.cardNo%></p><%})%>';
							$theReviseOrder.siblings("span").html(_.template(str,{fundCards:fundcardsArr}))
						}
					};
					common.postData(url, requestData, callback, true)
				})
			}
			//孙逸仙医院结算单展开动态效果
			$(".sunyixian-settle-content").hide();
			$(".s-details-balance-item").on("click",function(){
				$(this).toggleClass("s-details-balance-item-spread");
				if($(this).hasClass("s-details-balance-item-spread")){
					$(this).next(".settle-content").show();
				}else{
					$(this).next(".settle-content").hide();
				}
			});
		}
	}
	return controller;
});
