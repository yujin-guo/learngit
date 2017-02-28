define(['text!module/settlement/settlement.html','text!module/settlement/loadSettle.html','css!module/settlement/style/settlement.css',"pagination","js/libs/laydate.dev"],function(tpl,loadSettle){
	var controller=function(){
		var hospitalName=$.cookie("organization");//医院名
		if(hospitalName=='浙江省肿瘤医院'){
			location.hash='zzsettlement';
			return false;
		};//浙肿结算列表跳转
		var isSYX=$.cookie("organization")=="中山大学附属第二医院"||$.cookie("organization")=="中山大学孙逸仙纪念医院",//Boolean值，判断是否为孙逸仙医院
			pdfUrl=baseUrl+urls.allUrls.multiPrint,//pdf地址
			updateUrl=baseUrl+urls.allUrls.updateSYXStatus,//结算单状态变更
			printUrl=baseUrl+urls.allUrls.SYXprint,//打印出入库单地址
		    pageSize=20,
		    data={
		    	pageNo:1,
	    		pageSize:pageSize,
		    },
		    totalNum;//结算单总条数
		var url=isSYX?(baseUrl+urls.allUrls.getSYXStatements):(baseUrl+urls.allUrls.getStatements);//isSYX为true，则请求孙逸仙医院结算单地址
		common.postData(url,data,getCallback(1),true);
		common.tabFocus("结算列表");//tab选中
		
		/*
		 * 回调函数
		 *@param {Number} flag 1为页面初次加载，2为分页回调函数，3为页面搜索刷新
		 *@param {Object} requestData 分页回调函数参数
		 *@return {Function} 回调函数
		 * */
		function getCallback(flag,requestData){//
			var callback=function(r){
				if(r.code=="0000"){
		    		totalNum=(r.totalPages||r.totalPage)*pageSize;//孙逸仙医院返回totalPage字段
		    		var data=isSYX?{statement:r.rows}:{statement:r.statementList};//根据医院赋值
		    		if(flag==1){
		    			$("#right-container").html(_.template(tpl,data))
		    			loadSettlement();//一次绑定事件
		    		}else{		    			
		    			$(".settle-content").html(_.template(loadSettle,data));//ajax局部刷新
		    			$(".settle-header-btn .settle-checkbox").removeClass("settle-checkbox-selected");//全选框重置
		    		}
					$(".total-page-num").text(r.totalPages||r.totalPage);
					eventBind();//刷新页面后需重新绑定的事件
					if(flag==1||flag==3){
						common.pageFun(totalNum,1,pageSize,page(requestData||{}));//页面初始化
						if(data.statement.length){
							$(".list-page").show();//分页标签
							$(".settle-header-btn").show();//全选标签
						}else{
							$(".list-page").hide();
							$(".settle-header-btn").hide();
						};
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
			return callback;
		}
		/**
		 * 分页回调函数
		 * @param {Object} data 搜索条件
		 * @return {function} 分页回调函数
		 * */
		function page(data){
			var pageCallback=function(i){
				var baseData={
					pageSize:pageSize,
					pageNo:i+1,
				};
				$.extend(data,baseData);
				common.postData(url,data,getCallback(2),true);
			};
			return pageCallback;
		}
		
		//页面局部刷新后需要绑定的事件
		function eventBind(){
			//结算勾选效果
			$(".settle-content .settle-checkbox").bind("click",function(){
				$(this).toggleClass("settle-checkbox-selected");
				var boxNum=$(".settle-content .settle-checkbox").length,
					selectNum=$(".settle-content .settle-checkbox-selected").length;
				if(boxNum==selectNum){
					$(".settle-header-btn .settle-checkbox").addClass("settle-checkbox-selected");
				}else{
					$(".settle-header-btn .settle-checkbox").removeClass("settle-checkbox-selected");
				}
			})
			//查看结算详情单
			$(".settle-content-check").bind("click",function(){
				var num=$(this).parents(".settle-content-item").find(".settle-balance-number").text().trim();//结算单号
				var status=$(this).siblings(".settle-statement-id").attr("data-status");
				var id=$(this).siblings(".settle-statement-id").val();
				window.location.hash="settlementdetails?status="+encodeURIComponent(status)+"&num="+encodeURIComponent(num)+"&id="+encodeURIComponent(id);
			})
			//下载验收单
			$(".settle-content-print-other").bind("click",function(){
				var $that=$(this);
				var data={
					idList:[$that.parents("td").find(".settle-statement-id").val()],
				},
				callback=function(r){
					if(r.code=="0000"){
						$that.next("a").attr("href",baseUrl+"/"+r.url);
						var $span=$that.next("a").find(".settle-download");
						$span.bind("click",function(){}).click();
					}
				};
				common.postData(pdfUrl,data,callback,true);
			});
			//孙逸仙医院接受发票清单
			var $items=$('.settle-content-item');
			$items.on("click",".settle-content-receive-syx",function(){updateBalanceStatus.call(this,1);});
			//孙逸仙提交财务
			$items.on("click",".settle-content-submit-syx",function(){updateBalanceStatus.call(this,2);});
			//打印出入库单
			$items.on("click",".settle-content-print-syx",function(){
				var summaryNos=$(this).parents('td').siblings('.settlement-number').find('.settle-balance-number').text();
				var data={
					summaryNos:[summaryNos]
				};
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
				};
				common.postData(printUrl,data,callback,true);
			})
		}
		//状态变更函数
		function updateBalanceStatus(status){
			var $that=$(this),
				$parentsTd=$that.parents("td"),
				id=$parentsTd.find(".settle-statement-id").val(),
				$statusDesc=$that.parents("td").prev();
				requestData={
					idList:[id],
					status:status
				},
				callback=function(r){
					if(r.code=="0000"){
						if(status==1){
							$statusDesc.text("待审核");
							$parentsTd.append('<p><a href="javascript:;" class="settle-content-print settle-content-print-syx">打印出入库单</a><a href="javascript:;" download><span class="settle-download"></span></a></p>');
							$parentsTd.append('<p><a href="javascript:;" class="settle-content-check settle-content-submit-syx">提交财务</a></p>');
							$that.parent().remove();
						}else{
							$statusDesc.text("待付款");
							$that.parent().remove();
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
                content: status==1?"确定接受发票清单吗？":"确定提交财务吗？",
                ok: function () {
                	common.postData(updateUrl,requestData,callback,true);
                },
                okValue:"确定",
				cancelValue:"取消",
                cancel: function(){},
            }).width(320).show();	
		}
		
		function loadSettlement(){
			//面包屑导航
			$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;结算列表</span>");
			//搜索
			$(".settle-more-btn-search").bind("click",function(){
				supplierName=$.trim($(".settle-more-supplier").val()),
				status=$.trim($(".settle-more-status").val()),
				startTime=$.trim($("#startTime").val())||"1975-01-01",
				endTime=$.trim($("#endTime").val())||"2100-01-01",
				queryTerm=$(".settle-more-search-input").val().trim(),
				otherHospitalsData={
					pageNo:1,
		    		pageSize:pageSize,
			    	querySet:{
			    		endTime:endTime,
			    		startTime:startTime
			    	}
				},//其他医院请求参数
				SYXData={
					pageNo:1,
		    		pageSize:pageSize,
		    		endDate:endTime,
		    		startDate:startTime
				};//孙逸仙医院请求参数
				var searchData=isSYX?SYXData:otherHospitalsData;//判断请求参数
				if(status!=""&&status!="全部"){
					switch(status){
						case "待提交验收单":status=4;
						break;
						case "待提交供应商":status=5;
						break;
						case "待开票":status=0;
						break;
						case "待填发票":status=6;
						break;
						case "待递送":status=7;
						break;
						case "待审核":status=1;
						break;
						case "待付款":status=2;
						break;
						case "已完成":status=3;
						break;
					}
					if(isSYX){
						searchData.status=status;
					}else{
						searchData.querySet.status=status;
					}
				};
				if(queryTerm){
					if(isSYX){
						searchData.term=queryTerm;
					}else{
						searchData.querySet.queryTerm=queryTerm;
					}
				};
				common.postData(url,searchData,getCallback(3,searchData),true);
			})
			//下载验收单
			$(".settle-header-submit-other").bind("click",function(){
				var $that=$(this);
				var idList=[];
				var $elems=$(".settle-content-item .settle-checkbox-selected");
				if($elems.length==0){
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: "请选择结算单。",
	                    ok: function () {},
	                    cancel: false,
	                }).width(320).show();
				}else{
					$elems.each(function(){
						var id=$(this).parents(".settle-content-item").find(".settle-statement-id").val();
						idList.push(id);
					});
					var data={
						idList:idList
					};
					var callBack=function(r){
						if(r.code=="0000"){
							$that.next("a").attr("href",baseUrl+"/"+r.url);
							var $span=$that.next("a").find(".settle-download");
							$span.bind("click",function(){}).click();
						}
					}
					common.postData(pdfUrl,data,callBack,true);
				}
			});
			//批量接受发票清单
			$(".settle-sunyixian-receive").on('click',function(){
				var $elems=$(".settle-content-item").find(".settle-checkbox-selected");
				var ids=[];
				$elems.each(function(){
					var id=$(this).parents(".settle-content-item").find(".settle-statement-id").val();
					ids.push(id);
				});
				ids=ids.join('-');
				window.location.href="#invoice?ids="+encodeURIComponent(ids);

			})
			//孙逸仙医院批量提交财务
			$(".settle-sunyixian-submit").on('click',function(){
				var $elems=$(".settle-content-item .settle-checkbox-selected");
				var idList=[];
				$elems.each(function(){
					var id=$(this).parents(".settle-content-item").find('.settle-statement-id').val();
					idList.push(id);
				});
				var data={
					idList:idList,
					status:2
				};
				if(idList.length==0){
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: '请选择结算单',
	                    ok: function () {},
	                    cancel: false,
	                }).width(320).show();
	                return false;
				}
				var	callback=function(r){
					if(r.code=='0000'){
						$elems.each(function(){
							var $target=$(this).parents(".settle-content-item").find(".settle-content-submit-syx");//接收财务按钮
							$target.parents('td').prev().text('待付款');
							$target.parent().remove();
							dialog({
			                    title: '提示',
			                    modal:true,
			                    content: '提交成功。',
			                    ok: function () {},
			                    cancel: false,
			                }).width(320).show();
						})
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
				common.postData(updateUrl,data,callback,true);
			});
			//批量打印出入库单
			$('.settle-sunyixian-print').on('click',function(){
				var $items=$('.settle-content-item');
				var summaryNos=[];
				$items.find('.settle-checkbox-selected').each(function(){
					var summaryNo=$(this).next().text();
					summaryNos.push(summaryNo);
				});
				var data={
					summaryNos:summaryNos
				};
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
				};
				if(summaryNos.length){
					common.postData(printUrl,data,callback,true);
				}else{
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: '请选择结算单。',
	                    ok: function () {},
	                    cancel: false,
	                }).width(320).show();
				}
			})
			//时间控件
			laydate({
				elem:"#startTime"
			});
			laydate({
				elem:"$endTime"
			})
			//状态选择
			$(".settle-more-status").focus(function(){
				$(".settle-status-choices").slideDown("slow")
			}).blur(function(){
				$(".settle-status-choices").delay(200).slideUp("slow")
			});
			$(".settle-status-choices li").bind("click",function(){
				var txt=$(this).text();
				$(".settle-more-status").val(txt);
			});
			//全部勾选
			$(".settle-header-btn .settle-checkbox").bind("click",function(){
				$(this).toggleClass("settle-checkbox-selected");
				var $elems=$(".settle-content .settle-checkbox");
				if($(this).hasClass("settle-checkbox-selected")){
					$elems.addClass("settle-checkbox-selected");
				}else{
					$elems.removeClass("settle-checkbox-selected");
				}
			});
		}
	}
	return controller;
});
