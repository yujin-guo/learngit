define(function(){
	return function(){
				//勾选效果
				$(".settle-checkbox").bind("click",function(){
					$(this).toggleClass("settle-checkbox-selected")
				})
				var status=0;
				$(".settle-title .settle-checkbox").bind("click",function(){
					var $elems=$(".settle-content .settle-checkbox");
					if(status==0){
						status=1;
						$elems.addClass("settle-checkbox-selected")
					}else{
						status=0;
						$elems.removeClass("settle-checkbox-selected")
					}
				})
				//查看结算单
				$(".settle-content-check").bind("click",function(){
					var num=$(this).parents("td").siblings(".settle-statement-number").text().trim();
					var status=$(this).next(".settle-statement-number").val();
					var id=$(this).siblings(".settle-statement-id").val();
					window.location.href="#zzsettlementdetails?status="+encodeURIComponent(status)+"&num="+encodeURIComponent(num)+"&id="+encodeURIComponent(id);
				})
				//下载结算单
				var pdfUrl=baseUrl+urls.allUrls.multiPrint;//pdf地址
				$(".settle-content-print").bind("click",function(){
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
				})
				//导出验收单
				$(".settle-header-submit").bind("click",function(){
					var $that=$(this);
					var idList=[],
						callback=function(r){
							if(r.code=="0000"){
								$that.next("a").attr("href",baseUrl+"/"+r.url);
								var $span=$that.next("a").find(".settle-download");
								$span.bind("click",function(){}).click();
							}
						};
					$(".settle-statement-id").each(function(){
						idList.push($(this).val());
					});
					var data={
						idList:idList
					};
					common.postData(pdfUrl,data,callback,true);
				})
				
			}

});