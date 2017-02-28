define(['text!module/order/commentList.html', 'text!module/order/loadCommentList.html', 'css!module/order/style/order.css', "pagination"], function(tpl, loadHtml) {
	var controller = function(orderNo) {
		var base = common.serverBaseUrl;
		var pageSize = 20;
		var url = base + "/api/order/getComments", //评论列表
			data = {
				pageNo: 1,
				pageSize: pageSize
			},
			callback = function(r) {
				if(r.code == "0000") {
					$("#right-container").html(_.template(tpl, r));
					if(r.hasOwnProperty("comments")==false||r.comments.length==0){
						$(".list-page").hide();
					}else{
						$(".list-page").show();
					}

					//面包屑导航
					$(".bread").html("<span class='bread-span'><a href='index.html' class='purchase-bread'>管理中心</a></span><span class='bread-span'>&gt;&nbsp;我的评价</span>");
					common.pageFun(r.totalPages * pageSize, 1, pageSize, page(data)); //分页初始化
				}
			};
		common.postData(url, data, callback, true)
		common.tabFocus("我的评价");
		/* 
		 * 分页回掉函数设置
		 * @param{object} data 请求数据（默认请求pageNo和pageSize参数，不可更改）
		 * @return{function} 返回分页回调函数pageCallback
		 * */
		function page(data) {
			var pageCallback = function(i) {
				baseData = {
						pageNo: i + 1,
						pageSize: pageSize
					},
					callback = function(r) {
						if(r.code == "0000") {
							totalNum = r.totalPages * pageSize;
							$("#commentWrapper").html(_.template(loadHtml, r));
							if(r.hasOwnProperty("comments")==false||r.comments.length==0){
								$(".list-page").hide();
							}else{
								$(".list-page").show();
							};
							window.scrollTo(0, 0);
						}
					};
				$.extend(data, baseData);
				common.postData(url, data, callback, true);
			}
			return pageCallback;
		}

		/* 
		 * 搜索页面更新
		 * @param{object} data 请求数据（默认请求pageNo和pageSize参数，不可更改）
		 * */
		/*function pageUpdate(data) {
			var baseData = {
				pageNo: 1,
				pageSize: pageSize,
			};
			$.extend(data, baseData);
			var callback = function(r) {
				if(r.code == "0000") {
					totalNum = pageSize * r.totalPages; //数据总条数更新
					$("#commentWrapper").html(_.template(loadHtml, r)) //页面更换数据
					if(r.orderLists == undefined) {
						$(".list-page").hide()
					} else {
						$(".list-page").show()
					}
					window.scrollTo(0, 0) //滚动条设置
					common.pageFun(totalNum, 1, pageSize, page(data)); //分页初始化
				};
			}
			common.postData(url, data, callback, true)
		}*/

	}
	return controller;
});