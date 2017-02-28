define(['text!index.html','text!module/bid_list/bid.html',"text!module/bid_list/bidDetails.html","text!module/bid_list/bidList.html",'css!module/bid_list/style/bid.css','css!module/bid_list/style/bidDetails.css',"pagination",'js/libs/laydate.dev'],function(indexhtml,tpl,orderDetails,bidList){
	var controller=function(status){
		//由于页面框架不同，竞价详情页面回退至此页面将访问cookie进行页面刷新。
		if($.cookie("biddetails")){
			$.cookie("biddetails",'',{expires:-1});
			location.reload();
		};
		var url=bidUrl+urls.allUrls.getBidList,//竞价列表地址
			deptUrl=bidUrl+urls.allUrls.getDeptList,//获取部门
			totalNum,
			deptId=0,
			pageSize=20,
			requestData={
				currentPage:1,
				pageSize:pageSize,
			},
			callback=function(r){
				if(r.resultCode=="0000"){
					_.each(r.entities,function(i){
						i.startDate=convertTime(i.startDate);
						i.endDate=convertTime(i.endDate);
					});
					$("#right-container").html(_.template(tpl,r));
					if(r.entities.length){
						$("#pagination").show();
					}else{
						$("#pagination").hide();
					};
					totalNum=r.total;
					allEventsBind();
					common.postData(deptUrl,{},deptCallback,true);//采购部门
				}else{
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: r.msg,
	                    ok: function () {},
	                    cancel: false
	                }).width(320).show();
				}
			},
			deptCallback=function(r){
				if(r.resultCode=="0000"){
					var str='<%_.each(depts,function(i){%><li data-id="<%=i.id%>"><%=i.name%></li><%})%>';
					$(".bidlist-dept-choices").html(_.template(str,r));
					//部门选取
					$(".bidlist-dept-choices li").click(function(){
						var txt=$(this).text();
						deptId=$(this).attr("data-id");
						$(".bidlist-more-department").val(txt);
					});
					$(".bidlist-more-department").focus(function(){
						$(".bidlist-dept-choices").slideDown("slow");
					}).blur(function(){
						$(".bidlist-dept-choices").delay(300).slideUp("slow");
					})
				}else{
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: r.msg,
	                    ok: function () {},
	                    cancel: false
	                }).width(320).show();
				}
			};
		if(status){
			requestData.status=parseInt(status);
		}
		common.postData(url,requestData,callback,true);
		common.tabFocus("竞价列表");
		
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
		
		function allEventsBind(){
		   /* 
		    * 分页回掉函数设置
		    * @param{object} data 请求数据（默认请求pageNo和pageSize参数，不可更改）
		    * @return{function} 返回分页回调函数pageCallback
		    * */
			function page(data){
				var pageCallback=function(i){
					var baseData={
						currentPage:i+1,
						pageSize:pageSize
					},
					callback=function(r){
						if(r.resultCode=="0000"){
							_.each(r.entities,function(i){
								i.startDate=convertTime(i.startDate);
								i.endDate=convertTime(i.endDate);
							});
							totalNum=r.total;
							$("#bidItemWrap").html(_.template(bidList,r));
							window.scrollTo(0,0);
							eventBind();
						}
					};
					$.extend(data,baseData);
					common.postData(url,data,callback,true);
				}
				return pageCallback;
			}	
			
		   /* 
		    * 搜索页面更新
		    * @param{object} data 请求数据（默认请求pageNo和pageSize参数，不可更改）
		    * */
			function pageUpdate(data){
				var baseData={
					currentPage:1,
					pageSize:pageSize,
				};
				$.extend(data,baseData);
				var callback=function(r){
					if(r.resultCode=="0000"){
						_.each(r.entities,function(i){
							i.startDate=convertTime(i.startDate);
							i.endDate=convertTime(i.endDate);
						});
						totalNum=r.total;
						$("#bidItemWrap").html(_.template(bidList,r))//页面更换数据
						if(r.entities.length){
							$("#pagination").show();
						}else{
							$("#pagination").hide();
						}
						window.scrollTo(0,0)//滚动条设置
						eventBind()//页面事件绑定
						common.pageFun(totalNum, 1, pageSize, page(data));//分页初始化
					}else{
						dialog({
		                    title: '提示',
		                    modal:true,
		                    content:r.msg,
		                    ok: function () {},
		                    cancel: false
		                }).width(320).show();
					}
				}
				common.postData(url,data,callback,true)
			};

			function eventBind(){
				//提交初审
				$(".bidlist-submit").bind("click",function(){submitDraft.apply(this)});
				//提交函数函数
				function submitDraft(){
					var $that=$(this);
					var id=$(this).siblings(".bidlist-item-id").val();
					var	data={
							id:id
						},
						url=bidUrl+urls.allUrls.submitBid+id,
						callback=function(r){
							if(r.resultCode=="0000"){
								dialog({
				                    title: '提示',
				                    modal:true,
				                    content: "提交初审成功。",
				                    ok: function () {
				                    	$that.parents("td").siblings(".bidlist-main-status").text("初审中");
				                    	$that.siblings("p").remove();
				                    	$that.before('<p class="bidlist-main-item-btn bidlist-item-revoke">撤回申请</p>');
				                    	$that.remove();
				                    	$(".bidlist-item-revoke").bind("click",function(){revokeBid.apply(this)});
				                    },
				                    cancel: false,
				                }).width(320).show();
							}else{
								dialog({
				                    title: '提示',
				                    modal:true,
				                    content:r.msg,
				                    ok: function () {},
				                    cancel: false
				                }).width(320).show();
							}
						};
					dialog({
	                    title: '提示',
	                    modal:true,
	                    content: "您确定提交初审吗？",
	                    okValue:"确定",
	                    ok: function () {
	                    	common.postData(url,data,callback,true);
	                    },
	                    cancelValue:"取消",
	                    cancel: function(){}
	                }).width(320).show();
	           };
	            //撤回申请
	            $(".bidlist-item-revoke").bind("click",function(){revokeBid.apply(this)});
	            function revokeBid(){
	            	var $that=$(this);
	            	var url=bidUrl+urls.allUrls.revokeBid;
	            	var data={
	            		id:$(this).siblings(".bidlist-item-id").val()
	            	};
	            	var callback=function(r){
	            		if(r.resultCode=="0000"){
	            			$that.parents("td").siblings(".bidlist-main-status").text("草稿");
	                    	$that.after('<p class="bidlist-main-item-btn2 bidlist-amend">修改</p>');
	                    	$that.after('<p class="bidlist-main-item-btn bidlist-submit">提交初审</p>');
	                    	$that.parent().append('<p class="bidlist-main-item-btn2 bidlist-item-delete">删除</p>');
	                    	$that.remove();
	                    	$(".bidlist-amend").bind("click",function(){
					            var id=$(this).siblings(".bidlist-item-id").val();
					           	window.location.href="#newbidsec?id="+id;
					        });
					        $(".bidlist-submit").bind("click",function(){submitDraft.apply(this)});
					        $(".bidlist-item-delete").bind("click",function(){deleteDraft.apply(this)});
	            		}else{
	            			dialog({
			                    title: '提示',
			                    modal:true,
			                    content:r.msg,
			                    ok: function () {},
			                    cancel: false
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
	            };
	           
		        //修改竞价
		        $(".bidlist-amend").bind("click",function(){
		            var id=$(this).siblings(".bidlist-item-id").val();
		            var deptId=$(this).siblings(".bidlist-item-deptid").val();
		           	window.location.href="#newbidsec?id="+id+"&deptId="+deptId;
		        })
		        //删除草稿
		        $(".bidlist-item-delete").bind("click",function(){deleteDraft.apply(this)});
		        function deleteDraft(){
		        	var $that=$(this);
		        	var id=$(this).siblings(".bidlist-item-id").val();
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
					         			$that.parents(".bidlist-main-item").remove();
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
		        };
			};
			eventBind()
		
		//更多选项
			$(".bidlist-title-more").bind("click",function(){
				var txt=$(this).text();
				if(txt=="更多"){
					$(this).text("收起");
				}else{
					$(this).text("更多");
				}
				$(".bidlist-main-more").toggle();
			})

		//搜索
			$(".bidlist-title-search-btn").bind("click",function(){
				var searchData={
					search:$.trim($(".bidlist-title-search-txt").val()),
				};
				pageUpdate(searchData)
			})	
			$(".bidlist-title-search-txt").keydown(function(e){
				if(e.keyCode=="13"){
					$(".bidlist-title-search-btn").click()
				}
			})
		//更多搜索
			$(".bidlist-more-btn-search").bind("click",function(){
				var txt=$.trim($(".bidlist-more-status").val());
				var status;
				switch(txt){
					case "草稿":status=0;
					break;
					case "初审中":status=10;
					break;
					case "初审驳回":status=19;
					break;
					case "竞价中":status=20;
					break;
					case "初选中":status=30;
					break;
					case "终审中":status=40;
					break;
					case "终审驳回":status=49;
					break;
					case "竞价完成":status=50;
					break;
					case "已流标":status=29;
					break;
					default:status=null;
				};
				var searchData={
					deptId:parseInt(deptId)||null,
					status:status,
					sn:$.trim($(".bidlist-more-number").val())||null,
					startDate:$.trim($("#startTime").val())||"1970-01-01",
					endDate:$.trim($("#endTime").val())||"2100-01-01",
				};
				pageUpdate(searchData);
			})	
			//重置
			$(".bidlist-more-btn-reset").bind("click",function(){
				$(".bidlist-more-input").val("");
			})
			//竞价状态选取
			$(".bidlist-status-choices li").click(function(){
				var txt=$(this).text();
				$(".bidlist-more-status").val(txt);
			})
			$(".bidlist-more-status").focus(function(){
				$(".bidlist-status-choices").slideDown("slow");
			}).blur(function(){
				$(".bidlist-status-choices").delay(300).slideUp("slow");
			});

		//竞价tab切换
			$(".bidlist-title-list li").bind("click",function(){
				$(this).addClass("bidlist-title-list-highlight").siblings().removeClass("bidlist-title-list-highlight");
				var txt=$(this).text();
				if(txt=="全部"){
					pageUpdate({})
				}
				if(txt=="草稿"){
					var datas={
						status:0
					};
					pageUpdate(datas)
				}
				if(txt=="初选"){
					var datas={
						status:30
					};
					pageUpdate(datas)
				}
				if(txt=="驳回"){
					var datas={
						statusAry:[19,49]
					};
					pageUpdate(datas)
				}
			});
			//时间控件
			laydate({
				elem:"#startTime"
			});
			laydate({
				elem:"#endTime"
			})
			common.pageFun(totalNum, 1, pageSize, page({})) ;	//页码初始化
		}
	}
	return controller;
});